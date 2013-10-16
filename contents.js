var paths = [],
    sync = chrome.storage.sync;
    $dashboard = $("#dashboard");

function createAvatar(src) {
    var $avatar = $(document.createElement('img'));
    $avatar.addClass('g-avatar');
    $avatar.attr('src', src);
    return $avatar;
}

function showAvatar() {
    $dashboard.find('.simple > .title').each(function() {

        var $title = $(this),
            $avatar = null,

            // 遷移先（プロフィールページのURL）
            path = $title.find('a').attr('href'),
            pathKey = path.replace(/\//, ''),

            // 同期するデータ
            storageData = {};

        // 重複アカウントチェックchrome.storage参照
        if (_.include(paths, path)) {
            sync.get(pathKey, function(items) {
                // chrome.storageにvalueが存在し、かつavatarを有してないもの
                if (_.has(items, pathKey) && !$title.prev('img').get(0)) {
                    $avatar = createAvatar(items[pathKey]);
                    $title.before($avatar);
                }
            });
        } else {
            $.ajax({
                method: 'GET',
                url: path,
                dataType: 'html'
            }).done(function (data) {
                // アバター画像のパスの生成
                var avatarUrl = $(data).find('.avatar').attr('src').replace('s=420', 's=140');
                
                // <img>を生成
                $avatar = createAvatar(avatarUrl);
                $title.before($avatar);

                // chrome.storageにpathを貯めとく
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
var node = document.querySelector('.news');
if(node) {
    var observer = new WebKitMutationObserver(function () {
        showAvatar();
    });
    observer.observe(node, { childList: true });
}