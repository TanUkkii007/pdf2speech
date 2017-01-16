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
  ],
  24: [
    {from: 'Unless this reliability property is given fo', to: 'Unless this reliability property is given for'},
    {from: 'rfreebytheunderlyi', to: 'free by the underlyi-'}
  ],
  25: [
    {from: 'aconsistentviewoftherunningtransactionsandcanmakeconsistentdecisionson', to: 'a consistent view of the running transactions and can make consistent decisions on'}
  ],
  26: [
    {from: 'Alarge-capacitystoragesystemdistributesdataovermany', to: 'A large-capacity storage system distributes data over many'},
    {from: 'whichisapowerful', to: 'which is a powerful'}
  ],
  27: [
    {from: ':theprocessesneedtoagreehereonthesequenceofmessagesthey', to: ': the processes need to agree here on the sequence of messages they'},
    {from: 'Faced with performance constraints, th', to: 'Faced with performance constraints, th-'},
    {from: 'eapplicationdesignermaybedrivento', to: 'e application designer may be driven to'},
    {from: 'awell-definedinterface.Theapproachcanbefurthersupportedbyasuperficial', to: 'a well-defined interface. The approach can be further supported by a superficial'},
    {from: 'lem. This is particularly true because of th', to: 'lem. This is particularly true because of th-'},
    {from: 'evarietyofdistributedsystemmodels.', to: 'e variety of distributed system models.'}
  ],
  28: [
    {from: 'anewonewithpedagogicalpurposesinmind.', to: 'a new one with pedagogical purposes in mind.'},
    {from: 'ASimpleExample.', to: 'A Simple Example.'}
  ],
  29: [
    {from: ',asillustratedinFig.', to: ', as illustratedin Fig.'},
    {from: '.Agivenabstractionistypicallymaterializedby', to: '. A given abstraction is typically materialized by'},
    {from: 'asetofcomponents,eachrunningataprocess.', to: 'a set of components, each running at a process.'},
    {from: '.Eventsaredenotedby', to: '. Events are denoted by'},
    {from: '.Oftenanevent', to: '. Often an event'},
    {from: ',we,therefore,usuallywrite:', to: ', we, therefore, usually write:'},
    {from: ',whichdescribestheevent,followedbypseudo', to: ', which describes the event, followed by pseudo'}
  ],
  30: [
    {from: 'is correct (unless the destination modul', to: 'is correct (unless the destination modul-'},
    {from: 'eexplicitlyfilterstheevent;seethe', to: 'e explicitly filters the event; see the such that'},
    {from: 'must be ready to handle both membershi', to: 'must be ready to handle both membershi-'},
    {from: 'pchangesandreceptionofmessagesat', to: 'changes and reception of messages at'},
    {from: 'when some condition in the implementatio', to: 'when some condition in the implementatio-'},
    {from: 'nbecomestrue,butdonotrespondtoan', to: 'n becomes true, but do not respond to an'}
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
