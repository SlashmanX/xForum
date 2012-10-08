var	mongoose	=	require('mongoose');
var	Schema		=	mongoose.Schema;
var	ObjectId	=	Schema.ObjectId;
var	Forum		=	require('../models/Forum.js');
var	Role		=	require('../models/Role.js');

var	categorySchema = new Schema({
	name: {type: String, forms: { all : {} } },
	desc: {type: String, forms: { all : {} } },
	slug: {type: String, forms: { all : {} } },
	forums: [{type: ObjectId, ref: 'Forum'}],
	visibleTo: [{type: ObjectId, ref: 'Role'}],
	order: {type: Number, default: 99}
});

module.exports = mongoose.model('Category', categorySchema);
