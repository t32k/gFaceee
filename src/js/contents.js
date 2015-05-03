(function () {
  
  'use strict';

  const chromeStorage = chrome.storage.local;
  const map = Array.prototype.map;

  const HOUR     = 60 * 60 * 1000;
  const DAY      = HOUR * 24;
  const WEEK     = DAY * 7;
  const MONTH    = DAY * 30;
  const HALFYEAR = MONTH * 6;
  const YEAR     = DAY * 365;

  let cacheAvailable = true;

  function checkCacheAvailable() {

    return new Promise((resolve, reject) => {

      const EXPIRE_KEY = 'gFaceee_cacheAvailable';
      let isAvailable  = true;

      chromeStorage.get(EXPIRE_KEY, (items) => {

        if (!items.hasOwnProperty(EXPIRE_KEY)) {
          // 未実行か、ストレージがクリアされてる
          isAvailable = false;
        }

        let now = Date.now();
        let old = Number(items[EXPIRE_KEY]);

        if (now - old > WEEK) {
          isAvailable = false;
        }

        // 保存されている月と異なる場合は更新
        // 未実行の場合も現在の月を保存
        if (!isAvailable) {

          let data = {};
          data[EXPIRE_KEY] = now;

          chromeStorage.set(data, () => {
            resolve(false);
          });

        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * Create img element
   * @param {String} src
   * @returns {HTMLElement}
   */
  function createAvatar(src) {
    let avatar = document.createElement('img');
    avatar.classList.add('g-avatar');
    avatar.src = src;
    return avatar;
  }

  /**
   * Show avatars
   */
  function showAvatar() {

    let elements = document.querySelectorAll('.simple > .title');
    let promises = [];
    let avatars  = {};

    promises = map.call(elements, (element) => {

      let node     = element.previousSibling;
      let nodeType = node.nodeType;

      if (nodeType !== Node.ELEMENT_NODE ||
          nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'img') {
        
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

    let datetime = element.getAttribute('datetime');
    let elapsed = Date.now() - new Date(datetime);
    let className = '';

    if (elapsed < WEEK) {
      className = 'g-lime';
    } else if (elapsed < MONTH) {
      className = 'g-green';
    } else if (elapsed < HALFYEAR) {
      className = 'g-yellow';
    } else if (elapsed < YEAR) {
      className = 'g-orange';
    } else {
      className = 'g-red';
    }

    element.classList.add(className, 'g-bold');
  }

  // 初期ロード実行
  checkCacheAvailable().then((isAvailable) => {
    cacheAvailable = isAvailable;
    console.log('cache available:', cacheAvailable);
    showAvatar();
  });

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

