const fs = require('fs');

let js = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');

// Replace the fallback scraper logic
js = js.replace(/function Sy\(n\)\{if\(n\.includes\("ヨクイニンS"\)\)return "visual";/g, 'function Sy(n){if(n.includes("ヨクイニンS"))return "kyoryokukai_visual";');

// 1. DrugDetail component variable 'y'
js = js.replace(/n\.otcCategory==="visual"\?"ビジュアル"/g, 'n.otcCategory==="kyoryokukai_visual"?"協力会 / ビジュアル":n.otcCategory==="visual"?"ビジュアル"');

// 2. DrugCompare texts
js = js.replace(/w\.otcCategory==="visual"\?"ビジュアル"/g, 'w.otcCategory==="kyoryokukai_visual"?"協力会 / ビジュアル":w.otcCategory==="visual"?"ビジュアル"');

// 3. DrugCompare background colors
js = js.replace(/w\.otcCategory==="visual"\?"bg-purple-50/g, 'w.otcCategory==="kyoryokukai_visual"?"bg-gradient-to-r from-amber-50 to-purple-50 text-purple-700 border border-purple-200":w.otcCategory==="visual"?"bg-purple-50');

// 4. Home page text
js = js.replace(/le\.otcCategory==="visual"\?"ビジュアル"/g, 'le.otcCategory==="kyoryokukai_visual"?"協力会 / ビジュアル":le.otcCategory==="visual"?"ビジュアル"');

fs.writeFileSync('js/index-D5iRUZS0.js', js);
console.log('Fixed js without syntax error');
