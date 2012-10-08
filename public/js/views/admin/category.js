
$(document).ready(function(){

	var cc = new CategoryController();
	
	$('ul#categoryOrder').on('sortupdate', function() {
		$('#orderChanged').val('true');
		$('button[type="submit"]').text('Update');
	})
	
	$('a#newCategory').on('click', function(e) {
		e.preventDefault();
		$('#addCategory').clearForm();
		$('#visibleTo').select2('val', '');
		$('#catId').val('');
		var text = $('#orderChanged').val() == 'true' ? 'Create & Update' : 'Create';
		$('button[type="submit"]').text(text);
		$(this).addClass('hide');
	})
	
	$('#name').on('keyup change', function(e) {
		
		if($(this).val().length > 0 && $('#catId').val == '')
		{
			console.log('Here');
			var text = $('#orderChanged').val() == 'true' ? 'Create & Update' : 'Create';
			$('button[type="submit"]').text(text);
		}
		if($('li#tbdCategory').length) {
			if($(this).val())
				$('li#tbdCategory').text($(this).val());
			else
				$('li#tbdCategory').remove();
		}
		else {
			if($(this).val()) {
				$('ul#categoryOrder').append('<li id = "tbdCategory">'+ $(this).val() + '</li>');
				$('ul#categoryOrder').sortable('destroy');
				$('ul#categoryOrder').sortable();
			}
		}
	})
	
	$('li.existingCategory').on('click', function(e) {
		socket.emit('getCategoryDetails', {id: $(this).attr('id')}, function(details) {
			$('#name').val(details.name)
			$('#desc').val(details.desc)
			$('#catId').val(details._id);
			$('#visibleTo').select2('val', details.visibleTo);
			$('#newCategory').removeClass('hide');
			$('button[type="submit"]').text('Update');
		})
	})
	
	$('#addCategory').ajaxForm({
		clearForm: true,
		beforeSubmit: function(arr, $form, options) {
			var order = [];
			$('ul#categoryOrder li').each(function() {
				order.push({id: $(this).attr('id'), order: $(this).index()})
			})
			var catOrder = $('li#tbdCategory').index();
			arr.push({name: 'catOrder', value: catOrder});
			arr.push({name: 'order', value: JSON.stringify(order)});
			return true;
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') cc.onUpdateSuccess(responseText);
		}
	});
	$('#name').focus();

})