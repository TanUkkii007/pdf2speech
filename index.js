const fs = require('fs');
const util = require('util');
const AWS = require('aws-sdk');

require('pdfjs-dist');

AWS.config.update({region: 'us-east-1'});

const PdfTextContentStream = require('./pdf-stream').PdfTextContentStream;
const PollySpeechSynthesisStream = require('./aws-polly').PollySpeechSynthesisStream;
const LineConcat = require('./lineconcat').LineConcat;
const PagenatedFiles = require('./pagenated-files').PagenatedFiles;
const WordCountLimit = require('./word-count-limit').WordCountLimit;
const TextTransformFilter = require('./text-transform-filter').TextTransformFilter;
const Hyphenation = require('./hyphenation').Hyphenation;
const PageBoundarySentencesConcat = require('./page-boundary-sentences-concat').PageBoundarySentencesConcat;

const pdfPath = process.argv[2];
const data = new Uint8Array(fs.readFileSync(pdfPath));

const pdfText = new PdfTextContentStream({source: data, startPage: 7, stopPage: 10});

// pdfText
//   .pipe(new TextTransformFilter({filterOps: [{index: 5, op: '>', value: 43}]}))
//   .pipe(new PageBoundarySentencesConcat())
//   .pipe(new Hyphenation())
//   .pipe(new LineConcat())
//   .pipe(process.stdout);
pdfText
.pipe(new TextTransformFilter({filterOps: [{index: 5, op: '>', value: 43}]}))
  .pipe(new PageBoundarySentencesConcat())
  .pipe(new Hyphenation())
  .pipe(new WordCountLimit({limit: 1500}))
  .pipe(new LineConcat())
  .pipe(new PollySpeechSynthesisStream({voiceId: 'Joanna'}))
  .pipe(new PagenatedFiles({prefix: 'out'}));
