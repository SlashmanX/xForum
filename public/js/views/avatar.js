$(document).ready(function(){
    $('#fileupload').fileupload({
        dataType: 'json',
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css(
                'width',
                progress + '%'
            );
        },

        completed: function (e, data) {
            $('body').bar({
                message : 'Your avatar has been updated.'
            });
        }

    });
})