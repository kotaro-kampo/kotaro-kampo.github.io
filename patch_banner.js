const fs = require('fs');
let code = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');

const target = `window.__bgSyncStarted=!0;(async()=>{let total=n.length,fetched=0;for(let y of n)cn.has(y.url)&&fetched++;`;
const replacement = `window.__bgSyncStarted=!0;for(let y of n)if(!cn.has(y.url)&&y.ingredients)cn.set(y.url,y);(async()=>{let total=n.length,fetched=0;for(let y of n)cn.has(y.url)&&fetched++;`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('js/index-D5iRUZS0.js', code);
    
    // Bump SW
    let sw = fs.readFileSync('service-worker.js', 'utf8');
    sw = sw.replace(/kotaro-kampo-cache-v\d+/, 'kotaro-kampo-cache-v24');
    fs.writeFileSync('service-worker.js', sw);
    
    console.log("Patched banner logic and bumped SW to v24");
} else {
    console.log("Target not found!");
}
