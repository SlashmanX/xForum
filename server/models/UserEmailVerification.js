var	mongoose	=	require('mongoose');
var	User		=	require('../models/User.js');
var	moment		=	require('moment');
var	Schema		=	mongoose.Schema;
var	ObjectId	=	Schema.ObjectId;

var	userEmailVerificationSchema = new Schema({
    user: {type: ObjectId, ref: 'User'},
    dateSent: {type: String, default: moment().format()}
});

module.exports = mongoose.model('UserEmailVerification', userEmailVerificationSchema);
