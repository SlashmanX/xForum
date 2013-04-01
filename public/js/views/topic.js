jQuery(document).ready(function() {
    var iDeleted = false;
	var tc = new TopicController();
	$('#reply-post').wysihtml5({
			stylesheets: ['/css/editor.min.css'],
			scripts: 'http://platform.twitter.com/widgets.js'
	});

    $('.report-post').on('click', function(e) {
        e.preventDefault();
        var postID = $(this).parentsUntil('section').parent().attr('id').replace('post-', '');
        $('#modal-confirm-header').text('Report Post');
        $('#modal-confirm-body').html("<label for = 'message'>Reason for Reporting:</label><textarea id = 'report-post-reason' name='message'></textarea> ");
        $('#modal-confirm-ok').text('Report').addClass('btn-primary');
        $('#modal-confirm-ok').on('click', function(e){
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: "/post/report/" + postID +"/",
                data: {"message": $('#report-post-reason').val()},
                success: function() {
                    $('.modal-confirm').modal('hide');
                    $('body').bar({
                        message : 'This post has been reported.'
                    });
                },

                error: function(jqXHR, textStatus, errorThrown) {
                    $('body').bar({
                        message : 'Error reporting post.'
                    });
                }
            });
        });
        $('.modal-confirm').modal({show: true});
    })

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
                iDeleted = true;
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
        var theHTML = $(this).parentsUntil('section').parent().find('.actual-post').html();
        console.log(theHTML);
		var theAuthor = $(this).parentsUntil('section').parent().find('.post-username').attr('id').split('-').pop();
	    var editableText = $("<div class = 'editing-post'><form method = 'post' action = '/post/edit/"+postID+"/' id = 'edit-post-form'><input id = 'edit-post-seq' name = 'edit-post-seq' type= 'hidden' value = '"+ theAuthor+"'/><textarea style = 'width: "+ theDiv.width() +"px; height: "+ theDiv.height()+"px' name = 'edited-text' autofocus required>"+ theHTML +"</textarea><div class = 'topic-post-actions'><button class = 'btn btn-danger cancel-edit'>Cancel</button><button class = 'btn btn-primary save-edit' type = 'submit'>Save</button></div></form>");
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
        var lastEdit = newPost.editHistory[newPost.editHistory.length -1]
        var editHTML = "<div class = 'edit-box'>Edited by "+ lastEdit.editedByUser+"  <abbr class = 'timeago' title='"+lastEdit.dateEdited+"'> "+lastEdit.dateEdited +"</abbr>";
		$('section#post-'+ newPost._id).find('.post-body').html('<div class = "actual-post">'+newPost.body+'</div>').append(editHTML).effect('highlight', {}, 1000);
        $('section#post-'+ newPost._id).find('.post-body').find('abbr.timeago').untimeago();
        $('section#post-'+ newPost._id).find('.post-body').find('abbr.timeago').timeago();
    });

    socket.on('deletedTopic', function(topic){
        if(topic._id == $('.topicid').val() && !iDeleted)
        {
            $('body').bar({
                message : 'This topic has been deleted. You cannot reply to it anymore.',
                time : 10000000000000  // Needs to be 'persistent'
            });
            $('#reply-post').data('wysihtml5').editor.disable();
            $('.topic-view button').attr('disabled', 'disabled').addClass('disabled');
        }
    })
	
	socket.on('newPost', function(post) {
		if(post.topic._id == $('.topicid').val())
		{
            var user = me;
            var newPost = browserijade("post", {post: post, user: me, topic: post.topic});
			
			$(newPost).appendTo($('section.posts')).hide();
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