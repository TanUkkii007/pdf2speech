const {Transform} = require('stream');

class Replace extends Transform {

  constructor(options) {
    super({writableObjectMode: true, readableObjectMode: true});
    options = options || {};
    this.replacements = options.replacements || {};
  }

  _transform(data, encoding, callback) {
    const replacements = this.replacements[data.pageNumber];
    if (replacements) {
      const newItems = data.items.map((item) => {
        const newStr = replacements.reduce((acc, v) => {
          return acc.replace(v.from, v.to);
        }, item.str);
        return Object.assign(item, {str: newStr});
      });
      this.push(Object.assign(data, {items: newItems}));
      callback();
    } else {
      this.push(data);
      callback();
    }
  }
}

module.exports = {
  Replace
};
