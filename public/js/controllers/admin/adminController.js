// Define maximum available item on side bar
var _windowInnerHeight = 0,
	_currSideBarItems = 0;
	
$(document).mouseup(function (e)
{
    var container = $('.m-sidebar-collapsed');

    if (container.has(e.target).length === 0)
    {
        $('.btn_more').each(function () {
			if(_this.data('isShow') != undefined && _this.data('isShow')) {
				_this.data({isShow: false});
			}
		});
		$('.m-sidebar-collapsed').fadeOut();
    }
});

$(document).ready(function(){

	// Auto hide more button if sidebar is not full
	$('#btn-more').hide();

	// Apply bootstrap button plugin
	$('.btn').button();

	// Handle view more button for left sidebar
	$('.btn-more').bind('click', function(e){
		e.preventDefault();
		
		var n_sidebar = '#'+$(this).parent('li').attr('id') + '-links';
		console.log(n_sidebar);
		var _this = $(this);

		if($(n_sidebar +' .nav li').length == 0) {
			return false;
		}
		$('.btn_more').each(function () {
			if(_this.data('isShow') != undefined && _this.data('isShow')) {
				_this.data({isShow: false});
			}
		});
		$('.m-sidebar-collapsed').fadeOut();

		_this.data({isShow: true});

		var _offset = $(this).find('i').offset();

		$(n_sidebar).css({
			'top': _offset.top - 15 - window.scrollY + 'px',
			'left': _offset.left + 80 + 'px'
		}).fadeIn();
	});

	// get window inner height
	_windowInnerHeight = $(window).innerHeight();

	$(window).bind('resize', function(e){

		$('#sidebar-more-links').fadeOut();
		$('.btn-more').data({isShow: false});
		
		if($(window).innerWidth() <= 768) {
			pushSideBarItem($(n_sidebar +' .nav li').length);
			return false;
		}

		var _itemsCount = ($(window).innerHeight() - 60) / 76;
			_itemsCount = parseInt(_itemsCount, 10);

		// Get current sidebar length
		var _currSideBarLength = $('.sidebar .nav li').length;

		if(_itemsCount < 2 ) {
			_itemsCount = 2;
		}

		if(_currSideBarLength == _itemsCount) {
			return false;
		}


		if(_currSideBarLength > _itemsCount) {
			// Pop out
			popSideBarItem(_currSideBarLength - _itemsCount);
		} else {
			// Push in
			pushSideBarItem(_itemsCount - _currSideBarLength);
		}

		$('.btn-more').toggle($('#sidebar-more-links .nav li').length > 0);
		
		if($('.btn-more').css('display') == 'inline')
			$('.btn-more').css('display', 'block');

		if(_currSideBarLength == _itemsCount) {
			return false;
		}
	}).trigger('resize');

	function popSideBarItem(items) {

		_currSideBar = $('.sidebar .nav li');

		for(var i = _currSideBar.length - 2, iCount = 0; iCount < items; i--,iCount++){
			$('#sidebar-more-links .nav').prepend(_currSideBar[i]);
		}
	}

	function pushSideBarItem(items) {
		_collapseSideBar = $('.m-sidebar-collapsed .nav li');

		for(var i = 0, iCount = 0; iCount < items; i++, iCount++) {
			$('#sidebar-more').parents('li').before(_collapseSideBar[i]);
		}
	}
});