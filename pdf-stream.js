const Readable = require('stream').Readable;

require('pdfjs-dist');

class PdfTextContentStream extends Readable {
  constructor(options) {
    super({objectMode: true});
    this._initialized = false;
    this.source = options.source;
    this._currentPage = options.startPage || 1;
    this.stopPage = options.stopPage;
    this.stopLine = options.stopLine;
  }

  _read(size) {
    if (!this._initialized) {
      this._initialize();
    } else {
      this._readPage();
    }
  }

  _initialize() {
    PDFJS.getDocument(this.source).then((pdfDocument) => {
      this._pdfDocument = pdfDocument;
      if (!this.stopPage || this.stopPage > pdfDocument.numPages) {
        this.stopPage = pdfDocument.numPages;
      }
      this._initialized = true;
      this._readPage();
    });
  }

  _readPage() {
    const pdfDocument = this._pdfDocument;
    if (this._currentPage > this.stopPage) {
      this.push(null);
    } else {
      pdfDocument.getPage(this._currentPage).then((page) => {
        return page.getTextContent().then((content) => {
          this._currentPage++;
          if (content.items.length === 0) {
            this._readPage();
          } else if (this._currentPage - 1 === this.stopPage && this.stopLine) {
            const newItems = content.items.filter((line, index) => {
              return index + 1 <= this.stopLine;
            });
            const copy = Object.assign({}, content, {items: newItems});
            this.push(copy);
          } else {
            this.push(content);
          }
        });
      }).catch((error) => {
        process.nextTick(() => this.emit('error', error));
      });
    }
  }
}

module.exports = {
  PdfTextContentStream: PdfTextContentStream
};
