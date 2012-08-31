
function CreationController()
{	
	var subForumList = [];
	 $('#forumList option').each(function () {
		var cat = $(this).attr('class').replace('sub-', '');
		
		if(!subForumList[cat])
			subForumList[cat]= [];
			
		console.log($(this).text());
			
		subForumList[cat].push({slug: $(this).val(), text: $(this).text()});
	});
	
	$('#catList').on('change', function() {
		var cat = $(this).val();
		$('#forumList').html('').append('<option></option>');
		$.each(subForumList[cat], function() {
			$('#forumList').append('<option value = "'+ this.slug+'">'+ this.text +'</option>');
		})
	});
	
	$('#catList').trigger('change');
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
