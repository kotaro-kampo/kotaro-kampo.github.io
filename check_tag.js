const fs = require('fs');
const js = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');
const idx = js.indexOf('"aria-label":"戻る"');
console.log(js.substring(idx - 300, idx + 50));
