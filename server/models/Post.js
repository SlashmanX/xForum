var	mongoose	=	require('mongoose');
var	Schema		=	mongoose.Schema;
var	ObjectId	=	Schema.ObjectId;

var	postSchema = new Schema({
	author: {type: ObjectId, ref: 'User'},
	topic: {type: ObjectId, ref: 'Topic'},
	post: String,
	postedOn: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Post', postSchema);
