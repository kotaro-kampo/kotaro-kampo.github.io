const fs=require('fs'); 
const t=fs.readFileSync('js/index-D5iRUZS0.js','utf8'); 
const rx=/className:"text-base font-bold/; 
let match=rx.exec(t); 
if(match) console.log(t.substring(match.index-100, match.index+300));
