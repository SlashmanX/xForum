
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
	$('body').bar({
		message : 'Your changes have been saved!'
	});
}
