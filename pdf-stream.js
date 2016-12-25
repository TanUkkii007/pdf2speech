const Readable = require('stream').Readable;

require('pdfjs-dist');

class PdfTextContentStream extends Readable {
  constructor(options) {
    super();
    this._initialized = false;
    this.source = options.source;
    this._currentPage = options.startPage || 1;
    this.stopPage = options.stopPage;
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
          const strings = content.items.map((item) => {
            return item.str;
          });
          this._currentPage++;
          if (strings.length === 0) {
            this._readPage();
          } else {
            this.push(strings.join(' '));
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
