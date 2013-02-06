var sync  = chrome.storage.sync,
	paths = [];

function displayAvatar () {
	$('.title').each(function(){

		var $title = $(this),
			path = $title.find('a').eq(0).attr('href'),
			pathKey = path.replace(/\//, ''),
			storageData = {};

		// 重複アカウントチェックchrome.storage参照
		if (_.include(paths, path)) {
			sync.get(pathKey, function(val) {
				var $avatar = $('<img src="'+ val[pathKey] + '" width="20" height="20" class="avatar" alt="">');
				$title.before($avatar);
			});
		} else {
			$.ajax({
				method: 'GET',
				url: path,
				dataType: 'html'
			}).done(function(data) {
				var avatarSrc = $(data).find('.avatared img').attr('src');
				var avatarUrl = avatarSrc.replace('s=420', 's=140');
				var $avatar = $('<img src="'+ avatarUrl + '" width="20" height="20" class="avatar" alt="">');
				$title.before($avatar);
				// chrome.storagesにpathを貯めとく
				storageData[pathKey] = avatarUrl;
				sync.set(storageData);
			});
		}
		paths.push(path);
	});
}

displayAvatar();

$('.news').on('click', '.ajax_paginate > a', function() {
	setTimeout(function() {
		displayAvatar();
	}, 500);
});