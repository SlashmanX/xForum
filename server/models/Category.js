var	mongoose	=	require('mongoose');
var	Schema		=	mongoose.Schema;
var	ObjectId	=	Schema.ObjectId;
var	Forum		=	require('../models/Forum.js');

var	categorySchema = new Schema({
	name: String,
	desc: String,
	slug: String,
	forums: [{type: ObjectId, ref: 'Forum'}]
});

module.exports = mongoose.model('Category', categorySchema);
