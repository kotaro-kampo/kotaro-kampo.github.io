const fs = require('fs');
let code = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');

const cleanPatch = `await fetch("data.json?t=" + Date.now()).then(r=>r.json()).then(d=>{
    // Only populate the search index (cn)
    d.data.forEach(item => {
        if (typeof cn !== 'undefined' && cn && typeof cn.set === 'function') {
            cn.set(item.url, item);
        }
    });
    window.keggChanges=d.changes;
    window.keggData=d.data;
    return d.data;
})`;

code = code.replace(/await fetch\("data\.json\?t="\s*\+\s*Date\.now\(\)\)\.then\(r=>r\.json\(\)\)\.then\(d=>\{[\s\S]*?return d\.data;\}\)/g, cleanPatch);

fs.writeFileSync('js/index-D5iRUZS0.js', code);
console.log('Cleaned up J() patch to only populate cn Map');
