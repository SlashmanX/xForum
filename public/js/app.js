var url = [location.protocol, '//', location.host].join('');
var socket;
$(document).ready(function(){
	var ac = new AppController();
	socket = io.connect(url);
    $(".alert").alert();
});


function scrollToSection(sid){
    var sectionTag = $("section#"+ sid);
    $('html,body').animate({scrollTop: sectionTag.offset().top},'slow');
}