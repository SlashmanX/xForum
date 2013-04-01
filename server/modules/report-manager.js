var	mongoose	=	require('mongoose');
var	moment		=	require('moment');
var	PostReport	=	require('../models/PostReport.js');
var	ObjectId	=	mongoose.Types.ObjectId;

var	RM			=	{};
module.exports	=	RM;

// record insertion, update & deletion methods //

RM.create = function(data, callback) {
    new PostReport(data).save(function(err, report){
        callback(err, report);
    });
}

RM.getUnseenReports = function(callback) {
    PostReport.where('seenByAdmin', false).populate('post').populate('reportedBy').exec(callback);
}

RM.delAllRecords = function()
{
    PostReport.remove({}, function() {}); // reset accounts collection for testing //
}