
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
