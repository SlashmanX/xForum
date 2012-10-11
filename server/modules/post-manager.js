var	Topic		=	require('../models/Topic.js');
var	Forum		=	require('../models/Forum.js');
var	Post		=	require('../models/Post.js');
var	Category	=	require('../models/Category.js');
var	CM			=	require('./category-manager.js');
var	FM			=	require('./forum-manager.js');
var	TM			=	require('./topic-manager.js');
var	mongoose	=	require('mongoose');
var	moment		=	require('moment');
var	ObjectId	=	mongoose.Types.ObjectId;

var	PM			=	{};
module.exports	=	PM;

// record insertion, update & deletion methods //

PM.create			=	function(newData, callback) 
{
	p = new Post(newData);
	p.save(function(err, thepost) {
		Topic.findByIdAndUpdate(newData.topic, {lastPost: moment().format(), $push : { replies : thepost._id }}, function(err, t) {
			Post.findById(p._id).populate('author').populate('topic').exec(function (err, cbPost) {
				callback(cbPost);
			});
		});
	});
};

PM.getTopic			=	function(tid, callback)
{
	Post.find({topic: tid}).populate('author').sort({postedOn: 1}).exec(function(e, posts) {
		if (e) callback(e)
		else callback(null, posts)
	});
}

PM.getIDFromSlug	=	function(slug, callback)
{
	Post.findOne({slug: slug}).select('_id').exec(function (err, p) {
		if(p) callback(p._id)
	})
}

PM.delAllRecords = function() 
{
	Post.remove({}, function() {}); // reset accounts collection for testing //
}