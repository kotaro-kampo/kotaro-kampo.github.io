const cheerio = require('cheerio');
fetch('https://www.kotaro.co.jp/iryou/product_list/').then(r=>r.text()).then(html=>{
  const $ = cheerio.load(html);
  const icons=new Set();
  $('img').each((_,m)=>{
    const src = $(m).attr('src');
    if(src && src.includes('icon')) icons.add(src);
  });
  console.log(Array.from(icons));
});
