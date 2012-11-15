jQuery(document).ready(function() {
	var tc = new TopicController();
	$('#reply-post').wysihtml5({
			stylesheets: ['/css/editor.min.css'],
			scripts: 'http://platform.twitter.com/widgets.js'
	});

    $('.delete-post').on('click', function(e) {
        e.preventDefault();
        var postID = $(this).parentsUntil('section').parent().attr('id').replace('post-', '');
        var theAuthor = $(this).parentsUntil('section').parent().find('.post-username').attr('id').split('-').pop();

        $.ajax({
            type: "POST",
            url: "/delete/post/" + postID +"/",
            data: {"delete-post-seq": theAuthor},
            success: function() {
                $('body').bar({
                    message : 'This post has been deleted.'
                });
            },

            error: function(jqXHR, textStatus, errorThrown) {
                $('body').bar({
                    message : 'Error deleting post.'
                });
            }
        });

    });

    $('.delete-topic').on('click', function(e) {
        e.preventDefault();
        var topicID = $('input.topicid').val();
        var theAuthor = $(this).parentsUntil('section').parent().find('.post-username').attr('id').split('-').pop();

        $.ajax({
            type: "POST",
            url: "/delete/topic/" + topicID +"/",
            data: {"delete-topic-seq": theAuthor},
            success: function() {
                $('body').bar({
                    message : 'This topic has been deleted. Redirecting you back to the forum view.'
                });

                setTimeout(function(){
                    window.location = $('a.breadcrumb-forum:first').attr('href') ;
                }, 1000);
            },

            error: function(jqXHR, textStatus, errorThrown) {
                $('body').bar({
                    message : 'Error deleting topic.'
                });
            }
        });

    });
	
	$('.edit-post').on('click', function(e) {
		e.preventDefault();
		$('.cancel-edit').trigger('click');
		var postID = $(this).parentsUntil('section').parent().attr('id').replace('post-', '');
	    var theDiv = $(this).parentsUntil('section').parent().find('.post-body');
		var theAuthor = $(this).parentsUntil('section').parent().find('.post-username').attr('id').split('-').pop();
	    var editableText = $("<div class = 'editing-post'><form method = 'post' action = '/post/edit/"+postID+"/' id = 'edit-post-form'><input id = 'edit-post-seq' name = 'edit-post-seq' type= 'hidden' value = '"+ theAuthor+"'/><textarea style = 'width: "+ theDiv.width() +"px; height: "+ theDiv.height()+"px' name = 'edited-text' autofocus required>"+ theDiv.html() +"</textarea><div class = 'topic-post-actions'><button class = 'btn btn-danger cancel-edit'>Cancel</button><button class = 'btn btn-primary save-edit' type = 'submit'>Save</button></div></form>");
		theDiv.after("<div class = 'hide before-post-edit'>"+theDiv.html()+"</div>");
	    editableText.val(theDiv.html());
	    $(theDiv).replaceWith(editableText);
		editableText.after("");
		editableText.find('textarea').wysihtml5({
			stylesheets: ['/css/editor.min.css'],
			scripts: 'http://platform.twitter.com/widgets.js'
		});
	});

    $('.reply-post').on('click', function(e) {
        e.preventDefault();
        var thePost = $(this).parentsUntil('section').parent().find('.post-body').html();
        var theAuthor = $(this).parentsUntil('section').parent().find('.post-username').text();

        $('#reply-post').data('wysihtml5').editor.setValue("<blockquote>"+ thePost +" <br /><cite>Posted by "+ theAuthor +"</cite></blockquote><br /><br />").focus(true);
    });

    $('.multiquote-post').on('click', function(e) {
        e.preventDefault();
        var thePost = $(this).parentsUntil('section').parent().find('.post-body').html();
        var theAuthor = $(this).parentsUntil('section').parent().find('.post-username').text();

        $('#reply-post').data('wysihtml5').editor.setValue($('#reply-post').data('wysihtml5').editor.getValue() +"<blockquote>"+ thePost +" <br /><cite>Posted by "+ theAuthor +"</cite></blockquote><br /><br />");
    });
	
	$('body').on('click', '.cancel-edit', function(e) {
		e.preventDefault();
		var oldPost = $(this).parentsUntil('section').parent().find('.before-post-edit').html();
		$(this).parentsUntil('section').parent().find("iframe.wysihtml5-sandbox, input[name='_wysihtml5_mode']").remove();
		$(this).parentsUntil('section').parent().find('.editing-post').replaceWith("<div class = 'post-body'>"+oldPost +"</div>");
	});
	
	
	var pageUrl = document.location.pathname;
	var curPage = 1;
	var matches = pageUrl.match(/\/page\/(.*)\/$/);
	if (matches) {
	    curPage = matches[1];
	}
	
	pageUrl = pageUrl.replace(/\/page\/(.*)\/$/, '/');
	
	var jPagesOptions = {
		containerID: 'topic-posts',
		perPage : 10,
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
            console.log(curPage);
			$('#topic-posts').css('min-height', '');
			window.history.pushState(null, 'Page', pageUrl +'page/'+ pages.current+'/');
		}
	};
	
	
	$('#reply-form').ajaxForm({
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') tc.onPostSuccess(responseText);
		}
	});
	
	$('body').on('submit', '#edit-post-form', function(e){
		e.preventDefault();
		$.ajax({
		     type: "POST",
		     url: $(this).attr('action'),
		     data: $(this).serialize(),
		     success: function() {
				var newHTML = $('textarea[name="edited-text"]').val();
				$('#edit-post-form').parentsUntil('section').parent().find('.before-post-edit').remove();
				$('#edit-post-form').parentsUntil('section').parent().find("iframe.wysihtml5-sandbox, input[name='_wysihtml5_mode']").remove();
				$('#edit-post-form').parentsUntil('section').parent().find('.editing-post').replaceWith("<div class = 'post-body'>"+newHTML +"</div>");
				$('body').bar({
					message : 'Your changes have been saved!'
				});
		     },
		
			error: function(jqXHR, textStatus, errorThrown) {
				$('.cancel-edit').trigger('click');
				$('body').bar({
					message : 'You do not have permission to do that.'
				});
			}
		});
	});
	
	$('.topic-posts-jpages').jPages(jPagesOptions)
	$('abbr.timeago').timeago();

    socket.on('deletedPost', function(deletedPost){
        $('section#post-'+ deletedPost._id).effect('highlight', {mode: 'hide', color: "#CC0033"}, 1000);
        setTimeout(function() {
            $('section#post-'+ deletedPost._id).remove();
            $('.topic-posts-jpages').jPages('destroy');
            $('.topic-posts-jpages').jPages(jPagesOptions);
            $('#topic-posts').css('min-height', '');
        }, 1000);
    });
	
	socket.on('editedPost', function(newPost){
		$('section#post-'+ newPost._id).find('.post-body').html(newPost.body).effect('highlight', {}, 1000);
	});
	
	socket.on('newPost', function(post) {
		if(post.topic._id == $('.topicid').val())
		{
            var canPost = (user.role && user.role.permissions.CAN_POST);
			var canEdit = ((me.username == post.author.username) && (me.role && me.role.permissions.CAN_EDIT_OWN_POSTS)) || (me.role && me.role.permissions.CAN_EDIT_OTHERS_POSTS)
			var canDelete = ((me.username == post.author.username) && (me.role && me.role.permissions.CAN_DELETE_OWN_POSTS)) || (me.role && me.role.permissions.CAN_DELETE_OTHERS_POSTS)
			var canReport = (me.username != post.author.username)

            var userAvatar = '<img data-src="holder.js/120x120/text:'+post.author.username+'" class = "img-polaroid newHolder"/>';
            if(post.author.avatar)
                userAvatar = '<img src = "'+post.author.avatar+'" class = "img-polaroid"/>';

			
			var postHTML = "<section class = 'topic-post' id = 'post-"+ post._id+"'><div class = 'row post-details'><div class = 'span2 no-margin'><i class = 'icon-user'></i><span class = 'post-username'>"+ post.author.username + "</span></div><div class = 'span10'><small>Posted <abbr id = 'timestamp-"+ post._id+"'  class = 'timeago' title = '"+post.postedOn +"'>" +post.postedOn +"</abbr></small></div></div><div class = 'row'><div class = 'span2 no-margin'><ul class = 'user-details'><li class = 'user-avatar'>"+ userAvatar + "</li></ul></div><div class = 'span10'><div class = 'post-body'>"+ post.body +"</div></div></div><div class = 'row post-actions'><div class = 'span2 no-margin topic-user-actions'><button class = 'btn btn-info' type='button'><i class = 'icon-envelope'></i>PM</button></div><div class = 'span10'><span class = 'topic-post-actions'>";


            if(canPost)
                postHTML +="<button class = 'btn reply-post' type='button'><i class = 'icon-comment'></i>Reply</button><button class = 'btn multiquote-post' type='button'><i class = 'icon-comments'></i>Multi Quote</button>";
			
			
			if (canEdit)
				postHTML += "<button class = 'btn edit-post' type='button'><i class = 'icon-edit'></i>Edit</button>"
				
			if (canReport)
				postHTML += "<button class = 'btn btn-warning report-post' type='button'><i class = 'icon-legal'></i>Report</button>";
				
			if (canDelete)
				postHTML += "<button class = 'btn btn-danger delete-post' type='button'><i class = 'icon-trash'></i>Delete</button>"
				
			postHTML += "</span></div></section>";
			
			$(postHTML).appendTo($('section.posts')).hide();
			$('#post-'+ post._id).fadeIn('slow');
			$('.topic-posts-jpages').jPages('destroy');
			$('.topic-posts-jpages').jPages(jPagesOptions);
			$('abbr#timestamp-'+ post._id).timeago();
            Holder.run({images : '.newHolder'});
		}
	});
});

window.onbeforeunload = function (e) {
	socket.emit('leavingTopic', {topic: $('.topicid').val()});
};