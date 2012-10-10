
$(document).ready(function(){

	var cc = new CreationController();
	
	$('#post').wysihtml5({stylesheets: ['/css/editor.min.css']});
	
	$('#create-form').ajaxForm({
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') cc.onUpdateSuccess(responseText);
		}
	});
	$('#name-tf').focus();

})