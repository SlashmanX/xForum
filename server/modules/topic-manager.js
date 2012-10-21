var	Topic		=	require('../models/Topic.js');
var	Forum		=	require('../models/Forum.js');
var	Post		=	require('../models/Post.js');
var	Category	=	require('../models/Category.js');
var	UTF			=	require('../models/UserTopicRead.js');
var SM			=	require('../modules/socket-manager.js');
var	mongoose	=	require('mongoose');
var	moment		=	require('moment');
var	ObjectId	=	mongoose.Types.ObjectId;

var	TM			=	{};

// record insertion, update & deletion methods //

TM.create			=	function(newData, callback) 
{
	newData.post = null;
	t = new Topic(newData);
	p = new Post({author: newData.author, postedOn: newData.createdOn, topic: t._id, body: newData.body});
	p.save(function(err, thepost) {
		t.post = thepost._id;
		t.markModified('post');
		t.save(function (e, topic) {
			Forum.findByIdAndUpdate(new ObjectId(newData.forum + ''), {$push : { topics : topic._id }}, function(err, f) {
				SM.setLastReadTime(newData.author, topic._id, function(e, o) {
					callback(topic);
				});
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

TM.getTopic			=	function(data, callback)
{
	var	PM			=	new require('./post-manager.js');
	Topic.findOne({slug: data.slug}).populate('forum', null, {visibleTo: data.user.role._id}).populate('post').populate('replies').exec(function(e, topic) {
        if(topic && topic.forum) {
            console.log(topic);
            PM.getTopic(topic._id, function(err, p) {
                if (err) callback(err)
                else {
                    var tmp = topic.toJSON();
                    tmp.posts = p;
                    callback(null, tmp);
                }
            })
        }
        else {
            callback(null, null);
        }
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

module.exports	=	TM;
