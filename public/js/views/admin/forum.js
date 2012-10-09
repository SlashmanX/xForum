
$(document).ready(function(){

	var fc = new ForumController();
	
	$('.sortableList').on('sortupdate', function() {
		$('#orderChanged').val('true');
		var text = $('#fId').val() != '' ? 'Update Forum & Order' : 'Update Order';
		$('button[type="submit"]').text(text);
	})
	
	$('a#newForum').on('click', function(e) {
		e.preventDefault();
		$('#addForum').clearForm();
		$('#visibleTo').select2('val', '');
		$('#fId').val('');
		var text = $('#orderChanged').val() == 'true' ? 'Create & Update Order' : 'Create';
		$('button[type="submit"]').text(text);
		$(this).addClass('hide');
	})
	
	$('select#category').on('change', function() {
		$('li#tbdForum').remove();
		if($('#fId').val() != '') {
			var tmp = $('li#'+ $('#fId').val());
			tmp.remove();
			$('ul#catList-'+ $(this).val()).append(tmp);
		}
		$('.sortableList').sortable('destroy');
		$('.sortableList').sortable({items: ':not(.catHeader)'});
		$('#name').trigger('change');
	})
	
	$('#name').on('keyup change', function(e) {
		if($(this).val().length > 0 && $('#fId').val() == '')
		{
			var text = $('#orderChanged').val() == 'true' ? 'Create & Update Order' : 'Create';
			$('button[type="submit"]').text(text);
		}
		if($('#fId').val() == '') {
			if($('li#tbdForum').length) {
				if($(this).val())
					$('li#tbdForum').text($(this).val());
				else
					$('li#tbdForum').remove();
			}
			else {
				if($(this).val()) {
					$('ul#catList-'+ $('#category').val()).append('<li id = "tbdForum">'+ $(this).val() + '</li>');
					$('.sortableList').sortable('destroy');
					$('.sortableList').sortable({items: ':not(.catHeader)'});
				}
			}
		}
		else
		{
			$('li#'+ $('#fId').val()).text($(this).val());
		}
	})
	
	$('li').on('click', '.existingForum', function(e) {
		socket.emit('getForumDetails', {id: $(this).attr('id')}, function(details) {
			$('#name').val(details.name)
			$('#desc').val(details.desc)
			$('#fId').val(details._id);
			$('#category option[value="'+details.category._id+'"]').attr('selected', 'selected');
			$('#visibleTo').select2('val', details.visibleTo);
			$('#newForum').removeClass('hide');
			$('li#tbdforum').remove();
			var text = $('#orderChanged').val() == 'true' ? 'Update Category & Order' : 'Update Category';
			$('button[type="submit"]').text(text);
		})
	})
	
	$('#addForum').ajaxForm({
		clearForm: true,
		beforeSubmit: function(arr, $form, options) {
			var order = [];
			$('ul#forumOrder li').each(function() {
				order.push({id: $(this).attr('id'), order: $(this).index()})
			})
			var fOrder = $('li#tbdForum').index();
			arr.push({name: 'fOrder', value: fOrder});
			arr.push({name: 'order', value: JSON.stringify(order)});
			arr.push({name: 'fId', value: $('#fId').val()});
			arr.push({name: 'orderChanged', value: $('#orderChanged').val()});
			return true;
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') fc.onUpdateSuccess(responseText);
		}
	});
	$('#name').focus();

})