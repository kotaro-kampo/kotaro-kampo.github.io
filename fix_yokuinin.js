const fs = require('fs');
let code = fs.readFileSync('scripts/update-data.js', 'utf8');
code = code.replace(/if \(name\.includes\("ヨクイニンS"\)\) cat = "kyoryokukai";\s*map\[U0\(xA\(name\)\)\] = cat;/g, 'const key = U0(xA(name));\n                if (key === "ヨクイニンs") cat = "kyoryokukai";\n                map[key] = cat;');
fs.writeFileSync('scripts/update-data.js', code);

const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
data.data.forEach(x => {
    if (x.name.includes('ヨクイニンS')) {
        x.otcCategory = 'kyoryokukai';
    }
});
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
console.log('Fixed Yokuinin in data.json and update-data.js');
