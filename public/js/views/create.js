
$(document).ready(function(){

	var cc = new CreationController();
	
	$('#create-form').ajaxForm({
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') cc.onUpdateSuccess();
		}
	});
	$('#name-tf').focus();

})