
function TopicController()
{	
// bind event listeners to button clicks //
	var that = this;	
}
TopicController.prototype.onPostSuccess = function(pid)
{
	$('textarea[name="body"]').val('');
};
