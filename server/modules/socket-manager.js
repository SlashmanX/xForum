var	SM			=	{};
var DB          =   require('../modules/db-settings.js');
var	mongoose	=	require('mongoose');
var	UTR			=	require('../models/UserTopicRead.js');
var	moment		=	require('moment');

var	db			=	mongoose.createConnection(DB.host, DB.database, DB.port, {user: DB.user, pass: DB.password});

var session		=	db.collection('sessions');
module.exports	=	SM;

// logging in //

SM.getUserIDFromSession = function(sid, callback)
{
	session.findOne({_id:sid}, function(e, o) {
		callback(e, o);
	});
};

SM.setLastReadTime = function(uid, tid, callback)
{
	UTR.findOneAndUpdate({user: uid, topic: tid}, {lastAccessed: moment().format()}, {upsert: true}, function(e, o) {
		callback(e, o);
	})
}