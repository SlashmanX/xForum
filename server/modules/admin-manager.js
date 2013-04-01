var	User		=	require('../models/User.js');
var Topic		=	require('../models/Topic.js');
var Post		=	require('../models/Post.js');
var RepM        =   require('./report-manager');
var	AM			=	{};

module.exports = AM;

AM.getDashboardStats = function(callback) {
	var stats = [];
	User.count().exec(function(err, userCount) {
		stats.push({name: 'Users', count: userCount});
		
		Topic.count().exec(function(err, topicCount) {
			stats.push({name: 'Topics', count: topicCount});
			
			Post.count().exec(function(err, postCount) {
				stats.push({name: 'Posts', count: postCount});
				
				callback(stats);
			});
		})
		
	});
}

AM.getNotifications = function(callback) {
    var notifications = {};
    RepM.getUnseenReports(function(e, reps){
        notifications.reports = reps;
        callback(notifications);
    })
}