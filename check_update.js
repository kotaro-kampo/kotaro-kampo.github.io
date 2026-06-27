const fs = require('fs');
const code = fs.readFileSync('scripts/update-data.js', 'utf8');
const idx = code.indexOf('matchKey === "ヨクイニンs"');
console.log(code.substring(idx - 100, idx + 100));
