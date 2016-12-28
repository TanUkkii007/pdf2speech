const {Transform} = require('stream');

class WordCountLimit extends Transform {

  constructor(options) {
    super({writableObjectMode: true, readableObjectMode: true});
    options = options || {};
    this.limit = options.limit || 0;
    if (this.limit <= 0) {
      throw new Exception(`limit must be > 0, but got ${this.limit}.`);
    }
  }

  _transform(data, encoding, callback) {
    const itemCount = data.items.length;
    var wordCount = 0;
    var prevIndex = 0
    for (var i = 0; i < itemCount; ++i) {
      const item = data.items[i];
      if (wordCount + item.str.length > this.limit) {
        const sliced = data.items.slice(prevIndex, i);
        this.push({items: sliced});
        wordCount = 0;
        prevIndex = i;
      }
      wordCount += item.str.length;
    }
    if (wordCount > 0) {
      const sliced = data.items.slice(prevIndex, itemCount);
      this.push({items: sliced});
    }
    callback();
  }
}

module.exports = {
  WordCountLimit
};
