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
const Hyphenation = require('../hyphenation').Hyphenation;
const InsertAfter = require('../insert-after').InsertAfter;
const PageBoundarySentencesConcat = require('../page-boundary-sentences-concat').PageBoundarySentencesConcat;

const pdfPath = process.argv[2];
const data = new Uint8Array(fs.readFileSync(pdfPath));

const chapters = [
  {startPage: 25, stopPage: 47, stopLine: 17},
  {startPage: 51, stopPage: 87},
  {startPage: 93, stopPage: 128, stopLine: 29},
  {startPage: 135, stopPage: 164, stopLine: 17},
  {startPage: 169, stopPage: 215, stopLine: 4},
  {startPage: 219, stopPage: 237, stopLine: 39},
  {startPage: 241, stopPage: 288},
  {startPage: 293, stopPage: 332},
  {startPage: 339, stopPage: 393},
  {startPage: 403, stopPage: 446},
  {startPage: 453, stopPage: 495},
  {startPage: 501, stopPage: 555}
];

function insertPredicate(item) {
  return item.fontName === 'g_d0_f1' || item.fontName === 'g_d0_f4';
}

chapters.forEach((chapter, index) => {
  const pdfText = new PdfTextContentStream({source: data, startPage: chapter.startPage, stopPage: chapter.stopPage, stopLine: chapter.stopLine});
  pdfText
    .pipe(new TextTransformFilter({filterOps: [{index: 5, op: '>', value: 43}]}))
    .pipe(new PageBoundarySentencesConcat())
    .pipe(new Hyphenation())
    .pipe(new InsertAfter({insertCharacter: '.\n', predicate: insertPredicate}))
    .pipe(new WordCountLimit({limit: 1500}))
    .pipe(new LineConcat())
    .pipe(new PollySpeechSynthesisStream({voiceId: 'Joanna'}))
    .pipe(new PagenatedFiles({dirname: `Designing_Data_Intensive_Applications/ch${index + 1}`, prefix: `ch${index + 1}`}));
});
