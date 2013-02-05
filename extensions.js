$('.title').each(function(){

	var $title = $(this),
		path = $title.find('a').eq(0).attr('href');

	$.ajax({
		method: 'GET',
		url: path,
		dataType: 'html'
	}).done(function(data) {
		var avatarSrc = $(data).find('.avatared img').attr('src');
		var avatarUrls = avatarSrc.replace('s=420', 's=140');
		var $avatar = $('<img src="'+ avatarUrls + '" width="20" height="20" class="avatar" alt="">');
		$title.before($avatar);
	});
	
});