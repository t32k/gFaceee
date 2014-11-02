(function () {

  var MutationObserver = MutationObserver || WebKitMutationObserver;

  // キャッシュ先（syncでも動く）
  var chromeStorage = chrome.storage.local;
  var dashboard = document.querySelector("#dashboard");
  var expireKey = 'gFaceee_cacheAvailable';
  var cacheAvailable = true;

  chromeStorage.get(expireKey, function (items) {

    var now = Date.now();
    
    if(_.has(items, expireKey)) {
      var old = items[expireKey] - 0;
      if(now - old > 7 * 24 * 3600 * 1000) {
        cacheAvailable = false;
      }
    } else {
      // 未実行か、ストレージがクリアされてる
      cacheAvailable = false;
    }
    
    // 保存されている月と異なる場合は更新
    // 未実行の場合も現在の月を保存
    if (!cacheAvailable) {
      // 現在の月を保存
      var data = {};
      data[expireKey] = now;
      chromeStorage.set(data, function () {});
    }
  });
  
  /**
   * Create img element
   * @param {String} src
   * @returns {HTMLElement}
   */
  function createAvatar(src) {
    var avatar = document.createElement('img');
    avatar.classList.add('g-avatar');
    avatar.setAttribute('src', src);
    return avatar;
  }

  /**
   * Show avatars
   */
  function showAvatar() {
    
    // 対象要素を取得しjQueryでラップする
    $('.simple > .title').each(function () {
      
      var $this = $(this);

      // MutationObserver用に、まず画像が既に差し込まれているかどうかを判断する
      if(!_.first($this.prev('img'))) {

        // loop promise
        var $defer = $.Deferred();
        var url = $this.find('a').attr('href');
        var loginId = url.substring(url.lastIndexOf('/')).replace('/', '');

        // アバター画像を取得したら差し込む
        getAvatar(url, loginId, $defer).done(function (avatar) {
          $this.before(avatar);
        });

      }
    });
  }

  /**
   * get avatar from Gravatar or cached DataURI
   * @param {String} url
   * @param {String} loginId
   * @returns {jQuery.promise}
   */
  function getAvatar(url, loginId, $defer) {

    // 重複アカウントチェックchrome.storage参照
    chromeStorage.get(url, function (items) {
      if(_.has(items, url) && cacheAvailable) {

        // chrome.storageにvalueが存在し、かつavatarを有してないもの
        var avatar = createAvatar(items[url]);
        $defer.resolve(avatar);

      } else {

        // ユーザー情報を取得する
        $.ajax({
          method: 'GET',
          url: "https://api.github.com/users/" + loginId,
          dataType: 'json'
        }).done(function (data) {
            
          // 画像をDataURIに変換する
          var encoder = new ImageEncoder(data.avatar_url);
          encoder.setSize(38, 38);
          encoder.getDataURI(function (datauri) {

            // DataURIを使ってimgを作成
            var avatar = createAvatar(datauri);

            // chrome.storageにpathを貯めとく
            var data = {};
            data[url] = datauri;
            chromeStorage.set(data, function () {
              // go to next element
              $defer.resolve(avatar);
            });

          });
        });
      }
    });
    return $defer.promise();
  }

  // 初期ロード実行
  showAvatar();
  
  // [More]読み込み監視
  var node = document.querySelector('.news');
  if (node) {
    var observer = new MutationObserver(function () {
      showAvatar();
    });
    observer.observe(node, {
      childList: true
    });
  }

})();