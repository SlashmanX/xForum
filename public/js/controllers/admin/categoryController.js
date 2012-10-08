
function CategoryController()
{	
	$('#visibleTo').select2({});
	$('#categoryOrder').sortable();
	$('#sidebar-categories').addClass('active');
// bind event listeners to button clicks //	
	var that = this;	
}
CategoryController.prototype.onUpdateSuccess = function(id)
{
	$('li#tbdCategory').attr('id', id).addClass('existingCategory');
	$('#visibleTo').select2('val', '');
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });				
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('Your category has been added.'); 				
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}
