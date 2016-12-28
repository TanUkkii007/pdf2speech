const {Transform} = require('stream');

class LineConcat extends Transform {
  constructor(options) {
    super({writableObjectMode: true});
    options = options || {};
    this.separator = options.separator || ' ';
  }

  _transform(data, encoding, callback) {
    const strings = data.items.map((item) => {
      return item.str;
    });
    console.log(strings.join(this.separator));
    this.push(strings.join(this.separator));
    callback();
  }
}

module.exports = {LineConcat};
