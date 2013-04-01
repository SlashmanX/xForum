var	mongoose	=	require('mongoose');
var	Topic		=	require('../models/Topic.js');
var	User		=	require('../models/User.js');
var moment		=	require('moment');
var	Schema		=	mongoose.Schema;
var	ObjectId	=	Schema.ObjectId;

var	postReportSchema = new Schema({
    post: {type: ObjectId, ref: 'Post'},
    message: String,
    reportedOn: {type: String, default: moment().format()},
    reportedBy: {type: ObjectId, ref: 'User'},
    seenByAdmin: {type: Boolean, default: false}
});

module.exports = mongoose.model('PostReport', postReportSchema);
