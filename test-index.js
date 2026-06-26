const fs=require('fs'); 
const t=fs.readFileSync('index.html','utf8'); 
const idx=t.indexOf('<script type="module"'); 
console.log(t.substring(idx-100, idx+200));
