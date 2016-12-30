const {Transform} = require('stream');

class InsertAfter extends Transform {

  constructor(options) {
    super({writableObjectMode: true, readableObjectMode: true});
    options = options || {};
    this.predicate = options.predicate || function(){};
    this.insertCharacter = options.insertCharacter || '';
  }

  _transform(data, encoding, callback) {
    var prevTitleLine = null;
    data.items.forEach((item) => {
      if (this.predicate(item)) {
        prevTitleLine = item;
      } else if (prevTitleLine) {
        prevTitleLine.str = prevTitleLine.str + this.insertCharacter;
        prevTitleLine = null;
      }
    });
    this.push(data);
    callback();
  }

}

module.exports = {
  InsertAfter
};
