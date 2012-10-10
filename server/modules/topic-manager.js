var	Topic		=	require('../models/Topic.js');
var	Forum		=	require('../models/Forum.js');
var	Post		=	require('../models/Post.js');
var	Category	=	require('../models/Category.js');
var	UTF			=	require('../models/UserTopicRead.js');
var	CM			=	require('./category-manager.js');
var	FM			=	require('./forum-manager.js');
var	PM			=	require('./post-manager.js');
var	mongoose	=	require('mongoose');
var	moment		=	require('moment');
var	ObjectId	=	mongoose.Types.ObjectId;

var	TM			=	{};
module.exports	=	TM;

// record insertion, update & deletion methods //

TM.create			=	function(newData, callback) 
{
	newData.post = null;
	t = new Topic(newData);
	p = new Post({author: newData.author, topic: t._id, body: newData.body});
	p.save(function(err, thepost) {
		t.post = thepost._id
		t.markModified('post');
		t.save(function (e, topic) {
			Forum.findByIdAndUpdate(new ObjectId(newData.forum + ''), {$push : { topics : topic._id }}, function(err, f) {
				callback(topic);
			});
		});
	});
};

TM.checkRead		=	function(uid, tid, callback)
{
	UTF.findOne({user: uid, topic: tid}).populate('topic').exec(function(e, o) {
		if(!o) {
			callback(false);
		}
		else {
			var lastPost = moment(o.topic.lastPost);
			var lastRead = moment(o.lastAccessed);
			if(lastPost.diff(lastRead) < 0) {
				callback(true);
			}
			else {
				callback(false);
			}
		}
	});
};

TM.getTopic			=	function(slug, callback)
{
	Topic.findOne({slug: slug}).populate('forum').populate('post').populate('replies').exec(function(e, topic) {
		PM.getTopic(topic._id, function(err, p) {
			if (err) callback(err)
			else {
				var tmp = topic.toJSON();
				tmp.posts = p;
				callback(null, tmp);
			}
		})
	});
}

TM.getIDFromSlug	=	function(slug, callback)
{
	Topic.findOne({slug: slug}).select('_id').exec(function (err, t) {
		if(t) callback(t._id)
	})
}

TM.delAllRecords = function() 
{
	Topic.remove({}, function() {}); // reset accounts collection for testing //
}
