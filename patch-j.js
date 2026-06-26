const fs = require('fs');
let code = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');

// The current fetch patch is:
// await fetch("data.json?t=" + Date.now()).then(r=>r.json()).then(d=>{window.keggChanges=d.changes;window.keggData=d.data;return d.data;})
// We will replace it with one that also fixes the missing Kanji names and isExtract flags!

const newPatch = `await fetch("data.json?t=" + Date.now()).then(r=>r.json()).then(d=>{
    d.data.forEach(item => {
        // Restore Kanji names for search support
        if(typeof U0 === 'function') {
            item.name = U0(item.rawName);
        }
        
        // Restore isExtract and amount for detail screen
        if (item.ingredients) {
            item.ingredients.forEach(ing => {
                const n = ing.name || "";
                ing.isExtract = n.includes("エキス") || n.includes("水製");
                const m = (ing.amountStr || "").match(/([\\d.]+)/);
                if (m) {
                    ing.amount = parseFloat(m[1]);
                } else {
                    ing.amount = 0;
                }
            });
        }
        if (item.components) {
            item.components.forEach(comp => {
                const n = comp.name || "";
                comp.isExtract = n.includes("エキス") || n.includes("水製");
                const m = (comp.amountStr || "").match(/([\\d.]+)/);
                if (m) comp.amount = parseFloat(m[1]);
                else comp.amount = 0;
            });
        }
    });
    window.keggChanges=d.changes;
    window.keggData=d.data;
    return d.data;
})`;

code = code.replace(/await fetch\("data\.json\?t="\s*\+\s*Date\.now\(\)\)\.then\(r=>r\.json\(\)\)\.then\(d=>\{window\.keggChanges=d\.changes;window\.keggData=d\.data;return d\.data;\}\)/g, newPatch);

fs.writeFileSync('js/index-D5iRUZS0.js', code);
console.log('Patched J() to restore Kanji names and ingredient flags');
