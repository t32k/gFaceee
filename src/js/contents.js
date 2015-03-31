(function () {
  
  'use strict';

  // キャッシュ先（syncでも動く）
  let chromeStorage = chrome.storage.local;
  let expireKey = 'gFaceee_cacheAvailable';
  let cacheAvailable = true;

  chromeStorage.get(expireKey, (items) => {

    let now = Date.now();

    if (items.hasOwnProperty(expireKey)) {

      let old = Number(items[expireKey]);
      if (now - old > 7 * 24 * 3600 * 1000) {
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
      let data = {};
      data[expireKey] = now;
      chromeStorage.set(data, () => {});
    }
  });

  /**
   * Create img element
   * @param {String} src
   * @returns {HTMLElement}
   */
  function createAvatar(src) {
    let avatar = document.createElement('img');
    avatar.classList.add('g-avatar');
    avatar.setAttribute('src', src);
    return avatar;
  }

  /**
   * Show avatars
   */
  function showAvatar() {

    let elements = document.querySelectorAll('.simple > .title');
    let promises = [];
    let avatars  = {};

    promises = Array.prototype.map.call(elements, (element) => {
      
      let previousNode     = element.previousSibling;
      let previousNodeType = previousNode.nodeType;

      if (previousNodeType !== Node.ELEMENT_NODE ||
          previousNodeType === Node.ELEMENT_NODE && previousNode.tagName.toLowerCase() !== 'img') {
        
        let url = element.querySelector('a').href;
        let loginId = url.substring(url.lastIndexOf('/')).replace('/', '');

        return getAvatar(url, loginId)
          .then((dataURI) => {
            let avatar = createAvatar(dataURI);
            element.parentNode.insertBefore(avatar, element);
            avatars[url] = dataURI;
          })
          .catch((error) => console.log(error));
      }
      
    });

    Promise.all(promises).then(() => {
      chromeStorage.set(avatars, () => {
        console.log('Cache saved');
      });
    });
  }

  /**
   * Get avatar element from Gravatar or cached dataURI
   * @param {String} url
   * @param {String} loginId
   * @returns {Promise}
   */
  function getAvatar(url, loginId) {

    return new Promise((resolve, reject) => {

      chromeStorage.get(url, (items) => {

        if (items.hasOwnProperty(url) && cacheAvailable) {

          resolve(items[url]);

        } else {

          fetch(`https://api.github.com/users/${loginId}`)
            .then((response) => response.json())
            .then((data) => {
              let encoder = new ImageEncoder(data.avatar_url);
              encoder.setSize(38, 38);
              return encoder.getDataURI();
            })
            .then((datauri) => resolve(datauri))
            .catch((error) => reject(error));
        }
      });
    });
  }

  /**
   * distinguish latest commit time
   * @param {Node} element
   */
  function distinguishDate(element) {

    var elapsed = Date.now() - new Date(element.getAttribute('datetime'));
    var day = 1000 * 60 * 60 * 24;
    var week = day * 7;
    var month = day * 30;
    var half = day * 180;
    var year = day * 365;
    var styleClass = '';

    if (elapsed < week) {
      styleClass = 'g-lime';
    } else if (elapsed < month) {
      styleClass = 'g-green';
    } else if (elapsed < half) {
      styleClass = 'g-yellow';
    } else if (elapsed < year) {
      styleClass = 'g-orange';
    } else {
      styleClass = 'g-red';
    }

    element.classList.add(styleClass, 'bold');
  }

  // 初期ロード実行
  showAvatar();

  // [More]読み込み監視
  let news = document.querySelector('.news');
  if (news) {
    let observer = new MutationObserver(() => showAvatar());
    observer.observe(news, {
      childList: true
    });
  }

  var updated = document.querySelector('.updated');
  if (updated) {
    distinguishDate(updated);
  }

})();

