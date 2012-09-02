var	Topic		=	require('../models/Topic.js');
var	Forum		=	require('../models/Forum.js');
var	Post		=	require('../models/Post.js');
var	Category	=	require('../models/Category.js');
var	CM			=	require('./category-manager.js');
var	FM			=	require('./forum-manager.js');
var	PM			=	require('./post-manager.js');
var	mongoose	=	require('mongoose');
var	ObjectId	=	mongoose.Types.ObjectId;

var	TM			=	{};
module.exports	=	TM;

// record insertion, update & deletion methods //

TM.create			=	function(newData, callback) 
{
	FM.getIDFromSlug(newData.forum, function(fid){
		newData.forum = fid;
		newData.post = null;
		t = new Topic(newData);
		p = new Post({author: newData.author, topic: t._id, body: newData.body});
		p.save(function(err, thepost) {
			t.save(function (e, topic) {
				topic.post = new ObjectId(thepost._id + '');
				topic.save(function(err, thetopic) {
					Forum.findByIdAndUpdate(fid, {$push : { topics : thetopic._id }}, function(err, f) {
						console.log(err);
						callback('ok');
					});
				});
			});
		});
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