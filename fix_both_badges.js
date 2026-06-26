const fs = require('fs');

// 1. Add CSS class
let css = fs.readFileSync('css/index-BjDnIrd6.css', 'utf8');
if (!css.includes('.badge-kyoryokukai_visual')) {
    css += '.badge-kyoryokukai_visual{color:#3b2e6a;background:linear-gradient(90deg, #ffe6d3 0%, #e7e4ff 100%);border:1px solid #d3d3d3;}';
    fs.writeFileSync('css/index-BjDnIrd6.css', css);
}

// 2. Update frontend JS
let js = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');

// Replace texts
js = js.replace(/===\"kyoryokukai\"\?\"協力会\"/g, '==="kyoryokukai_visual"?"協力会 / ビジュアル":$&');
js = js.replace(/===\"kyoryokukai\"\?\"bg-amber-50 text-amber-700 border border-amber-200\"/g, '==="kyoryokukai_visual"?"bg-gradient-to-r from-amber-50 to-purple-50 text-purple-700 border border-purple-200":$&');

// Also update the fallback scraper Sy function
js = js.replace(/function Sy\(n\)\{if\(n\.includes\(\"ヨクイニンS\"\)\)return \"visual\";/g, 'function Sy(n){if(n.includes("ヨクイニンS"))return "kyoryokukai_visual";');

// Bump service worker
let sw = fs.readFileSync('service-worker.js', 'utf8');
sw = sw.replace(/kotaro-kampo-cache-v\d+/g, 'kotaro-kampo-cache-v15');
fs.writeFileSync('service-worker.js', sw);

fs.writeFileSync('js/index-D5iRUZS0.js', js);

// 3. Update update-data.js
let update = fs.readFileSync('scripts/update-data.js', 'utf8');
update = update.replace(/cat = "visual";/g, 'cat = "kyoryokukai_visual";');
fs.writeFileSync('scripts/update-data.js', update);

// 4. Update data.json
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
data.data.forEach(x => {
    if (x.name.includes('ヨクイニンS')) {
        x.otcCategory = 'kyoryokukai_visual';
    }
});
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

console.log('Fixed both badges');
