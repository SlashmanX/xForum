var	Category	=	require('../models/Category.js');

var	CM			=	{};

module.exports	=	CM;

// record insertion, update & deletion methods //

CM.create	=	function(newData, callback) 
{
	new Category(newData).save(callback('ok'));
};

CM.list		=	function(callback)
{
	Category.find().populate('forums').exec(function(e, cats) {
		if (e) {
			callback(e);
		}
		else {
			callback(null, cats);
		}
	});
}

CM.listAll	=	function(callback)
{
	Category.find().exec(function(e, res) {
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
