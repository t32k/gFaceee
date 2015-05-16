import { WEEK } from './time';

const Storage = chrome.storage.local;
const EXPIRE_KEY = 'gFaceee_cacheAvailable';

export function checkCache() {

  return new Promise((resolve, reject) => {

    let isAvailable  = true;

    Storage.get(EXPIRE_KEY, (items) => {

      if (!items.hasOwnProperty(EXPIRE_KEY)) {
        isAvailable = false;
      }

      let now = Date.now();
      let old = Number(items[EXPIRE_KEY]);

      if (now - old > WEEK) {
        isAvailable = false;
      }

      if (!isAvailable) {

        let data = {};
        data[EXPIRE_KEY] = now;

        Storage.set(data, () => {
          resolve(false);
        });

      } else {
        resolve(true);
      }
    });
  });
}

export function getAvatar(url) {

  return new Promise((resolve, reject) => {

    Storage.get(url, (items) => {

      if (items.hasOwnProperty(url)) {

        resolve(items[url]);

      } else {

        reject(null);

      }
    });
  });
}

export function saveAvatar(url, dataURI) {

  let data = {};
  data[url] = dataURI;

  return new Promise((resolve, reject) => {
    Storage.set(data, () => {
      resolve();
    });
  });
}