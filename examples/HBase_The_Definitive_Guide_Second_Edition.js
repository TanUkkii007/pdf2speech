const fs = require('fs');
const util = require('util');
const AWS = require('aws-sdk');

require('pdfjs-dist');

AWS.config.update({region: 'us-east-1'});

const PdfTextContentStream = require('../pdf-stream').PdfTextContentStream;
const PollySpeechSynthesisStream = require('../aws-polly').PollySpeechSynthesisStream;
const LineConcat = require('../lineconcat').LineConcat;
const PagenatedFiles = require('../pagenated-files').PagenatedFiles;
const WordCountLimit = require('../word-count-limit').WordCountLimit;
const TextTransformFilter = require('../text-transform-filter').TextTransformFilter;
const ItemFilter = require('../item-filter').ItemFilter;
const Hyphenation = require('../hyphenation').Hyphenation;
const InsertAfter = require('../insert-after').InsertAfter;
const PageBoundarySentencesConcat = require('../page-boundary-sentences-concat').PageBoundarySentencesConcat;

const pdfPath = process.argv[2];
const data = new Uint8Array(fs.readFileSync(pdfPath));

function insertPredicate(item) {
  return item.fontName === 'g_d0_f3' &&
    (item.transform[0] === 11.56 ||
     item.transform[0] === 18.92 ||
     item.transform[0] === 16.82 ||
     item.transform[0] === 15.77 ||
     item.transform[0] === 25.22);
}

function codeFilterPredicate(item) {
  return !(item.transform[0] === 8.5 || item.transform[0] === 8.925);
}

const chapter8 = {
  startPage: 631,
  stopPage: 721
};

const pdfText = new PdfTextContentStream(Object.assign({source: data}, chapter8));

// pdfText
//   .pipe(new TextTransformFilter({filterOps: [{index: 5, op: '>', value: 43}]}))
//   .pipe(new ItemFilter({predicate: codeFilterPredicate}))
//   .pipe(new PageBoundarySentencesConcat())
//   .pipe(new Hyphenation())
//   .pipe(new InsertAfter({insertCharacter: '.\n', predicate: insertPredicate}))
//   .pipe(new LineConcat())
//   .pipe(process.stdout);
pdfText
  .pipe(new TextTransformFilter({filterOps: [{index: 5, op: '>', value: 43}]}))
  .pipe(new ItemFilter({predicate: codeFilterPredicate}))
  .pipe(new PageBoundarySentencesConcat())
  .pipe(new Hyphenation())
  .pipe(new InsertAfter({insertCharacter: '.\n', predicate: insertPredicate}))
  .pipe(new WordCountLimit({limit: 1500}))
  .pipe(new LineConcat())
  .pipe(new PollySpeechSynthesisStream({voiceId: 'Joanna'}))
  .pipe(new PagenatedFiles({dirname: 'HBase_The_Definitive_Guide_Second_Edition', prefix: 'ch08'}));
