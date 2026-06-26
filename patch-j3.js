const fs = require('fs');
let code = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');

const newPatch = `await fetch("data.json?t=" + Date.now()).then(r=>r.json()).then(d=>{
    d.data.forEach(item => {
        if(typeof U0 === 'function') {
            item.name = U0(item.rawName);
        }
        if(typeof L0 === 'function') {
            item.sortKey = L0(item.sortKey);
        }
        
        if (item.ingredients) {
            item.ingredients.forEach(ing => {
                const n = ing.name || "";
                ing.isExtract = n.includes("エキス") || n.includes("水製");
                const m = (ing.amountStr || "").match(/([\\d.]+)/);
                if (m) ing.amount = parseFloat(m[1]);
                else ing.amount = 0;
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
        
        // Populate the detail map for search functionality!
        if (typeof cn !== 'undefined' && cn && typeof cn.set === 'function') {
            cn.set(item.url, item);
        }
    });
    window.keggChanges=d.changes;
    window.keggData=d.data;
    return d.data;
})`;

code = code.replace(/await fetch\("data\.json\?t="\s*\+\s*Date\.now\(\)\)\.then\(r=>r\.json\(\)\)\.then\(d=>\{[\s\S]*?return d\.data;\}\)/g, newPatch);

fs.writeFileSync('js/index-D5iRUZS0.js', code);
console.log('Patched J() again to include cn.set() for search functionality');
