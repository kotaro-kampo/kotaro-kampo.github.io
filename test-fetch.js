const fs=require('fs'); const t=fs.readFileSync('js/index-D5iRUZS0.js','utf8'); const rx=/fetch\("data\.json/g; let m=rx.exec(t); if(m) console.log(t.substring(m.index-50, m.index+1500));
