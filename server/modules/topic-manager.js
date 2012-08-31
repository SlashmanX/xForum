var	Topic		=	require('../models/Topic.js');
var	Forum		=	require('../models/Forum.js');
var	Post		=	require('../models/Post.js');
var	Category	=	require('../models/Category.js');
var	CM			=	require('./category-manager.js');
var	FM			=	require('./forum-manager.js');

var	TM			=	{};
module.exports	=	TM;

// record insertion, update & deletion methods //

TM.create			=	function(newData, callback) 
{
	FM.getIDFromSlug(newData.forum, function(fid){
		newData.forum = fid;
		t = new Topic(newData);
		p = new Post({author: newData.author, topic: t._id, post: newData.post});
		console.log(t);
		t.post = p._id;
		console.log(t);
		p.save();
		t.save(function () {
			Forum.findByIdAndUpdate(fid, {$push : { topics : t._id }}, function(err, f) {
				callback('ok');
			});
		});
	});
};

TM.getTopic			=	function(slug, callback)
{
	Topic.findOne({slug: slug}).populate('forum').populate('post').populate('replies').exec(function(e, res) {
		console.log(res);
		if (e) callback(e)
		else callback(null, res)
	});
}

TM.getIDFromSlug	=	function(slug, callback)
{
	Topic.findOne({slug: slug}).select('_id').exec(function (err, t) {
		if(t) callback(f._id)
	})
}
