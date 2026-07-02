const fs = require('fs');

// 1. Fix update-data.js
let update = fs.readFileSync('scripts/update-data.js', 'utf8');
const oldSection = `            const matchKey = U0(xA(x));
            let B = badgeMap[matchKey] || "other";
            
            allItems.push({ name: N, rawName: x, url: w, type: "otc", otcCategory: B, subCategory: C, sortKey: sortKey });
            
            if (matchKey.includes("茵陳五苓散エキス細粒g")) { B = "sajikurabu"; }
            if (matchKey === "ヨクイニンs") {
                allItems.push({ name: N, rawName: x, url: w, type: "otc", otcCategory: "visual", subCategory: C, sortKey: sortKey });
            }`;
const newSection = `            const matchKey = U0(xA(x));
            let B = badgeMap[matchKey] || "other";
            
            if (matchKey.includes("茵陳五苓散エキス細粒g")) B = "sajikurabu";
            if (matchKey.includes("隆持源")) B = "kyoryokukai";
            
            allItems.push({ name: N, rawName: x, url: w, type: "otc", otcCategory: B, subCategory: C, sortKey: sortKey });
            
            if (matchKey === "ヨクイニンs" || matchKey.includes("疎経活血湯エキス細粒g")) {
                allItems.push({ name: N, rawName: x, url: w, type: "otc", otcCategory: "visual", subCategory: C, sortKey: sortKey });
            }`;

if (update.includes(oldSection)) {
    update = update.replace(oldSection, newSection);
    fs.writeFileSync('scripts/update-data.js', update);
} else {
    console.log("oldSection not found in update-data.js");
}

// 2. Fix data.json manually so it's immediate
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

let sokeikakketsutoCopy = null;

data.data.forEach(x => {
    if (x.name && x.name.includes('茵陳五苓散エキス細粒G')) {
        x.otcCategory = 'sajikurabu';
    }
    if (x.name && x.name.includes('隆持源')) {
        x.otcCategory = 'kyoryokukai';
    }
    if (x.name && x.name.includes('疎経活血湯エキス細粒G')) {
        // Change existing to sajikurabu if not visual
        if (x.otcCategory !== 'visual') {
            x.otcCategory = 'sajikurabu';
            sokeikakketsutoCopy = JSON.parse(JSON.stringify(x));
            sokeikakketsutoCopy.otcCategory = 'visual';
        }
    }
});

if (sokeikakketsutoCopy) {
    // avoid duplicates
    const existingVisual = data.data.find(x => x.name && x.name.includes('疎経活血湯エキス細粒G') && x.otcCategory === 'visual');
    if (!existingVisual) {
        data.data.push(sokeikakketsutoCopy);
    }
}

// Re-sort data.json by sortKey to keep it clean
data.data.sort((a, b) => a.sortKey.localeCompare(b.sortKey, "ja"));

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

// 3. Bump SW
let sw = fs.readFileSync('service-worker.js', 'utf8');
sw = sw.replace(/kotaro-kampo-cache-v\d+/, 'kotaro-kampo-cache-v20');
fs.writeFileSync('service-worker.js', sw);

console.log("Fixed badges and bumped SW");
