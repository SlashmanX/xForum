var	Role		=	require('../models/Role.js');
var	Forum		=	require('../models/Forum.js');
var	Category	=	require('../models/Category.js');
var	User		=	require('../models/User.js');
var	forms		=	require('forms-mongoose')
var	RM		=	{};

module.exports	=	RM;

RM.getNewRoleForm = function(callback) {
	Role.find({}, 'id name').exec(function (e, roles) {
		Category.find({}, 'id name forums').populate('forums', 'id name parent').exec(function (err, forums) {
			var perms = forms.create(Role, {}, 'edit');
			callback({roles: roles, perms: perms.toHTML(), forums: forums});
		});
	});	
}
RM.getRoles = function(callback) {
	Role.find({}, 'id name').exec(function(err, roles) {
		callback(roles);
	})
}

RM.getRolePermissions = function(id, callback) {
    Role.findOne({_id: id}, 'permissions').exec(function(err, perms) {
        callback(err, perms);
    })
}
RM.create = function(data, callback) {
	new Role(data).save(callback('ok'));
}