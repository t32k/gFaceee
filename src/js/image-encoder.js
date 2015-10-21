export default class ImageEncoder {

  constructor(filePath = '') {
    this.filePath = filePath;
    this.width = null;
    this.height = null;
  }

  setSize(width = 1, height = 1) {
    this.width = width;
    this.height = height;
  }

  toDataURL() {

    return new Promise((resolve, reject) => {

      let onLoad = e => {

        let canvas = document.createElement('canvas');
        canvas.width = this.width ? this.width : image.width;
        canvas.height = this.height ? this.height : image.height;

        let context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        image.removeEventListener('load', onLoad);
        image.removeEventListener('error', onError);

        resolve(canvas.toDataURL());
      };

      let onError = e => {

        image.removeEventListener('load', onLoad);
        image.removeEventListener('error', onError);

        reject(e);
      };

      let image = new Image();
      image.setAttribute('crossOrigin','anonymous');
      image.addEventListener('load', onLoad);
      image.addEventListener('error', onError);
      image.src = this.filePath;
    });
  }
}
