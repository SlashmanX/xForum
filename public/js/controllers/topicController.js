
function TopicController()
{	
// bind event listeners to button clicks //
	var that = this;	
}
TopicController.prototype.onPostSuccess = function(pid)
{
	$('textarea#reply-post').data("wysihtml5").editor.clear();
	$('body').bar({
		message : 'Your reply has been posted!'
	});
};

TopicController.prototype.onReportSuccess = function(pid)
{
    $('textarea#reply-post').data("wysihtml5").editor.clear();
    $('body').bar({
        message : 'The post has been reported to Administrators.'
    });
};
