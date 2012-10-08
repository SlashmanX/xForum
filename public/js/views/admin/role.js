
$(document).ready(function(){

	var rc = new RoleController();
	
	$('#create-form').ajaxForm({
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') rc.onUpdateSuccess();
		}
	});

})