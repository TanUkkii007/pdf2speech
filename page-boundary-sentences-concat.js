const {Transform} = require('stream');

class PageBoundarySentencesConcat extends Transform {

  constructor(options) {
    super({writableObjectMode: true, readableObjectMode: true});
    options = options || {};
    this.period = options.period || '.';
  }

  _transform(data, encoding, callback) {
    if (!this._prevPage) {
      this._prevPage = data;
    } else {
      const lastStr = this._prevPage.items[this._prevPage.items.length - 1].str;
      if (!lastStr.trim().endsWith(this.period)) {
        var i = 0;
        const appendLines = [];
        while(true) {
          const item = data.items[i];
          const index = item.str.indexOf(this.period);
          if (index !== -1) {
            const copiedPrev = Object.assign({}, item);
            copiedPrev.str = item.str.slice(0, index + 1);
            appendLines.push(copiedPrev);
            item.str = item.str.slice(index + 1);
            break;
          } else {
            appendLines.push(item);
          }
          ++i;
        }
        this._prevPage.items = this._prevPage.items.concat(appendLines);
      }
      this.push(this._prevPage);
      this._prevPage = data;
    }
    callback();
  }

  _flush(callback) {
    this.push(this._prevPage);
    callback();
  }
}

module.exports = {
  PageBoundarySentencesConcat
};
