const {Transform} = require('stream');
const AWS = require('aws-sdk');

const polly = new AWS.Polly({apiVersion: '2016-06-10'});

function synthesizeSpeech(text, voiceId) {
  return new Promise((resolve, reject) => {
    const params = {
      OutputFormat: 'mp3',
      Text: text,
      VoiceId: voiceId,
      TextType: 'text'
    };
    polly.synthesizeSpeech(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

class PollySpeechSynthesisStream extends Transform {
  constructor(options) {
    super();
    this.voiceId = options.voiceId;
  }

  _transform(data, encoding, callback) {
    if (Buffer.isBuffer(data)) {
      data = data.toString();
    }
    const requestCharacters = data.length;
    synthesizeSpeech(data, this.voiceId).then((result) => {
      if (result.RequestCharacters != requestCharacters) {
        console.warn(`Only ${result.RequestCharacters} characters were synthesized. Excepted ${requestCharacters}.`);
      }
      this.push(result.AudioStream);
      callback();
    }).catch((error) => {
      callback(error);
    });
  }
}

module.exports = {
  PollySpeechSynthesisStream
};
