
$(document).ready(function(){

    var ic = new InstallController();

// main login form //

    $('#install-form').ajaxForm({
        beforeSubmit: function() {
            $('#btn-install').button('loading');
            return true;
        },
        success	: function(responseText, status, xhr, $form){
            if (status == 'success') window.location.href = '/admin/';
            $('#btn-install').button('reset');
        },
        error : function(e){
            console.log('Error');
            $('#btn-install').button('reset');
        }
    });

})