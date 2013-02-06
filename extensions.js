var paths = [],
    sync = chrome.storage.sync,
    defaultPath = chrome.extension.getURL('img/default_avatar.png');

function showAvatar() {
    $('.simple > .title').each(function () {

        var $title = $(this),
            path = $title.find('a').eq(0).attr('href'),
            pathKey = path.replace(/\//, ''),
            storageData = {};

        // 重複アカウントチェックchrome.storage参照
        if (_.include(paths, path)) {
            sync.get(pathKey, function (val) {
                var $avatar;
                if (val[pathKey]) {
                    $avatar = $('<img src="' + val[pathKey] + '" width="20" height="20" class="g-avatar" alt="">');
                } else {
                    $avatar = $('<img src="' + defaultPath + '" width="20" height="20" class="g-avatar" alt="">');
                }
                $title.before($avatar);
            });
        } else {
            $.ajax({
                method: 'GET',
                url: path,
                dataType: 'html'
            }).done(function (data) {
                var avatarSrc = $(data).find('.avatared img').attr('src');
                var avatarUrl = avatarSrc.replace('s=420', 's=140');
                var $avatar = $('<img src="' + avatarUrl + '" width="20" height="20" class="g-avatar" alt="">');
                $title.before($avatar);
                // chrome.storagesにpathを貯めとく
                storageData[pathKey] = avatarUrl;
                sync.set(storageData);
            });
        }
        paths.push(path);
    });
}

// 初期ロード実行
showAvatar();

// [More]読み込み監視
var node = document.getElementsByClassName('news')[0],
    observer = new WebKitMutationObserver(function () {
        showAvatar();
    });
observer.observe(node, { childList: true });