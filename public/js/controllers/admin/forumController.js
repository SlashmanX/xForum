function ForumController()
{	
	$('#visibleTo').select2({});
	$('.sortableList').sortable({items: ':not(.catHeader)'});
	$('#sidebar-forums').addClass('active');
// bind event listeners to button clicks //	
	var that = this;	
}
ForumController.prototype.onUpdateSuccess = function(id)
{
	if(id != 'ok')
		$('li#tbdForum').attr('id', id).addClass('existingForum');
	$('#visibleTo').select2('val', '');
	$('a#newForum').addClass('hide');
	$('body').bar({
		message : 'Your changes have been saved!'
	});
}
