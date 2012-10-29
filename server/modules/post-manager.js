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
    // TODO : Check if previous post in this topic was by the same author, and within the past 10 mins (settings)
    Topic.findById(newData.topic).populate('replies', 'author', null, {sort: {postedOn: -1}, limit: 1}).exec(function(err, t) {
        tmp = t.toObject();
        if(""+tmp.replies[0].author == ""+newData.author)
        {
            t.lastPost = moment().format();
            t.markModified('lastPost');
            t.save();
            Post.findById(t.replies[0]).exec(function(perr, p) {
                p.body = p.body + "<br/><br/>"+ newData.body;
                p.postedOn = moment().format();
                p.markModified('body');
                p.markModified('postedOn');
                p.save(function(nerr, post){
                    Post.findById(post._id).populate('author').populate('topic').exec(function (err, cbPost) {
                        callback(cbPost, true);
                    });
                })
            });
        }
        else {
            console.log('not merging');
            p = new Post(newData);
            p.save(function(err, thepost) {
                Topic.findByIdAndUpdate(newData.topic, {lastPost: moment().format(), $push : { replies : thepost._id }}, function(err, t) {
                    Post.findById(p._id).populate('author').populate('topic').exec(function (err, cbPost) {
                        callback(cbPost);
                    });
                });
            });
        }
    });
};
PM.update			=	function(data, callback) {
	Post.findByIdAndUpdate(data.id, {body: data.post}).exec(function(err, post) {
		if(err)
			console.log(err);
		else
			callback(post);
	})
}
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