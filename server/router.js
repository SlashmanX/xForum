
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var CM = require('./modules/category-manager');
var EM = require('./modules/email-dispatcher');

module.exports = function(app) {
	
	app.use(function(req, res, done){
		console.log(req.url);
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
		console.log(req.params.url);
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
		CM.getAllCategories( function(e, categories){
			res.render('home', { title : 'Home | xForum', categories : categories });
		})
		
	});
	
	app.get('/create/:what/', function(req, res){
		CM.getAllCategories( function(e, categories){
			res.render('create', { title : 'Create New Forum | xForum', categories : categories, what: req.param('what')})
		})
	})
	
	app.post('/create/:what/', function(req, res){
		if(req.param('what') == 'forum')
		{
			console.log('Forum: '+ req.param('forum'))
			if(req.param('forum') === '') {
				console.log('here');
				CM.addNewForum({
						parentCat: req.param('category'),
						forum : {
							name: req.param('name'),
							desc: req.param('desc'),
							forums: [],
							threads: []
						}
					}, function(o){
						if(o)
							res.send('ok', 200);
				})
			}
			else {
				console.log('sub');
				CM.addNewSubForum({
						parentForum: req.param('forum'),
						forum : {
							name: req.param('name'),
							desc: req.param('desc'),
							threads: []
						}
					}, function(o){
						if(o)
							res.send('ok', 200);
				})
			}
		}
		else if(req.param('what') == 'category')
		{
			CM.addNew({
				name : req.param('name'),
				forums : []
			}, function(o){
					if(o)
						res.send('ok', 200);
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
				user 		: req.param('user'),
				name 		: req.param('name'),
				email 		: req.param('email'),
				country 	: req.param('country'),
				pass		: req.param('pass')
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
			name 	: req.param('name'),
			email 	: req.param('email'),
			user 	: req.param('user'),
			pass	: req.param('pass'),
			country : req.param('country')
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
		AM.getAllRecords( function(e, accounts){
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