const fs = require('fs');
const Writable = require('stream').Writable;


class PagenatedFiles extends Writable {
  constructor(options) {
    super();
    this._currentPage = 1;
    this.prefix = options.prefix;
  }

  _write(chunk, encoding, callback) {
    console.log(`${this.prefix}-${this._currentPage}.mp3`);
    fs.open(`${this.prefix}-${this._currentPage}.mp3`, 'w', (error, fd) => {
      console.log(error, fd);
      if (error) {
        callback(error);
      } else {
        fs.write(fd, chunk, (error, written, buffer) => {
          console.log(error, written);
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
