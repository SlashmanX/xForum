
/**
 * Node.js Login Boilerplate
 * Author : Stephen Braitsch
 * More Info : http://bit.ly/LsODY8
 */

var	express			=	require('express');
var	http			=	require('http');
var	io				=	require('socket.io');
var	connect			=	require('connect');

var app				=	express();
var	sessionStore	=	new connect.session.MemoryStore();

app.root = __dirname;
global.host = 'localhost';

require('./config')(app, express);
require('./server/router')(app);

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