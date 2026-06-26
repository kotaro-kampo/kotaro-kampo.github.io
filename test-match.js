const fs = require('fs');
const cheerio = require('cheerio');

function xA(n) {
    return n.replace(/[Ａ-Ｚａ-ｚ０-９]/g, r => String.fromCharCode(r.charCodeAt(0) - 65248))
            .replace(/[－―]/g, "-")
            .replace(/[〜～]/g, "~")
            .replace(/「.*?」/g, "")
            .replace(/『.*?』/g, "")
            .replace(/【.*?】/g, "")
            .replace(/（.*?）/g, "")
            .replace(/\(.*?\)/g, "")
            .replace(/®/g, "")
            .replace(/エキス/g, "")
            .replace(/顆粒/g, "")
            .replace(/細粒/g, "")
            .replace(/カプセル/g, "")
            .replace(/錠/g, "")
            .replace(/水製/g, "")
            .replace(/N$/i, "n")
            .replace(/S$/i, "s")
            .replace(/G$/i, "g")
            .replace(/V$/i, "v")
            .replace(/P$/i, "p")
            .replace(/コタロー/g, "")
            .replace(/小太郎/g, "")
            .replace(/漢方/g, "")
            .replace(/製薬/g, "")
            .replace(/株式会社/g, "")
            .replace(/株/g, "")
            .replace(/　/g, "")
            .replace(/ /g, "")
            .trim()
            .toLowerCase();
}

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
            if (cat !== 'other') {
                map[xA(name)] = cat;
            }
        }
    });

    const d = require('./data.json');
    let matched = 0, unmatched = 0, unmatchedNames = [];
    d.data.filter(i => i.type === 'otc').forEach(i => {
        const c = map[xA(i.rawName)];
        if (c) matched++;
        else {
            unmatched++;
            unmatchedNames.push(i.rawName);
        }
    });
    console.log('Matched:', matched, 'Unmatched:', unmatched);
    console.log(unmatchedNames.slice(0, 10));
}
run();
