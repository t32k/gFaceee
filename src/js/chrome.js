import DateTime from './datetime';

const Storage = chrome.storage.local;
const EXPIRE_KEY = 'gFaceee_cacheAvailable';

export function checkCache() {

  return new Promise((resolve, reject) => {

    let isAvailable  = true;

    Storage.get(EXPIRE_KEY, items => {

      if (!items.hasOwnProperty(EXPIRE_KEY)) {
        isAvailable = false;
      }

      let now = Date.now();
      let old = Number(items[EXPIRE_KEY]);

      if (now - old > DateTime.WEEK) {
        isAvailable = false;
      }

      if (!isAvailable) {

        let data = {};
        data[EXPIRE_KEY] = now;

        Storage.set(data, () => resolve(false));

      } else {
        resolve(true);
      }
    });
  });
}

export function getAvatar(githubId) {

  return new Promise((resolve, reject) => {

    Storage.get(`gFaceee-${githubId}`, items => {
      let dataURI = items[`gFaceee-${githubId}`];
      if (typeof dataURI === 'string') {
        resolve(dataURI);
      } else {
        reject();
      }
    });
  });
}

export function saveAvatar(githubId, dataURI) {

  let data = {};
  data[`gFaceee-${githubId}`] = dataURI;

  return new Promise((resolve, reject) => {
    Storage.set(data, () => resolve());
  });
}
