const cheerio = require('cheerio');
fetch('https://www.kotaro.co.jp/iryou/product_list/').then(r=>r.text()).then(html=>{
  const $ = cheerio.load(html);
  $('a').each((_, a) => {
    const img = $(a).find('img').attr('src');
    if(img && img.includes('icon')) {
      console.log($(a).text().trim(), img);
    }
  });
});
