const fs = require('fs');
const dir = 'node_modules/pdfjs-dist/es5/build/pdf.js';
const content = fs.readFileSync(dir, { encoding: 'utf-8' });
fs.writeFileSync(dir, content.replace('"./pdf.worker.js";', `__dirname + "/pdf.worker.js";`))