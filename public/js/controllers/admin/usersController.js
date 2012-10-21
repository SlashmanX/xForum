
function UsersController()
{
    $('#role').select2({});
    $('#userSelect').select2({});
    $('#sidebar-users').addClass('active');
// bind event listeners to button clicks //
    var that = this;
}
UsersController.prototype.onUpdateSuccess = function(id)
{
    $('#role').select2('val', '');
    $('body').bar({
        message : 'Your changes have been saved!'
    });
}
