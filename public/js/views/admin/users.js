
$(document).ready(function(){

    var uc = new UsersController();
    $('#userSelect').on('change', function(){
        socket.emit('getUserDetails', {id: $(this).val()}, function(details) {
            $('#username').val(details.username);
            $('#userId').val(details._id);
            $('#role').select2("val", details.role);
        });
    });

    $('#userSelect').trigger('change');

    $('#updateUser').ajaxForm({
        clearForm: true,
        beforeSubmit: function(arr, $form, options) {
            arr.push({name: 'userId', value: $('#userId').val()});
            return true;
        },
        success	: function(responseText, status, xhr, $form){
            if (status == 'success') uc.onUpdateSuccess(responseText);
        }
    });
    $('#username').focus();

})