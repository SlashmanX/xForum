var	Role		=	require('../models/Role.js');
var	forms		=	require('forms-mongoose')
var	RM		=	{};

module.exports	=	RM;

RM.getNewRoleForm = function(callback) {
	var form = forms.create(Role);
	callback(form.toHTML());
}

RM.create = function(data, callback) {
	new Role(data).save(callback('ok'));
}