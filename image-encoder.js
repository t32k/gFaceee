(function(window) {

  /**
   * ImageEncoder constructor
   * @param {String} path
   * @constructor
   */
  function ImageEncoder(path) {
    this.filePath = path ? path : '';
    this.canvas = document.createElement('canvas');
    this.image = null;
    this.width = null;
    this.height = null;
  }

  /**
   * Set resource path
   * @param {String} path
   */
  ImageEncoder.prototype.setPath = function(path) {
    this.filePath = path;
  };

  /**
   * Set size
   * @param {Number} width
   * @param {Number} height
   */
  ImageEncoder.prototype.setSize = function(width, height) {
    this.width = width;
    this.height = height;
  };

  /**
   * Release memory
   */
  ImageEncoder.prototype.dispose = function() {
    this.canvas = null;
    this.image = null;
  };

  /**
   * Generate datauri
   * @param {Function} callback
   */
  ImageEncoder.prototype.getDataURI = function(callback) {
    if(!this.filePath) {
      return null;
    }
    var that = this;
    var onloadCallback = function(e) {
      that.canvas.width = that.image.width;
      that.canvas.height = that.image.height;
      if(that.width) {
        that.canvas.width = that.width;
      }
      if(that.height) {
        that.canvas.height = that.height;
      }
      var context = that.canvas.getContext('2d');
      context.drawImage(that.image, 0, 0, that.canvas.width, that.canvas.height);
      callback(that.canvas.toDataURL('image/png', 1));
      that.image.removeEventListener('load', onloadCallback);
    };
    this.image = new Image();
    this.image.setAttribute('crossOrigin','anonymous');
    this.image.addEventListener('load', onloadCallback);
    this.image.src = this.filePath;
  };
  
  window.ImageEncoder = ImageEncoder;
  
})(window);