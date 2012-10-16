$(function($) {

	$.fn.bar = function(options) {
		var defaults = {
			position: 'top',
			removebutton: true,
			time: 3000
		};
		options = $.extend(defaults, options);

		if ($('.jbar').length) {
			$.fn.bar.removebar();
		}

		jbartimeout = setTimeout('$.fn.bar.removebar()', options.time);
		var _message_span = $(document.createElement('span')).addClass('jbar-content').html(options.message);
		var _wrap_bar;
		(options.position == 'bottom') ?
					_wrap_bar = $(document.createElement('div')).addClass('jbar jbar-bottom') :
					_wrap_bar = $(document.createElement('div')).addClass('jbar jbar-top');

		_wrap_bar.addClass("notification");
		if (options.useClass != undefined) _wrap_bar.addClass(options.useClass);

		if (options.removebutton) {
			var _remove_cross = $(document.createElement('i')).addClass('icon-remove').addClass('jbar-cross');
			_remove_cross.click(function(e) { $.fn.bar.removebar(); })
		}
		else {
			_wrap_bar.css({ "cursor": "pointer" });
			_wrap_bar.click(function(e) { $.fn.bar.removebar(); })
		}
		_wrap_bar.append(_message_span).append(_remove_cross).hide().insertAfter($('body')).slideDown('fast');
		$('body').append(_wrap_bar);
		_wrap_bar.css({ "display": "block" });
	};

	var jbartimeout;
	$.fn.bar.removebar = function(txt) {
		if ($('.jbar').length) {
			clearTimeout(jbartimeout);
			$('.jbar').slideUp('fast', function() {
				$(this).remove();
			});
		}
	};

});