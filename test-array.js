const fs=require('fs'); 
const t=fs.readFileSync('js/index-D5iRUZS0.js','utf8'); 
const idx=t.indexOf('[{name:"アンチュンN'); 
console.log(t.substring(idx-50, idx+50));
