const fs = require('fs');
const js = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');
const match = js.match(/.{0,50}aria-label":"戻る".{0,50}/);
console.log(match ? match[0] : 'Not found');
