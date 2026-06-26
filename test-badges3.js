const cheerio = require('cheerio');
fetch('https://www.kotaro.co.jp/iryou/product_list/').then(r=>r.text()).then(html=>{
  const $ = cheerio.load(html);
  const list=[];
  $('tr').each((_,tr)=>{
    const tds=$(tr).find('td');
    if(tds.length>0) {
      const name=$(tds[1]).text().trim();
      const badges=[];
      $(tds[0]).find('img').each((_,img)=>{
        const src=$(img).attr('src');
        if(src && src.includes('btn_')) badges.push(src);
      });
      if(name && badges.length>0) list.push({name, badges});
    }
  });
  console.log(list.slice(0,5));
});
