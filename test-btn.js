const html = require('fs').readFileSync('kotaro.html', 'utf8');
const cheerio = require('cheerio');
const $ = cheerio.load(html);
let found = false;
$('img').each((_, img) => {
  const src = $(img).attr('src');
  if(src && src.includes('btn_')) {
    console.log(src);
    found = true;
  }
});
if(!found) console.log('No btn_ badges found in HTML!');
