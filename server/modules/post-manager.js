var	Topic		=	require('../models/Topic.js');
var	Forum		=	require('../models/Forum.js');
var	Post		=	require('../models/Post.js');
var	Category	=	require('../models/Category.js');
var	CM			=	require('./category-manager.js');
var	FM			=	require('./forum-manager.js');
var	TM			=	require('./topic-manager.js');
var	mongoose	=	require('mongoose');
var	moment		=	require('moment');
var akismet     =   require('akismet').client({ blog: 'http://xforum.slashmanx.com', apiKey: '0cfa41b5611f' });
var	ObjectId	=	mongoose.Types.ObjectId;

var	PM			=	{};
module.exports	=	PM;

// record insertion, update & deletion methods //

PM.create			=	function(newData, callback) 
{
    // TODO : Check if previous post in this topic was by the same author, and within the past 10 mins (settings)
    Topic.findById(newData.topic).populate('post', 'author').populate('replies', 'author', null, {sort: {postedOn: -1}, limit: 1}).exec(function(err, t) {
        var tmp = t.toObject();
        var prevAuthor = tmp.post.author;
        var postID = tmp.post;
        if(tmp.replies.length)
        {
            prevAuthor = tmp.replies[0].author;
            postID = t.replies[0];
        }
        akismet.checkSpam({
            user_ip: '1.1.1.1',
            comment_author: newData.author,
            comment_content: newData.body
        }, function(err, spam) {
            if(spam)
                newData.isSpam = true;
            else
                newData.isSpam = false;
        });
        if(""+prevAuthor == ""+newData.author)
        {
            t.lastPost = moment().format();
            t.markModified('lastPost');
            t.save();
            Post.findById(postID).exec(function(perr, p) {
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
};

PM.edit			=	function(data, callback) {
    Post.findOne({_id: data.id}).exec(function(err, post) {
        if(err)
            console.log(err);
        else {
            post.editHistory.push({editedBy: data.editor, dateEdited: moment().format(), prevBody: post.body, newBody: data.post});
            post.body = data.post;
            post.save(function(error, p){
                if(error) console.log(error);
                else
                    callback(p);
            })
        }

    })
};

PM.delete           =   function(id, callback) {
    Post.findByIdAndRemove(id).populate('topic').exec(function(err, p) {
        p = p.toObject();
        p.topic.replies.splice(p.topic.replies.indexOf(id));
        if(err)
            callback(err);
        else
        {
            Topic.findByIdAndUpdate(p.topic._id, { $pull : { 'replies' :p._id } }, function(terr, t){
                callback(terr, p);
            });
        }
    });
}
PM.getPostInfo      =   function(pid, callback)
{
    Post.findById(pid).populate('author').exec(function(e, postInfo){
        callback(postInfo);
    })
}
PM.getTopic			=	function(tid, callback)
{
	Post.find({topic: tid, isSpam: false}).populate('author').populate('editHistory.editedBy').sort({postedOn: 1}).exec(function(e, posts) {
		if (e) callback(e)
		else {
            callback(null, posts)
        }
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