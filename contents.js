(function() {

  var chromeStorage = chrome.storage.local;
  var dashboard = document.querySelector("#dashboard");

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
    
    // get elements and wrap them as jQuery object
    var titles = dashboard.querySelectorAll('.simple > .title');
    var $titles = _.map(titles, function(title) {
      return $(title);
    });

    _.each($titles, function($title) {
      var url = $title.find('a').attr('href');
      var loginId = url.substring(url.lastIndexOf('/')).replace('/', '');
      getAvatar(url, loginId).then(function(avatar) {
        $title.before(avatar);
      });
    });
  }

  /**
   * get avatar from Gravatar or cached DataURI
   * @param {String} url
   * @param {String} loginId
   * @returns {jQuery.promise}
   */
  function getAvatar(url, loginId) {

    // loop promise
    var $defer = $.Deferred();

    // 重複アカウントチェックchrome.storage参照
    chromeStorage.get(url, function(items) {
      if (_.has(items, url) && !_.first($title.prev('img'))) {

        // chrome.storageにvalueが存在し、かつavatarを有してないもの
        var avatar = createAvatar(items[url]);
        $defer.resolve(avatar);

      } else {
        
        // get user info
        $.ajax({
          method: 'GET',
          url: "https://api.github.com/users/" + loginId,
          dataType: 'json'
        }).done(function(data) {
            
          // encode image into resized DataURI of png
          var encoder = new ImageEncoder(data.avatar_url);
          encoder.setSize(19, 19);
          encoder.getDataURI(function(datauri) {

            // create img
            var avatar = createAvatar(data.avatar_url);

            // chrome.storageにpathを貯めとく
            var storageData = {};
            storageData[url] = datauri;
            chromeStorage.set(storageData, function() {
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
  if(node) {
    var observer = new WebKitMutationObserver(function () {
      showAvatar();
    });
    observer.observe(node, { childList: true });
  }

})();