var	SM			=	{}; 
var	mongoose	=	require('mongoose');
var	UTR			=	require('../models/UserTopicRead.js');
var	moment		=	require('moment');

var	db			=	mongoose.createConnection('localhost', 'xForum');

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