
function CreationController()
{	
	
// bind event listeners to button clicks //
	var that = this;	
}
CreationController.prototype.onUpdateSuccess = function()
{
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });				
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('Your thing has been added.'); 				
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}
