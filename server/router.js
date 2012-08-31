var AM = require('./modules/account-manager');
var CM = require('./modules/category-manager');
var FM = require('./modules/forum-manager');
var TM = require('./modules/topic-manager');
//var PM = require('./modules/post-manager');
var CT = require('./modules/country-list');
var	functions	=	require('../shared/functions.js');

var	mongoose	=	require('mongoose');
mongoose.connect('localhost', 'xForum');

module.exports = function(app) {
	
	app.use(function(req, res, done){
		if (req.session.user == null && req.url != '/login/' && req.url != '/signup/'){
			// if user is not logged-in redirect back to login page //
	        res.redirect('/login/');
	    }
		else {
			res.locals.udata = req.session.user;
		}
		
		done();

	})
	
	// main login page //

	app.get('/login/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					var redirectTo = '/';
					if(req.params.url) {
						redirectTo = req.params.url;
					}
					
					res.redirect('/');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/login/', function(req, res){
		if (req.param('email') != null){
			AM.getEmail(req.param('email'), function(o){
				if (o){
					res.send('ok', 200);
					EM.send(o, function(e, m){ console.log('error : '+e, 'msg : '+m)});	
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
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });
					}			
					res.send(o, 200);
				}
			});
		}
	});	
	
	// logged-in user homepage //
	
	app.get('/', function(req, res) {
		CM.list( function(e, categories){
			if(e) {
				console.error('Error getting categories: '+ e);
			}
			res.render('home', { title : 'Home | xForum', categories : categories });
		})
		
	});
	
	app.get('/create/:what/', function(req, res){
		CM.list( function(e, categories){
			res.render('create', { title : 'Create New Forum | xForum', categories : categories, what: req.param('what')})
		})
	})
	
	app.get('/forum/:slug/', function(req, res) {
		FM.listBySlug(req.param('slug'), function(e, forum) {
			if(e) {
				console.error('Error getting forum '+ slug + ': '+ e);
			}
			res.render('forum', {title : 'Viewing Forum: '+ forum.name +' | xForum', forum: forum});
		});
	});
	
	app.get('/topic/:slug/', function(req, res) {
		TM.getTopic(req.param('slug'), function(e, topic) {
			if(e) {
				console.error('Error getting topic '+ slug + ': '+ e);
			}
			res.render('topic', {title : 'Viewing Topic: '+ topic.title +' | xForum', topic: topic});
		});
	});
	
	app.post('/create/:what/', function(req, res){
		if(req.param('what') == 'forum')
		{
			if(!req.param('forum')) {
				console.log(req.param('category'));
				FM.create({
						category: req.param('category'),
						name: req.param('name'),
						slug: functions.slugify(req.param('name')),
						desc: req.param('desc')
					}, function(o){
						if(o)
							res.send('ok', 200);
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
						res.send('ok', 200);
					}
			})
		}
		else if(req.param('what') == 'topic')
		{
			console.log('Forum: '+ req.param('forum'));
			TM.create({
				title : req.param('title'),
				desc: req.param('desc'),
				post: req.param('post'),
				slug: functions.slugify(req.param('title')),
				forum: req.param('forum'),
				author: req.session.user._id
			}, function(o){
					if(o)
					{
						res.send('ok', 200);
					}
			})
		}
	})
	
	app.get('/profile/', function(req, res) {
		res.render('profile', {
				title : 'Update Your Profile',
				countries : CT
		});
	});
	
	app.post('/profile/', function(req, res){
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
	
	app.get('/members/', function(req, res) {
		AM.list( function(e, accounts){
			res.render('members', { title : 'Account List', accts : accounts });
		})
	});	
	
	app.post('/profile/delete/', function(req, res){
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
	
	app.get('/reset', function(req, res) {
		CM.delAllRecords( );
		res.redirect('/');
	});
	
	app.use(function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};