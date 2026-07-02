const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

let added = false;
const sokei = data.data.filter(x => x.name.includes('疎経活血湯エキス細粒G'));
if (sokei.length === 1) {
    const existing = sokei[0];
    const copy = JSON.parse(JSON.stringify(existing));
    if (existing.otcCategory === 'visual') {
        copy.otcCategory = 'sajikurabu';
    } else {
        copy.otcCategory = 'visual';
        existing.otcCategory = 'sajikurabu';
    }
    data.data.push(copy);
    added = true;
}

if (added) {
    data.data.sort((a, b) => a.sortKey.localeCompare(b.sortKey, "ja"));
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    console.log("Added missing Sokeikakketsuto");
} else {
    console.log("Both already exist or none found");
}
