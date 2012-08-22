var url = [location.protocol, '//', location.host].join('');
var socket;

jQuery(document).ready(function($) {
	socket = io.connect(url);
	
	socket.on('connect', function() {
		console.log('connected');
	});
	
	$('.bs-docs-sidenav').affix({
	      offset: {top: 0 }
	    })
	
});
