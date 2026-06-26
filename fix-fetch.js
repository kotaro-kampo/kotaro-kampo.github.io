const fs=require('fs');
let code=fs.readFileSync('js/index-D5iRUZS0.js','utf8');

// The current bad patch looks like:
// await fetch("data.json?t=" + Date.now(), {cache: "no-store"}).then(r=>r.json()).then(async d=>{if(d&&d.data&&d.data.length>0){window.keggChanges=d.changes;return d.data;}else{return await yf();}}).catch(async()=>await yf())
// We replace it entirely:
const oldPatchRegex = /await fetch\("data\.json[^)]+\)[^;]+\.catch\(async\(\)=>await yf\(\)\)/g;
code = code.replace(oldPatchRegex, 'await fetch("data.json?t=" + Date.now()).then(r=>r.json()).then(d=>{window.keggChanges=d.changes;return d.data;})');

// And if there are any remaining `await yf()` from other places, replace them too.
code = code.replace(/await yf\(\)/g, 'await fetch("data.json?t=" + Date.now()).then(r=>r.json()).then(d=>{window.keggChanges=d.changes;return d.data;})');

fs.writeFileSync('js/index-D5iRUZS0.js', code);
console.log('Replaced yf() completely');
