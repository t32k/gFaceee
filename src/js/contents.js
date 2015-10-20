import ImageEncoder from './image-encoder';
import Dispatcher   from './dispatcher';
import DateTime     from './datetime';

import {
  checkCache,
  getAvatar,
  saveAvatar
} from './chrome';

(function () {
  
  'use strict';

  let cacheAvailable = true;

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
    let promises = Array.prototype.map.call(elements, (element) => {

      let node     = element.previousSibling;
      let nodeType = node.nodeType;

      if (nodeType !== Node.ELEMENT_NODE ||
          nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'img') {
        
        let url = element.querySelector('a').href;
        let githubId = url.substring(url.lastIndexOf('/')).replace('/', '');

        if (!cacheAvailable) {
          return fetchAvatar(githubId)
            then((dataURI) => {
              let avatar = createAvatar(dataURI);
              element.parentNode.insertBefore(avatar, element);
              return saveAvatar(url, dataURI);
            });
        }

        return getAvatar(url)
          .then((dataURI) => {
            let avatar = createAvatar(dataURI);
            element.parentNode.insertBefore(avatar, element);
          })
          .catch((error) => {
            return fetchAvatar(githubId)
              then((dataURI) => {
                let avatar = createAvatar(dataURI);
                element.parentNode.insertBefore(avatar, element);
                return saveAvatar(url, dataURI);
              });
          });
      }
    });

    return Promise.all(promises);
  }

  /**
   * Fetch avatar image and convert it into dataURI
   * @param {String} githubId
   * @returns {Promise}
   */
  function fetchAvatar(githubId) {

    return new Promise((resolve, reject) => {
      fetch(`https://api.github.com/users/${githubId}`)
        .then((response) => response.json())
        .then((data) => {
          let encoder = new ImageEncoder(data.avatar_url);
          encoder.setSize(38, 38);
          return encoder.toDataURL();
        })
        .then((dataURI) => resolve(dataURI))
        .catch((error) => reject(error));
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

    if (elapsed < DateTime.WEEK) {
      className = 'g-lime';
    } else if (elapsed < DateTime.MONTH) {
      className = 'g-green';
    } else if (elapsed < DateTime.HALFYEAR) {
      className = 'g-yellow';
    } else if (elapsed < DateTime.YEAR) {
      className = 'g-orange';
    } else {
      className = 'g-red';
    }

    element.classList.add(className, 'g-label');
  }

  new Dispatcher()
    .add('/', () => {
      checkCache().then((isAvailable) => {
        cacheAvailable = isAvailable;
        showAvatar();
      });

      let news = document.querySelector('.news');
      if (news) {
        let observer = new MutationObserver(() => {
          showAvatar();
        });
        observer.observe(news, {
          childList: true
        });
      }
    })
    .add('/(.+)/(.+)', () => {
      var updated = document.querySelector('.commit-tease time');
      if (updated) {
        distinguishDate(updated);
      }
    })
    .add('/(.+)\?tab=activity', () => {
      console.log('activity');
    })
    .dispatch();
})();

