jQuery(document).ready(function() {
	socket.on('newPost', function(post) {
		if(post.topic.forum == $('#forumid').val())
		{
			var thisTopic = $('div#topic-'+ post.topic.slug);
			thisTopic.find('.topic-replies').html(post.topic.replies.length);
			thisTopic.find('.topic-last-poster').html(post.author.username);
			thisTopic.find('.topic-status').html('<i class = "icon-folder-close"></i>')
            $('.forum-topics').prepend(thisTopic);
			thisTopic.effect('highlight', {}, 1000);

            $('.forum-topics-jpages').jPages('destroy');
            $('.forum-topics-jpages').jPages(jPagesOptions);
		}
	});

    socket.on('deletedPost', function(post) {
        if(post.topic.forum == $('#forumid').val())
        {
            var thisTopic = $('div#topic-'+ post.topic.slug);
            thisTopic.find('.topic-replies').html(post.topic.replies.length).effect('highlight', {}, 1000);
        }
    });
    var pageUrl = document.location.pathname;
    var curPage = 1;
    var matches = pageUrl.match(/\/page\/(.*)\/$/);
    if (matches) {
        curPage = matches[1];
    }

    pageUrl = pageUrl.replace(/\/page\/(.*)\/$/, '/');

    var jPagesOptions = {
        containerID: 'forum-topics-paginate',
        perPage : 5,
        startPage: curPage,
        first: '«',
        last: '»',
        previous : '‹',
        next : '›',
        minHeight: 'true',
        callback    : function( pages, items ){
            $('html').animate({scrollTop:0}, 'slow');//IE, FF
            $('body').animate({scrollTop:0}, 'slow');//WebKit
            curPage = pages.current;
            $('#forum-topics-paginate').css('min-height', '');
            window.history.pushState(null, 'Page', pageUrl +'page/'+ pages.current+'/');
        }
    };
	
	$('.forum-topics-jpages').jPages(jPagesOptions);
	
	socket.on('newTopic', function(topic) {
		
		if(topic.forum == $('#forumid').val())
		{
			$('section.forum-topics').prepend("<div class = 'row forum-topic' id = 'topic-" + topic.slug +"'><div class = 'span9'><div class = 'span1 topic-status'><i class = 'icon-folder-close'></i></div><div class = 'span3'><a href = '/topic/"+ topic.slug +"'>"+ topic.title +"</a><p class = 'help-block forum-topic-subtitle'>"+ topic.desc +"</p></div><div class = 'span1'>0</div><div class = 'span1 topic-replies'>0</div><div class = 'span2 topic-last-poster'> Slashman X</div></div></div>").find("div#topic-" + topic.slug).effect('highlight', {}, 1000);
			
			$('li.category-nav').after("<li class = 'forum-nav' id = 'nav-topic-"+ topic.slug+"'><a href = '/topic/"+ topic.slug +"/'><i class = 'icon-chevron-right'></i> "+ topic.title +"</a></li>");
			$('ul.bs-docs-sidenav').find('li#nav-topic-'+ topic.slug).effect('highlight', {}, 1000);

            $('.forum-topics-jpages').jPages('destroy');
            $('.forum-topics-jpages').jPages(jPagesOptions);
		}
	})
});