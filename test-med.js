const cheerio=require('cheerio'); 
fetch('https://www.kegg.jp/medicus-bin/japic_med?japic_code=00000582')
.then(r=>r.text())
.then(html=>{ 
  const $ = cheerio.load(html); 
  let eff=''; 
  $('td').each((_,m)=>{ 
    const p=$(m).text().trim(); 
    if(/効能又は効果/.test(p) || /効能・効果/.test(p)) eff=$(m).next().text() || $(m).parent().next().text(); 
  }); 
  console.log('Efficacy:', eff.substring(0, 200)); 
})
