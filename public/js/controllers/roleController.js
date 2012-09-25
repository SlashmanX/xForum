
function RoleController()
{	
// bind event listeners to button clicks //
// redirect to homepage on new account creation, add short delay so user can read alert window //	
	var that = this;	
}
RoleController.prototype.onUpdateSuccess = function()
{
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });				
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('Role has been added.'); 				
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}
