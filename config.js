var lessMiddleware      =   require('less-middleware');
var expressValidator    =   require('express-validator');
var DB                  =   require('./server/modules/db-settings.js');
var connect             =   require('connect');
var Db                  =   require('mongodb').Db;
var Server              =   require('mongodb').Server;
var server_config       =   new Server(DB.host, DB.port, {auto_reconnect: true, native_parser: true});
var db                  =   new Db(DB.database, server_config, {});
var MongoStore          =   require('connect-mongodb');
var browserify          =   require('browserify');
var browserijade        =   require('browserijade');

module.exports = function(app, exp) {
	app.configure(function(){
		app.set('views', app.root + '/server/views');
		app.set('view engine', 'jade');
		app.set('view options', { doctype : 'html', pretty : true });
        var bundle = browserify().use(browserijade(app.root + '/server/views/partials'));
        bundle.addEntry(app.root + '/public/js/app.js');
        app.use(bundle);
        app.use(exp.bodyParser());
        app.use(expressValidator);
		app.use(exp.cookieParser('I am not wearing any pants'));
		app.use(exp.session({
			cookie: {
				maxAge: 120000
				},
			key: 'sid',
			store: new MongoStore({db: db, username: DB.user, password: DB.password})
			}));
		app.use(exp.methodOverride());
		app.use(lessMiddleware({
	        src: app.root + '/public'
	    }));
		app.use(exp.static(app.root + '/server'));
		app.use(exp.static(app.root + '/public'));
	});
	
}