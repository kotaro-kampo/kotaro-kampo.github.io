const cheerio = require('cheerio');
async function test() {
    const res = await fetch('https://www.kotaro.co.jp/iryou/product_list/');
    const html = await res.text();
    const $ = cheerio.load(html);
    $('tr').each((_, tr) => {
        const tds = $(tr).find('td');
        if (tds.length > 0) {
            const name = $(tds[1]).text().trim() || $(tds[0]).text().trim();
            if (name.includes('ショーケン')) {
                console.log('NAME:', name);
                console.log('HTML:', $(tds[0]).html());
            }
        }
    });
}
test();
