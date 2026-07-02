const js = require('fs').readFileSync('js/index-D5iRUZS0.js', 'utf8');
const matches = [...js.matchAll(/fetch\(([^)]+)\)/g)];
console.log(matches.map(m => m[1]).join('\n'));
