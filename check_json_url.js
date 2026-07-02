const js = require('fs').readFileSync('js/index-D5iRUZS0.js', 'utf8');
const match = js.match(/fetch\(['"]([^'"]*\.json)['"]/);
console.log(match ? match[1] : 'Not found');
