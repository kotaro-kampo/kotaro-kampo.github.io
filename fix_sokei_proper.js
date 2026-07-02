const fs = require('fs');

let update = fs.readFileSync('scripts/update-data.js', 'utf8');

const oldLogic = `            if (matchKey === "ヨクイニンs" || matchKey.includes("疎経活血湯エキス細粒g")) {
                allItems.push({ name: N, rawName: x, url: w, type: "otc", otcCategory: "visual", subCategory: C, sortKey: sortKey });
            }`;

const newLogic = `            if (matchKey === "ヨクイニンs") {
                allItems.push({ name: N, rawName: x, url: w, type: "otc", otcCategory: "visual", subCategory: C, sortKey: sortKey });
            } else if (matchKey.includes("疎経活血湯エキス細粒g")) {
                allItems.push({ name: N, rawName: x, url: w, type: "otc", otcCategory: "sajikurabu", subCategory: C, sortKey: sortKey });
            }`;

update = update.replace(oldLogic, newLogic);
fs.writeFileSync('scripts/update-data.js', update);

// Also fix data.json again just in case GitHub Actions ran and overwrote it
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// Remove ALL Sokeikakketsuto
const filteredData = data.data.filter(x => !x.name.includes('疎経活血湯エキス細粒G'));

// Add them back properly
const sokeiBase = data.data.find(x => x.name.includes('疎経活血湯エキス細粒G'));
if (sokeiBase) {
    const sokeiVisual = JSON.parse(JSON.stringify(sokeiBase));
    sokeiVisual.otcCategory = 'visual';
    const sokeiSaji = JSON.parse(JSON.stringify(sokeiBase));
    sokeiSaji.otcCategory = 'sajikurabu';
    
    filteredData.push(sokeiVisual);
    filteredData.push(sokeiSaji);
}

data.data = filteredData;
data.data.sort((a, b) => a.sortKey.localeCompare(b.sortKey, "ja"));

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

// Bump SW
let sw = fs.readFileSync('service-worker.js', 'utf8');
sw = sw.replace(/kotaro-kampo-cache-v\d+/, 'kotaro-kampo-cache-v22');
fs.writeFileSync('service-worker.js', sw);

console.log("Fixed Sokei duplication logic and bumped SW to v22");
