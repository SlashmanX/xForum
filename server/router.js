var AM = require('./modules/account-manager');
var CM = require('./modules/category-manager');
var FM = require('./modules/forum-manager');
var TM = require('./modules/topic-manager');
var PM = require('./modules/post-manager');
var CT = require('./modules/country-list');
var RM = require('./modules/role-manager');
var Settings = require('./modules/settings-manager');

var ADMIN = require('./modules/admin-manager');


var	functions	=	require('../shared/functions.js');
var	moment		=	require('moment');
var	mongoose	=	require('mongoose');
var	async		=	require('async');


mongoose.connect('localhost', 'xForum');

module.exports = function(app, socket) {
	
	// First middleware

	var checkUser = function(req, res, next){
	   if (req.cookies.username == undefined || req.cookies.pass == undefined){
	      return res.render('login', { title: 'Hello - Please Login To Your Account' });
	   }

	   return next();
	};

	// Second Middleware

	var getUser = function (req, res, next) {

		var username = req.cookies.username || req.params.username;
		var pass = req.cookies.pass || req.params.pass;

		AM.autoLogin(username, pass, function(o){
			res.locals.udata = o;
			next();
		});

	};

	// Third middleware

	var loginUser = function (req, res, next) {
		var user = res.locals.udata;

		if (user != null) {
		   req.session.user = user;
			next();
		} else {
		   res.render('login', { title: 'Hello - Please Login To Your Account' });
		}

	};
	
	var checkAdmin = function(req, res, next) {
		var user = res.locals.udata;
		
		if(user.role && user.role.permissions.CAN_ACCESS_CONTROL_PANEL)
			next();
		else
			res.render('404', { title: 'Page Not Found'});
			
	};

    app.get('/install/', function(req, res){
        res.render('install', {title: 'Installing xForum'});
    });

    app.post('/install/', function(req, res){
        RM.create({ "name" : "Guest"}, function(err, guest){
            if(guest) {
                RM.create({ "name" : "Member",
                    "defaultRole" : guest._id,
                    "permissions" : {
                        "CAN_DELETE_OWN_POSTS" : true,
                        "CAN_EDIT_OWN_POSTS" : true,
                        "CAN_POST" : true,
                        "CAN_CREATE_TOPIC" : true
                    }
                }, function(err, member){
                    Settings.add({
                        dbName: 'defaultRole',
                        displayName: 'Default Role',
                        description: 'The role to which users will be assigned on registration',
                        value: member._id
                    }, function(){});

                    RM.create({ "name" : "Administrator",
                        "defaultRole" : member._id,
                        "permissions" : { "CAN_DELETE_TOPICS" : true,
                            "CAN_DELETE_OTHERS_POSTS" : true,
                            "CAN_DELETE_OWN_POSTS" : true,
                            "CAN_EDIT_OTHERS_POSTS" : true,
                            "CAN_EDIT_OWN_POSTS" : true,
                            "CAN_POST" : true,
                            "CAN_CREATE_TOPIC" : true,
                            "CAN_CREATE_FORUM" : true,
                            "CAN_CREATE_CATEGORY" : true,
                            "CAN_ACCESS_CONTROL_PANEL" : true
                        }
                    }, function(err, admin){
                        AM.signup({ username: req.param('username'),
                            password: req.param('password'),
                            role: admin._id
                        }, function(err){
                            if(!err)
                                res.send('ok', 200);
                        })
                    })
                })
            }
        })
    })
	
	app.post('/login/', function(req, res){
		if (req.param('email') != null){
			AM.getEmail(req.param('email'), function(o){
				if (o){
					res.send('ok', 200);
					//EM.send(o, function(e, m){ console.log('error : '+e, 'msg : '+m)});	
				}	else{
					res.send('email-not-found', 400);
				}
			});
		}	else{
		// attempt manual login //
			AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
				if (!o){
					res.send(e, 400);
				}	else{
				    req.session.user = o;
					if (req.param('remember-me') == 'true'){
						res.cookie('username', o.username, { maxAge: 900000 });
						res.cookie('pass', o.password, { maxAge: 900000 });
					}
					res.send(o, 200);
				}
			});
		}
	});	
	
	// logged-in user homepage //
	
	app.get('/', checkUser, getUser, loginUser, function(req, res) {
		CM.listHomePage(req.session.user, function(e, categories){
			if(e) {
				console.error('Error getting categories: '+ e);
			}
			res.render('home', { title : 'Home | xForum', categories : categories });
		})
		
	});
	
	app.get('/category/:slug/', checkUser, getUser, loginUser, function(req, res) {
		CM.listOne(req.param('slug'), req.session.user._id, function(e, category){
			if(e) {
				console.error('Error getting category: '+ e);
			}
			res.render('category', { title : category.name +' | xForum', category : category });
		})
	});
	
	app.get('/create/:what/', checkUser, getUser, loginUser, function(req, res){
		CM.listAll( function(e, categories){
			res.render('create', { title : 'Create New '+ req.param('what').capitalize() +' | xForum', categories : categories, what: req.param('what'), parent: req.param('pid')})
		})
	});
	
	app.get('/forum/:slug/:page?/:pagenum?/', checkUser, getUser, loginUser, function(req, res) {
        var userRole = req.session.user.role;


		FM.listBySlug({slug: req.param('slug'), user: req.session.user}, function(e, forum) {
			if(e || !forum) {
				console.error('Error getting forum '+ req.param('slug') + ': '+ e);
                res.render('404', { title: 'Page Not Found'});
			}
            else{
                var tLength = forum.topics.length;
                var count = 0;
                async.whilst(
                    function () { return count < tLength;},
                    function(cb) {
                        TM.checkRead(req.session.user._id, forum.topics[count]._id, function(read){
                            forum.topics[count].isRead = read;
                            count++;
                            cb();
                    });
                },
                function(err) {
                    var forumId = forum._id;
                    //Role is not global and it's not applicable here
                    // TODO: Move this out middleware
                    if(userRole.applicableAreas.length && userRole.applicableAreas.indexOf(forumId) == -1)
                    {
                        RM.getRolePermissions(userRole.defaultRole, function(err, perms){
                            res.locals.udata.role.permissions = perms.permissions;
                            res.render('forum', {title : 'Viewing Forum: '+ forum.name +' | xForum', forum: forum});
                        })
                    }
                    else {
                        res.render('forum', {title : 'Viewing Forum: '+ forum.name +' | xForum', forum: forum});
                    }
                })
            }
			
		});
	});
	
	app.get('/topic/:slug/:page?/:pagenum?/', checkUser, getUser, loginUser, function(req, res) {
		TM.getTopic({slug: req.param('slug'), user: req.session.user}, function(e, topic) {
			if(e || !topic) {
				console.error('Error getting topic '+ req.param('slug') + ': '+ e);
                res.render('404', { title: 'Page Not Found'});
			}
            else {
                var forumId = topic.forum._id;
                var userRole = req.session.user.role;
                if(userRole.applicableAreas.length && userRole.applicableAreas.indexOf(forumId) == -1)
                {
                    RM.getRolePermissions(userRole.defaultRole, function(err, perms){
                        res.locals.udata.role.permissions = perms.permissions;
                        res.render('topic', {title : 'Viewing Topic: '+ topic.title +' | xForum', topic: topic});
                    })
                }
                else {
                    res.render('topic', {title : 'Viewing Topic: '+ topic.title +' | xForum', topic: topic});
                }
            }
		});
	});
	
	app.post('/post/edit/:postid/', checkUser, getUser, loginUser, function(req, res) {
		var originalAuthor = req.param('edit-post-seq');
		var who = req.session.user;
		if( (originalAuthor == who._id && who.role.permissions.CAN_EDIT_OWN_POSTS) || (who.role.permissions.CAN_EDIT_OTHERS_POSTS) ) {
			PM.update({
				id: req.param('postid'),
				post: req.param('edited-text')
			}, function(p){
				if(p) {
					res.send(p, 200);
					socket.sockets.emit('editedPost', p);
				}
			});
		}
		else {
			res.send('error', 403);
		}
	});
	
	app.post('/topic/:slug/:page?/:pagenum?/', checkUser, getUser, loginUser, function(req, res) {
		PM.create({
			author: req.session.user._id,
			topic: req.param('topic'),
			body: req.param('reply-post'),
			postedOn: moment().format()
		}, function(o){
				if(o) {
					res.send(o._id, 200);
					socket.sockets.emit('newPost', o);
				}
			});
	});
	
	app.get('/admin/', checkUser, getUser, loginUser, checkAdmin, function(req, res){
		ADMIN.getDashboardStats(function (stats) {
			res.render('admin/dashboard', {title : 'Dashboard | xForum Admin', stats: stats});
		})
	});
	
	app.get('/admin/roles/add/', checkUser, getUser, loginUser, checkAdmin, function(req, res){
		RM.getNewRoleForm(function(form) {
			res.render('admin/role', {title : 'Add New Role | xForum Admin', form: form});
		})
	});
	
	app.post('/admin/roles/add/', checkUser, getUser, loginUser, checkAdmin, function(req, res){
		
		// Converting 'on' from the checkboxes to 'true'
		var tmp = req.body;
		for (var key in tmp) {
		   var obj = tmp[key];
		   if(obj == 'on')
				tmp[key] = true;
		}
		RM.create(tmp, function(o){
			if(o)
				res.send('', 200);
		});
	});
	
	app.get('/admin/categories/', checkUser, getUser, loginUser, checkAdmin, function(req, res){
		RM.getRoles(function(roles) {
			CM.listAll(function(e, cats) {
				res.render('admin/category', {title: 'Categories | xForum Admin', roles: roles, categories: cats})
			});
		});
	});

    app.get('/admin/users/', checkUser, getUser, loginUser, checkAdmin, function(req, res){
        RM.getRoles(function(roles) {
            AM.list(function(e, users) {
                res.render('admin/users', {title: 'Users | xForum Admin', roles: roles, users: users})
            });
        });
    });

    app.post('/admin/users/', checkUser, getUser, loginUser, checkAdmin, function(req, res){
        AM.update({
            id: req.param('userId'),
            username: req.param('username'),
            role: req.param('role')
        }, function (err, o) {
            if(!err)
            {
                res.send(o, 200);
            }
        });
    });
	
	app.post('/admin/categories/', checkUser, getUser, loginUser, checkAdmin, function(req, res){
		if(req.param('catId') == '') { // Not updating
			if(req.param('name')) {
				CM.create({
					name: req.param('name'),
					desc: req.param('desc'),
					slug: functions.slugify(req.param('name')),
					visibleTo: req.param('visibleTo'),
					order: req.param('catOrder')
				}, function(err, o) {
					CM.reorder(JSON.parse(req.param('order')), function(e) {
						if(!e)
							res.send(o._id, 200);
					})
				});
			}
		}
		else { //updating existing category
			CM.update({
				id: req.param('catId'),
				name: req.param('name'),
				desc: req.param('desc'),
				visibleTo: req.param('visibleTo')
			}, function(err, o) {
				if(!err)
					res.send('ok', 200);
			})
		}
		if(req.param('orderChanged')) {
			CM.reorder(JSON.parse(req.param('order')), function(e) {
				if(!e)
					res.send('ok', 200);
			});
		}
	});
	
	app.get('/admin/forums/', checkUser, getUser, loginUser, checkAdmin, function(req, res){
		RM.getRoles(function(roles) {
			CM.listAll(function(e, cats) {
				FM.listAll(function(e, forums) {
					res.render('admin/forum', {title: 'Forums | xForum Admin', roles: roles, forums: forums, categories: cats});
				});
			})
		});
	});

	app.post('/admin/forums/', checkUser, getUser, loginUser, checkAdmin, function(req, res){
		if(req.param('fId') == '') { // Not updating
			if(req.param('name')) {
				FM.create({
					name: req.param('name'),
					desc: req.param('desc'),
					slug: functions.slugify(req.param('name')),
					visibleTo: req.param('visibleTo'),
					order: req.param('fOrder'),
					category: req.param('category')
				}, function(err, o) {
					FM.reorder(JSON.parse(req.param('order')), function(e) {
						if(!e)
							res.send(o._id, 200);
					})
				});
			}
		}
		else { //updating existing category
			FM.update({
				id: req.param('fId'),
				name: req.param('name'),
				desc: req.param('desc'),
				category: req.param('category'),
				visibleTo: req.param('visibleTo')
			}, function(err, o) {
				if(!err)
					res.send('ok', 200);
			})
		}
		if(req.param('orderChanged')) {
			FM.reorder(JSON.parse(req.param('order')), function(e) {
				if(!e)
					res.send('ok', 200);
			});
		}
	});
	
	app.post('/create/topic/', checkUser, getUser, loginUser, function(req, res){
		
		// TODO: Check if user has permission to create topic here
		TM.create({
			title : req.param('title'),
			desc: req.param('desc'),
			body: req.param('post'),
			slug: functions.slugify(req.param('title')),
			forum: req.param('forum'),
			author: req.session.user._id,
			createdOn: moment().format(),
			lastPost: moment().format()
		}, function(o){
				if(o)
				{
					socket.sockets.emit('newTopic', o);
					res.send('/topic/'+o.slug+'/', 200);
				}
		})
	});
	
	app.get('/profile/',checkUser, getUser, loginUser, function(req, res) {
		res.render('profile', {
				title : 'Update Your Profile',
				countries : CT
		});
	});
	
	app.post('/profile/', checkUser, getUser, loginUser, function(req, res){
		if (req.param('user') != undefined) {
			AM.update({
				username 	: req.param('user'),
				realName 	: req.param('name'),
				email 		: req.param('email'),
				location 	: req.param('country'),
				password	: req.param('pass')
			}, function(o){
				if (o){
					req.session.user = o;
			// udpate the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.send('ok', 200);
				}	else{
					res.send('error-updating-account', 400);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});	
	
// creating new accounts //	
	
	app.get('/signup/', function(req, res) {
		res.render('signup', { title: 'Signup', countries : CT });
	});
	
	app.post('/signup/', function(req, res){
        var theRole;
        Settings.getSettings(function(settings){
            theRole = settings.defaultRole;
            AM.signup({
                realName	: req.param('name'),
                email		: req.param('email'),
                username	: req.param('user'),
                password	: req.param('pass'),
                location	: req.param('country'),
                role        : theRole
            }, function(e, o){
                if (e){
                    res.send(e, 400);
                }	else{
                    res.send('ok', 200);
                }
            });
        });
	});

// password reset //

	app.get('/reset-password/', function(req, res) {
		AM.validateLink(req.query["u"], function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
				res.render('reset', {
						title : 'Reset Password', pid : req.query["u"]
				});
			}
		})
	});
	
	app.post('/reset-password/', function(req, res) {
		AM.setPassword(req.param('pid'), req.param('pass'), function(o){
			if (o){
				res.send('ok', 200);
			}	else{
				res.send('unable to update password', 400);
			}
		})
	});	
	
	
// view & delete accounts //
	
	app.get('/members/', checkUser, getUser, loginUser, function(req, res) {
		AM.list(function(e, accounts) {
			return res.render('members', { title : 'Account List', accts : accounts });
		});
	});	
	
	app.post('/profile/delete/', checkUser, getUser, loginUser, function(req, res){
		AM.delete(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
	            req.session.destroy(function(e){ res.send('ok', 200); });
			}	else{
				res.send('record not found', 400);
			}
	    });
	});
	
	app.get('/reset/', function(req, res) {
		CM.delAllRecords( );
		TM.delAllRecords( );
		PM.delAllRecords( );
		FM.delAllRecords( );
		res.redirect('/');
	});
	
	app.use(function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};