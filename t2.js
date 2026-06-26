const cheerio = require('cheerio');
async function test() {
    console.log("OTC:");
    const res = await fetch('https://www.kegg.jp/medicus-bin/search_drug?display=otc&search_keyword=%e5%b0%8f%e5%a4%aa%e9%83%8e%e6%bc%a2%e6%96%b9%e8%a3%bd%e8%96%ac&page=1');
    const html = await res.text();
    const $ = cheerio.load(html);
    const firstTr = $('table.list1 tr').eq(1);
    const tds = firstTr.find('td');
    tds.each((i, el) => console.log(i, $(el).text().trim()));

    console.log("Med:");
    const res2 = await fetch('https://www.kegg.jp/medicus-bin/search_drug?search_keyword=%E5%B0%8F%E5%A4%AA%E9%83%8E%E6%BC%A2%E6%96%B9%E8%A3%BD%E8%96%AC&page=1');
    const html2 = await res2.text();
    const $2 = cheerio.load(html2);
    const firstTr2 = $2('table.list1 tr').eq(1);
    const tds2 = firstTr2.find('td');
    tds2.each((i, el) => console.log(i, $2(el).text().trim()));
}
test();
