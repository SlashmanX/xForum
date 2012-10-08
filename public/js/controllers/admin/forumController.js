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
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });				
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('Your forum has been added.'); 				
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}
