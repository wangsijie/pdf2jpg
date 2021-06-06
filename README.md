# PDF2JPG

Convert PDF pages to a single jpg by using pdf.js and node-canvas.

## Online demo

https://pdf2jpg.sijie.wang/?url={url_for_pdf_file}

e.g. https://pdf2jpg.sijie.wang/?url=https://pdf2jpg.sijie.wang/sample.pdf

## Installation

Require canvas, see [https://github.com/Automattic/node-canvas](https://github.com/Automattic/node-canvas) for installation guide.

In most systems, this can be done by the single command:

```sh
npm i pdf2jpg
```

## Usage

```js
const pdf2jpg = require('pdf2jpg');
const fs = require('fs');

const source = fs.readFileSync('test.pdf'); // can be buffer or just url
pdf2jpg(source).then(buffer => fs.writeFileSync('out.jpg', buffer))
// page 1 only (starts from 1)
pdf2jpg(source, { page: 1 }).then(buffer => fs.writeFileSync('out-page-1.jpg', buffer))
```

## Development

```
docker build -t pdf2jpg .
docker run -it -v $(pwd):/app pdf2jpg
```

## Thanks to

[https://github.com/mozilla/pdf.js/blob/master/examples/node/pdf2png/pdf2png.js](https://github.com/mozilla/pdf.js/blob/master/examples/node/pdf2png/pdf2png.js)

[https://gist.github.com/jdeng/cbfad9cb21e452127c81](https://gist.github.com/jdeng/cbfad9cb21e452127c81)

[https://github.com/jwerre/node-canvas-lambda](https://github.com/jwerre/node-canvas-lambda)
