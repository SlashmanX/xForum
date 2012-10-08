var	jsdom	=	require('jsdom');
(function(exports){
	exports.getTitleFromURL = function(url, callback) {
		jsdom.env(url, ['http://code.jquery.com/jquery-1.8.2.min.js'], function(err, window) {
			var title = window.$('title').text();
			callback(title);
		})
	}
	
})(typeof exports === 'undefined'? this['functions']={}: exports);