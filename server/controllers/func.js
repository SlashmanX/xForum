var	jsdom	=	require('jsdom');
var	oembed	=	require('oembed');

oembed.EMBEDLY_KEY = '3e6e71ce9fcb46179b1b4ecec4de9072';
(function(exports){
	exports.getTitleFromURL = function(url, callback) {
		jsdom.env(url, ['http://code.jquery.com/jquery-1.8.2.min.js'], function(err, window) {
			var title = window.$('title').text();
			callback(title);
		})
	}
	
	exports.getEmbedCode = function(url, callback) {
		oembed.fetch(url, {  }, function(error, result) {
		    if (error)
		        callback(error)
		    else
		        callback(null, result);
		});
	}
	
})(typeof exports === 'undefined'? this['functions']={}: exports);