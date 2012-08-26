var url = [location.protocol, '//', location.host].join('');
var socket;
$(document).ready(function(){
	var ac = new AppController();
	socket = io.connect(url);
});