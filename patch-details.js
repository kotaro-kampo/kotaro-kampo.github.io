const fs = require('fs');
let code = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');

// 1. Ensure window.keggData is populated during fetch
code = code.replace(/window\.keggChanges=d\.changes;return d\.data;/g, 'window.keggChanges=d.changes; window.keggData=d.data; return d.data;');

// 2. Patch AA (OTC detail fetcher) to use window.keggData
code = code.replace(/async function AA\(n\)\{/g, 'async function AA(n){ if(window.keggData){ const item = window.keggData.find(x => x.url === n); if(item) return item; } ');

// 3. Patch jA (Medical detail fetcher) to use window.keggData
code = code.replace(/async function jA\(n\)\{/g, 'async function jA(n){ if(window.keggData){ const item = window.keggData.find(x => x.url === n); if(item) return item; } ');

fs.writeFileSync('js/index-D5iRUZS0.js', code);
console.log('Patched detail fetchers to use window.keggData');
