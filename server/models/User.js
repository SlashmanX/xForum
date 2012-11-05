var	mongoose	=	require('mongoose');
var	Schema		=	mongoose.Schema;
var	ObjectId	=	Schema.ObjectId;

var	userSchema = new Schema({
	username: String,
	password: String,
	realName: String,
	email: String,
	role: {type: ObjectId, ref: 'Role'},
	location: String,
    emailVerified: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);
