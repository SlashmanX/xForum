var	User		=	require('../models/User.js');
var	AM			=	{}; 
var	bcrypt		=	require('bcrypt');
var	mongoose	=	require('mongoose');
var	ObjectId	=	mongoose.Types.ObjectId;

module.exports = AM;

// logging in //
/**
 * Tries to login the user based on the provided username and password
 * Returns user object if successful, null object otherwise
 *
 * @param  {String} username
 * @param  {String} password
 * @param  {Function} callback A function to be called after login has been attempted
 */
AM.autoLogin = function(username, password, callback)
{
	User.findOne({username:username}).populate('role').exec(function(e, o) {
		if (o) {
			(o.password === password) ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
};

AM.updateAvatar = function(data, callback)
{
    User.findByIdAndUpdate(data.id, {$set: {avatar: data.avatar}}, callback);
}

AM.manualLogin = function(username, password, callback)
{
	User.findOne({username:username}).populate('role').exec(function(e, o) {
		if (o == null){
			callback('user-not-found');
		}	else{
			bcrypt.compare(password, o.password, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');				
				}
			});
		}
	});
};

// record insertion, update & deletion methods //

AM.signup = function(newData, callback) 
{
	User.findOne({username:newData.username}, function(e, o) {	
		if (o){
			callback('username-taken');
		}	else{
			User.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken');
				}	else{
					AM.saltAndHash(newData.password, function(hash){
						newData.password = hash;
						new User(newData).save(callback(null));
					});
				}
			});
		}
	});
};

AM.verifyEmail = function(newData, callback)
{
    User.findByIdAndUpdate(newData.id, {$set: {emailVerified: true}}, callback);
}

AM.update = function(newData, callback) 
{
    User.findByIdAndUpdate(newData.id, {$set: {username: newData.username, role: new ObjectId(newData.role + '')}}, callback);
}

AM.saltAndHash = function(pass, callback)
{
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(pass, salt, function(err, hash) {
			callback(hash);
	    });
	});
}

AM.delete = function(id, callback) 
{
	User.remove({_id: this.getObjectId(id)}, callback);
}

// auxiliary methods //

AM.getEmail = function(email, callback)
{
	User.findOne({email:email}, function(e, o){ callback(o); });
}
AM.getObjectId = function(id)
{
// this is necessary for id lookups, just passing the id fails for some reason //	
	return User.db.bson_serializer.ObjectID.createFromHexString(id)
}

AM.list = function(callback) 
{
	User.find(function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

AM.delAllRecords = function(id, callback) 
{
	User.remove(); // reset accounts collection for testing //
}

// just for testing - these are not actually being used //

AM.findById = function(id, callback) 
{
	User.findOne({_id: id},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


AM.findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	User.find( { $or : a } ).toArray(
	    function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
