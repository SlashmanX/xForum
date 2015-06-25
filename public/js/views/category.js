jQuery(document).ready(function() {
    $('abbr.timeago').timeago();
    socket.on('newPost', function(post) {
        var forumDiv = $('#forum-'+ post.topic.forum);
        if(forumDiv) {
            forumDiv.find('.home-category-last-post-topic').text(post.topic.title);
            forumDiv.find('.home-category-last-post-link').attr('href', '/topic/'+ post.topic.slug +'/#post-'+ post._id);
            forumDiv.find('.home-category-last-post-author').html(post.author.username);
            forumDiv.find('.home-category-last-post-time').untimeago();
            forumDiv.find('.home-category-last-post-time').attr('title', post.postedOn).text(post.postedOn).timeago();
            forumDiv.find('.forum-read-status').html('<i class = "icon-folder-close"></i>');


            forumDiv.effect('highlight', {}, 1000);
        }
    });
});