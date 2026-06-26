const html = require('fs').readFileSync('kotaro.html', 'utf8');
const cheerio = require('cheerio');
const $ = cheerio.load(html);
const imgs = new Set();
$('img').each((_, m) => {
  const src = $(m).attr('src');
  if(src) imgs.add(src);
});
console.log(Array.from(imgs));
