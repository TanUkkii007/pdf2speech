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
const Replace = require('../replace').Replace;
const PageBoundarySentencesConcat = require('../page-boundary-sentences-concat').PageBoundarySentencesConcat;

const pdfPath = process.argv[2];
const data = new Uint8Array(fs.readFileSync(pdfPath));

function insertPredicate(item) {
  return item.transform[0] === 11.9552 ||
    item.transform[0] === 13.9477;
}

const replaceOption = {
  21: [
    {from: 'Iamputtingmyselftothefullestpossibleuse,whichisallIthinkthatany', to: 'I am putting myself to the fullest possible use, which is all I think that any'},
    {from: 'Asimple,concreteexampleofanAPIisalsogiventoillustratethenotationand', to: 'A simple, concrete example of an API is also given to illustrate the notation and'}
  ],
  22: [
    {from: 'Theclientsandtheservercommunicatebyexchangingmessages', to: 'The clients and the server communicate by exchanging messages,'}
  ],
  23: [
    {from: 'Inthisbookwewillusemainlytwo', to: 'In this book we will use mainly two'},
    {from: 'a process may also represent a trus', to: 'a process may also represent a trus-'},
    {from: 'tdomain,aprincipal,oroneadministra', to: 't domain, a principal, or one administra'},
    {from: 'totheAdvanced', to: 'to the Advanced'},
    {from: 'For instance, the processe', to: 'For instance, the processe-'},
    {from: 'smayneedtoagreeonwhethera', to: 's may need to agree on whether a'}
  ]
};

const chapter1 = {
  startPage: 21,
  stopPage: 38
};

const pdfText = new PdfTextContentStream(Object.assign({source: data}, chapter1));

pdfText
  .pipe(new TextTransformFilter({filterOps: [{index: 5, op: '<', value: 623}, {index: 5, op: '>', value: 51}]}))
  .pipe(new Replace({replacements: replaceOption}))
  .pipe(new PageBoundarySentencesConcat())
  .pipe(new Hyphenation({hyphen: '-'}))
  .pipe(new InsertAfter({insertCharacter: '.\n', predicate: insertPredicate}))
  .pipe(new LineConcat())
  .pipe(process.stdout);
// pdfText
//   .pipe(new TextTransformFilter({filterOps: [{index: 5, op: '<', value: 623}, {index: 5, op: '>', value: 51}]}))
//   .pipe(new PageBoundarySentencesConcat())
//   .pipe(new Hyphenation({hyphen: '-'}))
//   .pipe(new InsertAfter({insertCharacter: '.\n', predicate: insertPredicate}))
//   .pipe(new WordCountLimit({limit: 1500}))
//   .pipe(new LineConcat())
//   .pipe(new PollySpeechSynthesisStream({voiceId: 'Joanna'}))
//   .pipe(new PagenatedFiles({dirname: 'Reliable_and_secure_distributed_programming', prefix: 'ch01'}));
