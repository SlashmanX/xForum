var	Category	=	require('../models/Category.js');
var	Topic		=	require('../models/Topic.js');
var	subPop		=	require('mongoose-subpopulate');
var defineModels = function defineModels (mongoose, callback) {
  var Schema = function (schemaDictionary) {
    var schema = new mongoose.Schema(schemaDictionary);
    schema.virtual('id').get(function () {
      return this._id.toHexString();
    });

    return schema;
  };
}
var db			=	subPop.extendMongoose(require('mongoose'), defineModels);
db.connect('mongodb://localhost/xForum');
var	Tester		=	{};


module.exports	=	Tester;

// record insertion, update & deletion methods //

Tester.subPopulateTest	=	function(callback) 
{
	db.Category.find().populate('forums').populate('forums.topics').exec(function(e, categories) {
		callback(e, categories);
	})
};