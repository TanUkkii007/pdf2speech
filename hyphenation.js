const {Transform} = require('stream');

class Hyphenation extends Transform {

  constructor(options) {
    super({writableObjectMode: true, readableObjectMode: true});
    options = options || {};
    this.hyphen = options.hyphen || '‐';
  }

  _transform(data, encoding, callback) {
    const itemLength = data.items.length;
    const newItems = data.items.map((value, index, items) => {
      if (value.str.endsWith(this.hyphen) && index !== itemLength - 1) {
        const nextItem = items[index + 1];
        const nextSentenceWords = nextItem.str.split(' ')
        value.str = value.str.slice(0, value.str.length - 1) + nextSentenceWords[0]
        nextItem.str = nextSentenceWords.slice(1, nextSentenceWords.length).join(' ');
      }
      return value;
    });
    this.push({items: newItems});
    callback();
  }
}

module.exports = {
  Hyphenation
};
