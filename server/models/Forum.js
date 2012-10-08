var	mongoose	=	require('mongoose');
var	Category	=	require('../models/Category.js');
var	Schema		=	mongoose.Schema;
var	ObjectId	=	Schema.ObjectId;

var	forumSchema = new Schema({
	name: String,
	desc: String,
	slug: String,
	category: {type: ObjectId, ref: 'Category'},
	parent: {type: ObjectId, ref: 'Forum', default: null},
	children: [{type: ObjectId, ref: 'Forum', default: null}],
	topics: [{type: ObjectId, ref: 'Topic'}],
	order: {type: Number, default: 99}
});

module.exports = mongoose.model('Forum', forumSchema);
