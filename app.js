
/**
 * Node.js Login Boilerplate
 * Author : Stephen Braitsch
 * More Info : http://bit.ly/LsODY8
 */

var	express			=	require('express');
var	http			=	require('http');
var	io				=	require('socket.io');
var	connect			=	require('connect');
var SM 				=	require('./server/modules/socket-manager');
var CM 				=	require('./server/modules/category-manager');
var	jsdom			=	require('jsdom');
var	func			=	require('./server/controllers/func.js');

var app				=	express();

app.root = __dirname;
global.host = 'localhost';

require('./config')(app, express);
var	server			=	http.createServer(app);
server.listen(3000);
var	socket			=	io.listen(server);
require('./server/router')(app, socket);

/*func.getTitleFromURL('http://xforum.slashmanx.com', function(title) {
	console.log(title)
})*/
socket.set('authorization', function (data, accept) {
    // check if there's a cookie header
    if (data.headers.cookie) {
        // if there is, parse the cookie
        data.cookie = require('cookie').parse(data.headers.cookie);
        // note that you will need to use the same key to grad the
        // session id, as you specified in the Express setup.
		if(data.cookie.sid)
        	data.sessionID = data.cookie.sid.split('.')[0];
    } else {
       // if there isn't, turn down the connection with a message
       // and leave the function.
       return accept('No cookie transmitted.', false);
    }
    // accept the incoming connection
    accept(null, true);
});
socket.set('log level', 1);
socket.sockets.on('connection', function(client){
	var hs = client.handshake;
	client.join(hs.sessionID);

	client.on('leavingTopic', function(data){
		SM.getUserIDFromSession(hs.sessionID.slice(2), function(e, a) {
			if(a) {
				SM.setLastReadTime(JSON.parse(a.session).user._id, data.topic, function(e, o) {
				});
			}
		});
	})
	
	client.on('getTitleFromURL', function(url, callback) {
			func.getTitleFromURL(url, function(title) {
				callback(title);
			})
	})
	
	client.on('getCategoryDetails', function(data, callback) {
		CM.getDetails(data.id, function(e, cat) {
			callback(cat);
		})
	})
	client.on('disconnect', function(){
		client.leave(hs.sessionID);
	});

});

function getNumOnline(){
	return socket.sockets.clients().length;
}