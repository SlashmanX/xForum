var	mongoose	=	require('mongoose');
var	Schema		=	mongoose.Schema;

var	roleSchema = new Schema({
	name: {type: String, required: true, forms: { all: {} }},
	permissions: {
		CAN_ACCESS_CONTROL_PANEL: {type: Boolean, forms: { all: {} }, default: false},
		CAN_CREATE_CATEGORY: {type: Boolean, forms: { all: {} }, default: false},
		CAN_CREATE_FORUM: {type: Boolean, forms: { all: {} },default: false},
		CAN_CREATE_TOPIC: {type: Boolean, forms: { all: {} },default: false},
		CAN_POST: {type: Boolean, forms: { all: {} },default: false},
		CAN_EDIT_POSTS: {type: Boolean, forms: { all: {} },default: false},
		CAN_DELETE_OWN_POSTS: {type: Boolean, forms: { all: {} },default: false},
		CAN_DELETE_OTHERS_POSTS: {type: Boolean, forms: { all: {} },default: false},
		CAN_DELETE_TOPICS: {type: Boolean, forms: { all: {} },default: false},
	}
});

module.exports = mongoose.model('Role', roleSchema);
