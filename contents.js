(function() {

  var cachedKeys = [];
  var sync = chrome.storage.sync;
  var dashboard = document.querySelector("#dashboard");
  
  function createAvatar(src) {
    var avatar = document.createElement('img');
    avatar.classList.add('g-avatar');
    avatar.setAttribute('src', src);
    return avatar;
  }
  
  function showAvatar() {
    var titles = dashboard.querySelectorAll('.simple > .title');
    var $titles = _.map(titles, function(title) {
      return $(title);
    });
    _.each($titles, function($title) {
      var url = $title.find('a').attr('href');
      var loginId = url.substring(url.lastIndexOf('/')).replace('/', '');
      var avatar = null;
  
      // 重複アカウントチェックchrome.storage参照
      if(_.include(cachedKeys, url)) {
        sync.get(url, function(items) {
          // chrome.storageにvalueが存在し、かつavatarを有してないもの
          if (_.has(items, url) && !_.first($title.prev('img'))) {
            avatar = createAvatar(items[url]);
            $title.before(avatar);
          }
        });
      } else {
        $.ajax({
          method: 'GET',
          url: "https://api.github.com/users/" + loginId,
          dataType: 'json'
        }).done(function(data) {
          // <img>を生成
          avatar = createAvatar(data.avatar_url);
          $title.before(avatar);
  
          // chrome.storageにpathを貯めとく
          var storageData = {};
          storageData[url] = data.avatar_url;
          sync.set(storageData);
        });
      }
      cachedKeys.push(url);
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

})();