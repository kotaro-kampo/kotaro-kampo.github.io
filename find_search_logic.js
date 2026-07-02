const fs = require('fs');
const code = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');
const searchButtons = code.match(/.{0,200}name:"商品名",ingredient:"生薬名",efficacy:"効能効果".{0,200}/g);
console.log("Search Buttons UI:\n", searchButtons ? searchButtons[0] : "Not found");

const filterLogic = code.match(/l==="name"\?p=p\.filter\([^;]+/g);
console.log("\nFilter Logic:\n", filterLogic ? filterLogic[0] : "Not found");
