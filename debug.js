const fs = require('fs');
const app = require('./index.js');

app(fs.readFileSync('test.pdf')).then(buffer => fs.writeFileSync('out.jpg', buffer))
