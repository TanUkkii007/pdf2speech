# pdf2speech

Don't miss learning opportunities. Life is too short.

`pdf2speech` converts PDF to mp3 audio with text-to-speech engine.
It allows you to read PDF books while you are walking.

# Status

Currently I am testing to convert [O'reilly](http://www.oreilly.com/) books to audio. `example.js` successfully converted "Database Reliability Engineering" book. I guess formats of the animal books of O'reilly are generally same so it works for the other books as well.

# Requirements

`pdf2speech` currently supports [AWS Polly](https://aws.amazon.com/polly/?nc2=h_a1) only as text-to-speech engine. Be sure to set up AWS credentials correctly.

`pdf2speech` uses Node.js and ES2016 syntax. Install Node.js with proper version.

# How to run examples

clone `pdf2speech`.

```
git clone git@github.com:TanUkkii007/pdf2speech.git
```

1. install dependencies

```
npm install
```

1. Run example with a PDF file path argument.

```
node example.js path/to/pdf
```

This command generates several mp3 files. To concatenate these files, run `cat` command.

```
cat out-*.mp3 > combined.mp3
```

# ToDo
- I think pdf2speech cannot be a general CLI tool. There are tons of different format of PDFs so programming is needed. Instead of provide general CLI, examples for specific books can be helpful.
- publish pdf-to-audio conversion process streams as library
- API refinement
- CMAP support
