const fs = require('fs');

// 1. Update data.json
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
data.data.forEach(x => {
    if (x.name.includes('ヨクイニンS')) {
        x.otcCategory = 'visual';
    }
});
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

// 2. Update scripts/update-data.js
let updateJs = fs.readFileSync('scripts/update-data.js', 'utf8');
updateJs = updateJs.replace(/cat = "kyoryokukai";/g, 'cat = "visual";');
fs.writeFileSync('scripts/update-data.js', updateJs);

// 3. Update js/index-D5iRUZS0.js
let frontendJs = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');
frontendJs = frontendJs.replace(/return "kyoryokukai";/g, 'return "visual";');
// Let's also bump the service worker cache version to v14 just to be absolutely sure
let sw = fs.readFileSync('service-worker.js', 'utf8');
sw = sw.replace(/kotaro-kampo-cache-v\d+/g, 'kotaro-kampo-cache-v14');
fs.writeFileSync('service-worker.js', sw);

fs.writeFileSync('js/index-D5iRUZS0.js', frontendJs);
console.log('Fixed Yokuinin S to visual everywhere');
