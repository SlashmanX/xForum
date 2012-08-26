
var bcrypt = require('bcrypt');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var dbPort = 27017;
var dbHost = global.host;
var dbName = 'xForum';

// use moment.js for pretty date-stamping //
var moment = require('moment');

var CM = {}; 
	CM.db = new Db(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}, {}));
	CM.db.open(function(e, d){
		if (e) {
			console.log(e);
		}	else{
			console.log('connected to database :: ' + dbName);
		}
	});
	CM.categories = CM.db.collection('xForum_categories');

module.exports = CM;


// record insertion, update & deletion methods //

CM.addNew = function(newData, callback) 
{
	CM.categories.findOne({name:newData.name}, function(e, o) {	
		if (o){
			callback('name-taken');
		}	else{
			CM.categories.insert(newData, callback(null));
		}
	});
};
CM.addNewForum = function(newData, callback)
{
	CM.categories.findOne({name:newData.parentCat}, function(e, o){
		console.log(o);
		o.forums.push(newData.forum);
		CM.categories.save(o); callback(o);
	});
}
CM.addNewSubForum = function(newData, callback)
{
	CM.categories.findOne({"forums.name":newData.name}, function(e, o){
		o.forums.push(newData.forum);
		CM.categories.save(o); callback(o);
	});
}
CM.update = function(newData, callback) 
{		
	CM.categories.findOne({name:newData.name}, function(e, o){
		o.name	=	newData.name;
		CM.categories.save(o); callback(o);
	});
};

CM.delete = function(id, callback) 
{
	CM.categories.remove({_id: this.getObjectId(id)}, callback);
};

// auxiliary methods //

CM.getByName = function(name, callback)
{
	CM.categories.findOne({name:name}, function(e, o){ callback(o); });
};

CM.getObjectId = function(id)
{
// this is necessary for id lookups, just passing the id fails for some reason //	
	return CM.categories.db.bson_serializer.ObjectID.createFromHexString(id);
};

CM.getAllCategories = function(callback) 
{
	CM.categories.find().sort('_id').toArray(
	    function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

CM.delAllRecords = function(id, callback) 
{
	CM.categories.remove(); // reset accounts collection for testing //
}

// just for testing - these are not actually being used //

CM.findById = function(id, callback) 
{
	CM.categories.findOne({_id: this.getObjectId(id)}, 
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


CM.findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	CM.categories.find( { $or : a } ).toArray(
	    function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
