const fs = require('fs');
const util = require('util');
const AWS = require('aws-sdk');

require('pdfjs-dist');

AWS.config.update({region: 'us-east-1'});

const PdfTextContentStream = require('./pdf-stream').PdfTextContentStream;
const PollySpeechSynthesisStream = require('./aws-polly').PollySpeechSynthesisStream;
const LineConcat = require('./lineconcat').LineConcat;
const PagenatedFiles = require('./pagenated-files').PagenatedFiles;

const pdfPath = process.argv[2];
const data = new Uint8Array(fs.readFileSync(pdfPath));

const pdfText = new PdfTextContentStream({source: data, startPage: 7, stopPage: 9});

//pdfText.pipe(new LineConcat()).pipe(process.stdout);
pdfText
  .pipe(new LineConcat())
  .pipe(new PollySpeechSynthesisStream({voiceId: 'Joanna'}))
  .pipe(new PagenatedFiles({prefix: 'out'}));
