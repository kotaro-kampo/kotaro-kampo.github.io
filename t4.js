const fs=require('fs');
const code=fs.readFileSync('js/index-D5iRUZS0.js','utf8');
const rx=/\{name:"ヨクイニン[^}]+\}/g;
let match;
while((match=rx.exec(code))!==null) {
    console.log(match[0]);
}
