var	Category	=	require('../models/Category.js');
var	Forum	    =	require('../models/Forum.js');
var	Topic	    =	require('../models/Topic.js');
var	User	    =	require('../models/User.js');
var	Post	    =	require('../models/Post.js');
var	TM			=	require('./topic-manager.js');
var	async		=	require('async');
var	CM			=	{};

module.exports	=	CM;

// record insertion, update & deletion methods //

CM.create	=	function(newData, callback) 
{
	new Category(newData).save(callback);
};

CM.update	=	function(newData, callback) 
{
	Category.findByIdAndUpdate(newData.id, {$set: {name: newData.name, visibleTo: newData.visibleTo, desc: newData.desc, slug: newData.slug}}, callback);
};

CM.checkSlugExists  =   function(slug, callback)
{
    Category.findOne({slug: slug}).exec(function(err, cat) {
        if(cat)
        {
            callback(true);
        }
        else
        {
            callback(false);
        }
    });
}

CM.listHomePage		=	function(user, callback)
{
    var popOpts = {
        path: 'forums',
        match: {$or : [{visibleTo: user.role._id}, {visibleTo : [] }]},
        options: {sort: [['order', 'ascending'], '_id', 'ascending']}
    }
	Category.find().populate(popOpts).sort({order: 1, _id: 1}).exec(function(e, categories) {
		if (e) {
			callback(e);
		}
		else {
            Topic.populate(categories, {path: 'forums.topics', options: {sort: {lastPost: -1}}}, function(err, c)
            {
                console.log(err);
                Post.populate(c, {path: 'forums.topics.replies', options: {sort: {postedOn: -1}}, select: 'author'}, function(err, c)
                {
                    console.log(err);
                    User.populate(c, {path: 'forums.topics.replies.author', select: 'username'}, function(err, c)
                    {
                        console.log(err);
                        //Getting readStatus of each forum
                        var cLength = categories.length;
                        var cCount = 0;
                        async.whilst(
                            function() {
                                return cCount < cLength;
                            },
                            function(cbCat) {
                                var fLength = categories[cCount].forums.length;
                                var fCount = 0;

                                async.whilst(
                                    function() { return fCount < fLength; },
                                    function(cbForum) {

                                        var numTopics = 0;
                                        var topicsRead = 0;
                                        var tLength = categories[cCount].forums[fCount].topics.length;
                                        numTopics += tLength;
                                        var tCount = 0;

                                        async.whilst(
                                            function() { return tCount < tLength },
                                            function(cbTopic) {
                                                TM.checkRead(user._id, categories[cCount].forums[fCount].topics[tCount], function(read){
                                                    if(read) topicsRead++;
                                                    tCount++;
                                                    cbTopic();
                                                })
                                            },
                                            function(err) {
                                                categories[cCount].forums[fCount].isRead = (numTopics == topicsRead);
                                                categories[cCount].forums[fCount].unRead = numTopics - topicsRead;
                                                categories[cCount].forums[fCount].lastPostTopic = categories[cCount].forums[fCount].topics[0];
                                                fCount++;
                                                cbForum();
                                            })
                                    },
                                function(err) {
                                    cCount++;
                                    cbCat();
                                });
                            },
                            function(err) {
                                callback(null, categories);
                            });
                    });
                });
            });
		}
	});
}

CM.listOne		=	function(slug, user_id, callback)
{
	Category.findOne({slug: slug}).populate('forums', null, null, {sort: [['order', 'ascending'], '_id', 'ascending']}).populate('forums.topics').exec(function(e, category) {
		if (e) {
			callback(e);
		}
		else {
			
			//Getting readStatus of each forum
			var fLength = category.forums.length;
			var fCount = 0;
					
			async.whilst(
				function() { return fCount < fLength; },
				function(cbForum) {
					
					var numTopics = 0;
					var topicsRead = 0;
					category.forums[fCount].unRead = 0;
					var tLength = category.forums[fCount].topics.length;
					numTopics += tLength;
					var tCount = 0;
					
					async.whilst(
						function() { return tCount < tLength },
						function(cbTopic) {
							TM.checkRead(user_id, category.forums[fCount].topics[tCount], function(read){
								if(read) topicsRead++;
								tCount++;
								cbTopic();
							})
						},
						function(err) {
							category.forums[fCount].isRead = (numTopics == topicsRead);
							category.forums[fCount].unRead = numTopics - topicsRead;
							fCount++;
							cbForum();
						})
				},
			function(err) {
				callback(null, category);
			});
		}
	});
}

CM.listAll	=	function(callback)
{
	Category.find().populate('forums', null, null, {sort: [['order', 'ascending'], '_id', 'ascending']}).sort({order: 1, _id: 1}).exec(function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

CM.getDetails	=	function(id, callback)
{
	Category.findById(id).populate('forums').exec(function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

CM.reorder	=	function(newOrder, callback) {
	var oLength = newOrder.length;
	var oCount = 0;
	
	async.whilst(
		function() { return oCount < oLength },
		function(cb) {
			var id = newOrder[oCount].id;
			var order = newOrder[oCount].order
			if(id != 'tbdCategory') {
				Category.findByIdAndUpdate(id, {$set: {order: order}}, function() {
					oCount++;
					cb();
				});
			}
			else {
				oCount++;
				cb();
			}
		},
		function(err) {
			callback(err);
		})
}

CM.getIDFromSlug	=	function(slug, callback)
{
	Category.findOne({slug: slug}).select('_id').exec(function (err, c) {
		if(c) callback(c._id)
	})
}

CM.delAllRecords = function() 
{
	Category.remove({}, function() {}); // reset accounts collection for testing //
}