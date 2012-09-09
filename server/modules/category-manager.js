var	Category	=	require('../models/Category.js');
var	TM			=	require('./topic-manager.js');
var	async		=	require('async');
var	CM			=	{};

module.exports	=	CM;

// record insertion, update & deletion methods //

CM.create	=	function(newData, callback) 
{
	new Category(newData).save(callback('ok'));
};

CM.listHomePage		=	function(user_id, callback)
{
	Category.find().populate('forums').exec(function(e, categories) {
		if (e) {
			callback(e);
		}
		else {
			
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
									TM.checkRead(user_id, categories[cCount].forums[fCount].topics[tCount], function(read){
										if(read) topicsRead++;
										tCount++;
										cbTopic();
									})
								},
								function(err) {
									categories[cCount].forums[fCount].isRead = (numTopics == topicsRead);
									categories[cCount].forums[fCount].unRead = numTopics - topicsRead;
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
		}
	});
}

CM.listAll	=	function(callback)
{
	Category.find().populate('forums').exec(function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
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