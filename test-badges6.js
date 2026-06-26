const html = require('fs').readFileSync('kotaro.html', 'utf8');
const cheerio = require('cheerio');
const $ = cheerio.load(html);
const list=[];
$('tr').each((_,tr)=>{
  const tds=$(tr).find('td');
  if(tds.length>0) {
    const name=$(tds[1]).text().trim() || $(tds[0]).text().trim();
    if(name) list.push(name);
  }
});
console.log(list.slice(0,20));
