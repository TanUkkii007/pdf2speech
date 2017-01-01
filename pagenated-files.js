const fs = require('fs');
const Writable = require('stream').Writable;

function zeroPad(number, n) {
  var numStr = number.toString();
  while (numStr.length < n) {
    numStr = '0' + numStr;
  }
  return numStr;
}

class PagenatedFiles extends Writable {
  constructor(options) {
    super();
    this._currentPage = 1;
    this.prefix = options.prefix;
    this.orderOfPages = options.orderOfPages || 3;
    this.dirname = options.dirname;
    this._directoryCreationNeeded = options.dirname && true;
  }

  _write(chunk, encoding, callback) {
    if (this._directoryCreationNeeded) {
      if (!fs.existsSync(this.dirname)) {
        fs.mkdirSync(this.dirname);
      }
      this._directoryCreationNeeded = false;
    }
    fs.open(`${this.dirname}/${this.prefix}-${zeroPad(this._currentPage, 3)}.mp3`, 'w', (error, fd) => {
      if (error) {
        callback(error);
      } else {
        fs.write(fd, chunk, (error, written, buffer) => {
          if (error) {
            callback(error);
          } else {
            this._currentPage++;
            fs.close(fd, (error) => {
              if (error) {
                callback(error);
              } else {
                callback();
              }
            });
          }
        });
      }
    });
  }
}

module.exports = {
  PagenatedFiles
};
