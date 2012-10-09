
$(document).ready(function(){

	var cc = new CategoryController();
	
	$('ul#categoryOrder').on('sortupdate', function() {
		$('#orderChanged').val('true');
		var text = $('#catId').val() != '' ? 'Update Category & Order' : 'Update Order';
		$('button[type="submit"]').text(text);
	})
	
	$('a#newCategory').on('click', function(e) {
		e.preventDefault();
		$('#addCategory').clearForm();
		$('#visibleTo').select2('val', '');
		$('#catId').val('');
		var text = $('#orderChanged').val() == 'true' ? 'Create & Update Order' : 'Create';
		$('button[type="submit"]').text(text);
		$(this).addClass('hide');
	})
	
	$('#name').on('keyup change', function(e) {
		
		if($(this).val().length > 0 && $('#catId').val() == '')
		{
			var text = $('#orderChanged').val() == 'true' ? 'Create & Update Order' : 'Create';
			$('button[type="submit"]').text(text);
		}
		if($('#catId').val() == '') {
			if($('li#tbdCategory').length) {
				if($(this).val())
					$('li#tbdCategory').text($(this).val());
				else
					$('li#tbdCategory').remove();
			}
			else {
				if($(this).val()) {
					$('ul#categoryOrder').append('<li class = "catHeader" id = "tbdCategory">'+ $(this).val() + '</li>');
					$('ul#categoryOrder').sortable('destroy');
					$('ul#categoryOrder').sortable();
				}
			}
		}
		else
		{
			$('li#'+ $('#catId').val()).text($(this).val());
		}
	})
	
	$('li.existingCategory').on('click', function(e) {
		socket.emit('getCategoryDetails', {id: $(this).attr('id')}, function(details) {
			$('#name').val(details.name)
			$('#desc').val(details.desc)
			$('#catId').val(details._id);
			$('#visibleTo').select2('val', details.visibleTo);
			$('#newCategory').removeClass('hide');
			$('li#tbdCategory').remove();
			var text = $('#orderChanged').val() == 'true' ? 'Update Category & Order' : 'Update Category';
			$('button[type="submit"]').text(text);
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
			arr.push({name: 'catId', value: $('#catId').val()});
			arr.push({name: 'orderChanged', value: $('#orderChanged').val()});
			return true;
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') cc.onUpdateSuccess(responseText);
		}
	});
	$('#name').focus();

})