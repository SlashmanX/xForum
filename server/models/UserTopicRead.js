var	mongoose	=	require('mongoose');
var	Topic		=	require('../models/Topic.js');
var	User		=	require('../models/User.js');
var	moment		=	require('moment');
var	Schema		=	mongoose.Schema;
var	ObjectId	=	Schema.ObjectId;

var	userTopicReadSchema = new Schema({
	user: {type: ObjectId, ref: 'User'},
	topic: {type: ObjectId, ref: 'Topic'},
	lastAccessed: {type: String, default: moment().format()}
});

module.exports = mongoose.model('UserTopicRead', userTopicReadSchema);
