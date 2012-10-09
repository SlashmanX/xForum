
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
	if(id != 'ok')
		$('li#tbdCategory').attr('id', id).addClass('existingCategory');
	$('#visibleTo').select2('val', '');
	$('body').bar({
		message : 'Your changes have been saved!'
	});
}
