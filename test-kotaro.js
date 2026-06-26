const fs = require('fs');
const cheerio = require('cheerio');

async function run() {
    const res = await fetch('https://www.kotaro.co.jp/iryou/product_list/');
    const html = await res.text();
    const $ = cheerio.load(html);
    const map = {};
    $('tr').each((_, tr) => {
        const tds = $(tr).find('td');
        if (tds.length > 0) {
            const name = $(tds[1]).text().trim() || $(tds[0]).text().trim();
            let cat = 'other';
            $(tds[0]).find('img').each((_, img) => {
                const src = $(img).attr('src');
                if (src) {
                    if (src.includes('product_cat_coop.gif')) cat = 'kyoryokukai';
                    else if (src.includes('product_cat_club.gif')) cat = 'sajikurabu';
                    else if (src.includes('product_cat_visual.gif')) cat = 'visual';
                }
            });
            if (cat !== 'other') map[name] = cat;
        }
    });
    console.log(Object.keys(map).slice(0, 20));
}
run();
