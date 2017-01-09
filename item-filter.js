const {Transform} = require('stream');

class ItemFilter extends Transform {

  constructor(options) {
    super({writableObjectMode: true, readableObjectMode: true});
    options = options || {};
    this.predicate = options.predicate || function() {};
  }

  _transform(data, encoding, callback) {
    const filteredItems = data.items.filter((item) => {
      return this.predicate(item);
    });
    data.items = filteredItems;
    this.push(Object.assign(data, {items: filteredItems}));
    callback();
  }
}

module.exports = {
  ItemFilter
};
