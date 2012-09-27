var AM = require('./modules/account-manager');
var CM = require('./modules/category-manager');
var FM = require('./modules/forum-manager');
var TM = require('./modules/topic-manager');
var PM = require('./modules/post-manager');
var CT = require('./modules/country-list');
var RM = require('./modules/role-manager');


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

	   next();
	};

	// Second Middleware

	var getUser = function (req, res, next) {

		var username = req.cookies.username || req.params.username;
		var pass = req.cookies.pass || req.params.pass;

		AM.autoLogin(username, pass, function(o){
			res.locals.udata = o;
			next();
		});

	}

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
		CM.listHomePage(req.session.user._id, function(e, categories){
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
	})
	
	app.get('/create/:what/', checkUser, getUser, loginUser, function(req, res){
		CM.listAll( function(e, categories){
			res.render('create', { title : 'Create New '+ req.param('what').capitalize() +' | xForum', categories : categories, what: req.param('what'), parent: req.param('pid')})
		})
	})
	
	app.get('/forum/:slug/', checkUser, getUser, loginUser, function(req, res) {
		FM.listBySlug(req.param('slug'), function(e, forum) {
			if(e) {
				console.error('Error getting forum '+ slug + ': '+ e);
			}
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
				res.render('forum', {title : 'Viewing Forum: '+ forum.name +' | xForum', forum: forum});
			})
			
		});
	});
	
	app.get('/topic/:slug/', checkUser, getUser, loginUser, function(req, res) {
		TM.getTopic(req.param('slug'), function(e, topic) {
			if(e) {
				console.error('Error getting topic '+ slug + ': '+ e);
			}
			res.render('topic', {title : 'Viewing Topic: '+ topic.title +' | xForum', topic: topic});
		});
	});
	
	app.post('/topic/:slug/', checkUser, getUser, loginUser, function(req, res) {
		PM.create({
			author: req.session.user._id,
			topic: req.param('topic'),
			body: req.param('body'),
			postedOn: moment().format()
		}, function(o){
				if(o) {
					res.send(o._id, 200);
					socket.sockets.emit('newPost', o);
				}
			});
	});
	
	app.get('/admin/roles/add/', checkUser, getUser, loginUser, function(req, res){
		RM.getNewRoleForm(function(form) {
			console.log(form);
			res.render('admin/role', {title : 'Add New Role | xForum', form: form});
		})
	})
	
	app.post('/admin/roles/add/', checkUser, getUser, loginUser, function(req, res){
		
		// Converting 'on' from the checkboxes to 'true'
		var tmp = req.body;
		for (var key in tmp) {
		   var obj = tmp[key];
		   if(obj == 'on')
				tmp[key] = true;
		}
		console.log(tmp);
		RM.create(tmp, function(o){
			if(o)
				res.send('', 200);
		});
	});
	
	app.post('/create/:what/', checkUser, getUser, loginUser, function(req, res){
		if(req.param('what') == 'forum')
		{
			if(!req.param('forum')) {
				FM.create({
						category: req.param('category'),
						name: req.param('name'),
						slug: functions.slugify(req.param('name')),
						desc: req.param('desc')
					}, function(o){
						if(o)
							res.send('/forum/'+o.slug+'/', 200);
				})
			}
			
			else {
				FM.createSubForum({
						category: req.param('category'),
						parent: req.param('forum'),
						name: req.param('name'),
						slug: functions.slugify(req.param('name')),
						desc: req.param('desc')
					}, function(o){
						if(o)
							res.send('ok', 200);
				})
			}
		}
		else if(req.param('what') == 'category')
		{
			CM.create({
				name : req.param('name'),
				desc: req.param('desc'),
				slug: functions.slugify(req.param('name')),
			}, function(o){
					if(o)
					{
						res.send('/category/'+o.slug+'/', 200);
					}
			})
		}
		else if(req.param('what') == 'topic')
		{
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
		}
	})
	
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
		AM.signup({
			realName	: req.param('name'),
			email		: req.param('email'),
			username	: req.param('user'),
			password	: req.param('pass'),
			location	: req.param('country')
		}, function(e, o){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
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
		AM.list( function(e, accounts){
			res.render('members', { title : 'Account List', accts : accounts });
		})
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