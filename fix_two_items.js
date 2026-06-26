const fs = require('fs');

// 1. Revert fallback scraper in index-D5iRUZS0.js to return kyoryokukai
let js = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');
js = js.replace(/function Sy\(n\)\{if\(n\.includes\("ヨクイニンS"\)\)return "visual";/g, 'function Sy(n){if(n.includes("ヨクイニンS"))return "kyoryokukai";');
fs.writeFileSync('js/index-D5iRUZS0.js', js);

// 2. Bump service worker
let sw = fs.readFileSync('service-worker.js', 'utf8');
sw = sw.replace(/kotaro-kampo-cache-v\d+/g, 'kotaro-kampo-cache-v16');
fs.writeFileSync('service-worker.js', sw);

// 3. Update update-data.js so it creates TWO items for Yokuinin S
let update = fs.readFileSync('scripts/update-data.js', 'utf8');
// Currently update-data.js sets: map[key] = cat;
update = update.replace(/const key = U0\(xA\(name\)\);\s*if \(key === "ヨクイニンs"\) cat = "kyoryokukai_visual";\s*map\[key\] = cat;/g, 'const key = U0(xA(name));\n                if (key === "ヨクイニンs") cat = "kyoryokukai";\n                map[key] = cat;');
fs.writeFileSync('scripts/update-data.js', update);

// 4. Update data.json to duplicate Yokuinin S
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const newItems = [];
data.data.forEach(x => {
    if (x.name.includes('ヨクイニンS')) {
        x.otcCategory = 'kyoryokukai';
        // Duplicate
        const duplicate = JSON.parse(JSON.stringify(x));
        duplicate.otcCategory = 'visual';
        newItems.push(duplicate);
    }
});
data.data = data.data.concat(newItems);
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

console.log('Fixed to two items');
