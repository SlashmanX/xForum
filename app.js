
/**
 * Module dependencies.
 */

var	express			=	require('express');
var	http			=	require('http');
var	io				=	require('socket.io');
var	routes			=	require('./routes');
var	lessMiddleware	=	require('less-middleware');
var	mysql			=	require('mysql');
var	piler			=	require('piler');
var	connect			=	require('connect');
var	config			=	require('./private/config.js');

var	dbInfo			=	JSON.parse(config.getDBInfo());
var	dbTables		=	JSON.parse(config.getDBTables());
var	connection		=	mysql.createConnection(dbInfo);

var	functions		=	require('./shared/functions.js');

var app				=	express();
var	clientjs		=	piler.createJSManager();
//var clientcss		=	piler.createCSSManager();

var	sessionStore	=	new connect.session.MemoryStore();

var	SITE_SECRET		= 'I am not wearing any pants';

// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.cookieParser(SITE_SECRET));
	app.use(express.methodOverride());
	app.use(app.router);

	clientjs.bind(app);
	//clientcss.bind(app);
	
	//clientcss.addFile(__dirname + "/public/css/style.css");

	clientjs.addUrl("http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.js");
	
	clientjs.addFile(__dirname + '/public/js/app.js');
	clientjs.addFile(__dirname + '/public/js/lib/bootstrap.min.js');
	
	clientjs.addFile(__dirname + '/shared/functions.js');
	//clientjs.addFile('/socket.io/socket.io.js');

	app.use(lessMiddleware({
        src: __dirname + '/public'
    }));

	app.use(express.session({
	    key: 'express.sid'
	  , store: sessionStore
	}));


	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
	//clientjs.liveUpdate(clientcss);
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
});

// Routes

app.get('/', home, routes.index);

function home(req, res, next){
	res.locals({js: clientjs.renderTags()});
	next();
}

var	server			=	http.createServer(app);
server.listen(3000);
var	socket			=	io.listen(server);

socket.set('authorization', function (data, accept) {
    // check if there's a cookie header
    if (data.headers.cookie) {
        // if there is, parse the cookie
        data.cookie = require('cookie').parse(data.headers.cookie);
        // note that you will need to use the same key to grad the
        // session id, as you specified in the Express setup.
        data.sessionID = data.cookie['express.sid'].split('.')[0];
    } else {
       // if there isn't, turn down the connection with a message
       // and leave the function.
       return accept('No cookie transmitted.', false);
    }
    // accept the incoming connection
    accept(null, true);
});

socket.sockets.on('connection', function(client){
	var hs = client.handshake;
	client.join(hs.sessionID);

	console.log('Connected clients: '+ getNumOnline());
	

	client.on('disconnect', function(){
		client.leave(hs.sessionID);
	});

});

function getNumOnline(){
	return socket.sockets.clients().length;
}