jQuery(document).ready(function() {
	socket.on('newPost', function(post) {
		console.log(post);
		if(post.topic.forum == $('#forumid').val())
		{
			var thisTopic = $('div#topic-'+ post.topic.slug);
			thisTopic.find('.topic-replies').html(post.topic.replies.length);
			thisTopic.find('.topic-last-poster').html(post.author.username);
			thisTopic.find('.topic-status').html('<i class = "icon-folder-close"></i>');
			thisTopic.effect('highlight', {}, 1000);
		}
	});
});