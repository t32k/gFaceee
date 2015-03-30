(function () {

  // キャッシュ先（syncでも動く）
  var chromeStorage = chrome.storage.local;
  var dashboard = document.querySelector("#dashboard");
  var expireKey = 'gFaceee_cacheAvailable';
  var cacheAvailable = true;

  chromeStorage.get(expireKey, function (items) {

    var now = Date.now();

    if (items.hasOwnProperty(expireKey)) {
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

    var elements = document.querySelectorAll('.simple > .title');
    
    Array.prototype.forEach.call(elements, function (element) {
      
      var beforeNodeType = element.previousSibling.nodeType;

      if (beforeNodeType !== Node.ELEMENT_NODE ||
          beforeNodeType === Node.ELEMENT_NODE && element.previousSibling.tagName.toLowerCase() !== 'img') {
        
        var url = element.querySelector('a').href;
        var loginId = url.substring(url.lastIndexOf('/')).replace('/', '');

        // アバター画像を取得したら差し込む
        getAvatar(url, loginId).then(function (avatar) {
          element.parentNode.insertBefore(avatar, element);
        });
      }
      
    });
  }

  /**
   * get avatar from Gravatar or cached DataURI
   * @param {String} url
   * @param {String} loginId
   * @returns {Promise}
   */
  function getAvatar(url, loginId) {

    return new Promise(function (resolve, reject) {

      // 重複アカウントチェックchrome.storage参照
      chromeStorage.get(url, function (items) {

        if(items.hasOwnProperty(url) && cacheAvailable) {

          // chrome.storageにvalueが存在し、かつavatarを有してないもの
          var avatar = createAvatar(items[url]);

          resolve(avatar);

        } else {

          // ユーザー情報を取得する
          fetch('https://api.github.com/users/' + loginId)

            .then(function (response) {

              return response.json();

            }).then(function (data) {

              // 画像をDataURIに変換する
              var encoder = new ImageEncoder(data.avatar_url);
              encoder.setSize(38, 38);
              return encoder.getDataURI();

            }).then(function (datauri) {

              // DataURIを使ってimgを作成
              var avatar = createAvatar(datauri);

              // chrome.storageにpathを貯めとく
              var data = {};
              data[url] = datauri;
              chromeStorage.set(data, function () {
                // go to next element
                resolve(avatar);
              });

            }).catch(function (error) {
              reject(error);
            });
        }
      });
    });
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

  function distinguishDate(element) {
    var elapsed = Date.now() - new Date(element.getAttribute('datetime'));
    var day = 1000 * 60 * 60 * 24;
    var week = day * 7;
    var month = day * 30;
    var half = day * 180;
    var displayColor;

    if (elapsed < week) {
      displayColor = '#98c611'; // Green
    } else if (elapsed < month) {
      displayColor = '#d8b024'; // Yellow
    } else if (elapsed < half) {
      displayColor = '#f58142'; // Orange
    } else {
      displayColor = '#d9634d'; // Red
    }

    element.style.color = displayColor;
    element.style.fontWeight = 'bold';
  }

  var updated = document.querySelector('.updated');
  if (updated) {
    distinguishDate(updated);
  }

})();

