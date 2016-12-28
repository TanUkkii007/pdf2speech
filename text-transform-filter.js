const {Transform} = require('stream');

class TextTransformFilter extends Transform {

  constructor(options) {
    super({writableObjectMode: true, readableObjectMode: true});
    options = options || {};
    /* @typedef {Object} FilterOp
     * @property {number} index
     * @property {string} op
     * @property {number} value
     */
    this.filterOps = options.filterOps || [];
  }

  _transform(data, encoding, callback) {
    if (this.filterOps.length > 0) {
      const filteredItems = data.items.filter((item) => {
        const transform = item.transform;
        return this.filterOps.every((op) => {
          return this.compare(transform, op);
        });
      });
      this.push({items: filteredItems});
    } else {
      this.push(data);
    }
    callback();
  }

  compare(transform, comparator) {
    switch (comparator.op) {
      case '<':
        return transform[comparator.index] < comparator.value;
        break;
      case '<=':
        return transform[comparator.index] <= comparator.value;
        break;
      case '>':
      console.log(`${transform[comparator.index]} > ${comparator.value} = ${transform[comparator.index] > comparator.value}`);
        return transform[comparator.index] > comparator.value;
        break;
      case '>=':
        return transform[comparator.index] >= comparator.value;
        break;
      default:
        throw new Exception(`invalid operator ${comparator.op}`);
    }
  }
}

module.exports = {
  TextTransformFilter
};
