
function RoleController()
{	
	$('#applicAreas').select2({});
	$('#default').select2({});
	$('a[rel="tooltip"]').tooltip();
	
	$('#checkAll').on('click', function (e) {
		e.preventDefault();
		$('input[type="checkbox"]').each(function() {
			$(this).attr('checked', 'checked');
		});
	});
	
	$('#uncheckAll').on('click', function (e) {
		e.preventDefault();
		$('input[type="checkbox"]').each(function() {
			$(this).removeAttr('checked');
		});
	});
	
	$('#sidebar-roles').addClass('active');
	// bind event listeners to button clicks //	
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
