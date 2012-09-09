
function CreationController()
{	
	// Uncomment when subforum spport has been added
	/*var subForumList = [];
	 $('#forum-list option').each(function () {
		var cat = $(this).attr('class').replace('sub-', '');
		
		if(!subForumList[cat])
			subForumList[cat]= [];
			
		subForumList[cat].push({id: $(this).val(), text: $(this).text()});
	});
	
	$('#cat-list').on('change', function() {
		var cat = $(this).val();
		$('#forum-list').html('').append('<option></option>');
		$.each(subForumList[cat], function() {
			$('#forum-list').append('<option value = "'+ this.id+'">'+ this.text +'</option>');
		})
	});
	
	$('#cat-list').trigger('change');*/
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
