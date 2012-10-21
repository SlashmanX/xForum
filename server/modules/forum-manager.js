var	Topic		=	require('../models/Topic.js');
var	Forum		=	require('../models/Forum.js');
var	Category	=	require('../models/Category.js');
var	async		=	require('async');
var	TM			=	require('./topic-manager.js');
var	FM			=	{};

module.exports	=	FM;

// record insertion, update & deletion methods //

FM.create			=	function(newData, callback) 
{
	f = new Forum(newData);
	f.save(function (err, forum) {
		Category.findByIdAndUpdate(newData.category, {$push : { forums : f._id }}, function(err, cat) {
			callback(err, forum);
		});
	})
};
FM.createSubForum	=	function(newData, callback) 
{
	f = new Forum(newData);
	f.save(function () {
		Category.findByIdAndUpdate(id, {$push : { forums : f._id }}, function(err, c) {
			Forum.findByIdAndUpdate(fid, {$push : {children : f._id}}, function(err, f) {
				callback('ok');
			});
		});
	});
};

FM.list				=	function(callback)
{
	Forum.find().populate('topics').populate('parent').populate('children').exec(function(e, res) {
		console.log(res);
		if (e) callback(e)
		else callback(null, res)
	});
}

FM.listBySlug		=	function(data, callback)
{
	Forum.findOne({slug: data.slug, visibleTo: data.user.role._id}).populate('topics', null, null, {sort: [['lastPost', 'desc']] } ).populate('parent').populate('children').exec(function(e, forum) {
		if (e) callback(e)
		else if(forum) {
			forum = forum.toObject();
			var tLength = forum.topics.length;
			var tCount = 0;
			
			async.whilst(
				function() { return tCount < tLength },
				function(cbTopic) {
					TM.checkRead(data.user._id, forum.topics[tCount], function(read){
						if(read) forum.topics[tCount].isRead = true;
						tCount++;
						cbTopic();
					})
				},
				function(err) {
					callback(null, forum);
				})
		}
        else {
            callback(null, null);
        }
	});
}

FM.getIDFromSlug	=	function(slug, callback)
{
	Forum.findOne({slug: slug}).select('_id').exec(function (err, f) {
		if(f) callback(f._id)
	})
}

FM.update	=	function(newData, callback) 
{
	Forum.findByIdAndUpdate(newData.id, {$set: {name: newData.name, visibleTo: newData.visibleTo, desc: newData.desc, category: newData.category}}, {new: false}, function(err, f) {
		Category.findByIdAndUpdate(f.category, {$pull : {forums: f._id}}, function(err, c){
			Category.findByIdAndUpdate(newData.category, {$push : {forums: newData.id}}, callback);
		});
	});
};

FM.reorder	=	function(newOrder, callback) {
	var oLength = newOrder.length;
	var oCount = 0;
	
	async.whilst(
		function() { return oCount < oLength },
		function(cb) {
			var id = newOrder[oCount].id;
			var order = newOrder[oCount].order
			if(id != 'tbdCategory') {
				Forum.findByIdAndUpdate(id, {$set: {order: order}}, function() {
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

FM.listAll	=	function(callback)
{
	Forum.find().populate('category').sort({order: 1, _id: 1}).exec(function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

FM.getDetails	=	function(id, callback)
{
	Forum.findById(id).populate('category').exec(function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}
FM.delAllRecords = function() 
{
	Forum.remove({}, function() {}); // reset accounts collection for testing //
}