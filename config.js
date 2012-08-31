var	lessMiddleware	=	require('less-middleware');
var connect = require('connect')
  , Db = require('mongodb').Db
  , Server = require('mongodb').Server
  , server_config = new Server('localhost', 27017, {auto_reconnect: true, native_parser: true})
  , db = new Db('express_sessions', server_config, {})
  , MongoStore = require('connect-mongodb');


module.exports = function(app, exp) {
	app.configure(function(){
		app.set('views', app.root + '/server/views');
		app.set('view engine', 'jade');
		app.set('view options', { doctype : 'html', pretty : true });
		app.use(exp.bodyParser());
		app.use(exp.cookieParser('I am not wearing any pants'));
		app.use(exp.session({
			cookie: {
				maxAge: 120000
				},
			store: new MongoStore({db: db})
			}));
		app.use(exp.methodOverride());
		app.use(lessMiddleware({
	        src: app.root + '/public'
	    }));
		app.use(exp.static(app.root + '/server'));
		app.use(exp.static(app.root + '/public'));
	});
	
}