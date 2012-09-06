var	Topic		=	require('../models/Topic.js');
var	Forum		=	require('../models/Forum.js');
var	Category	=	require('../models/Category.js');
var	CM			=	require('./category-manager.js');

var	FM			=	{};

module.exports	=	FM;

// record insertion, update & deletion methods //

FM.create			=	function(newData, callback) 
{
	CM.getIDFromSlug(newData.category, function(id){
		newData.category = id;
		f = new Forum(newData);
		f.save(function () {
			Category.findByIdAndUpdate(id, {$push : { forums : f._id }}, function(err, c) {
				callback('ok');
			});
		});
	});
};
FM.createSubForum	=	function(newData, callback) 
{
	CM.getIDFromSlug(newData.category, function(id){
		newData.category = id;
		FM.getIDFromSlug(newData.parent, function(fid) {
			newData.parent = fid;
			f = new Forum(newData);
			f.save(function () {
				Category.findByIdAndUpdate(id, {$push : { forums : f._id }}, function(err, c) {
					Forum.findByIdAndUpdate(fid, {$push : {children : f._id}}, function(err, f) {
						callback('ok');
					});
				});
			});
		})
		
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

FM.listBySlug		=	function(slug, callback)
{
	Forum.findOne({slug: slug}).populate('topics', null, null, {sort: [['_id', 'desc']] } ).populate('parent').populate('children').exec(function(e, res) {
		console.log(e);
		if (e) callback(e)
		else callback(null, res.toObject())
	});
}

FM.getIDFromSlug	=	function(slug, callback)
{
	Forum.findOne({slug: slug}).select('_id').exec(function (err, f) {
		if(f) callback(f._id)
	})
}

FM.delAllRecords = function() 
{
	Forum.remove({}, function() {}); // reset accounts collection for testing //
}