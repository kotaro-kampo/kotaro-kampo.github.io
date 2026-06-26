const cheerio = require('cheerio');

async function scrapeMed() {
    const res = await fetch('https://www.kegg.jp/medicus-bin/japic_med?japic_code=00000582');
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let efficacy = '';
    let usage = '';
    let components = [];
    let precautions = '';
    
    // Find headings like "4. 効能または効果"
    $('h1, h2, h3, h4, h5, .title').each((_, el) => {
        const text = $(el).text().trim();
        if (/効能|効果/.test(text) && !/薬理|追加|副作用/.test(text)) {
            efficacy = $(el).nextUntil('h1, h2, h3, h4, h5, .title').text().trim() || $(el).parent().next().text().trim();
        }
        if (/用法|用量/.test(text)) {
            usage = $(el).nextUntil('h1, h2, h3, h4, h5, .title').text().trim() || $(el).parent().next().text().trim();
        }
        if (/組成/.test(text)) {
            // Find tables after 組成
            const t = $(el).nextUntil('h1, h2, h3, h4, h5, .title').find('table').first();
            if(t.length) {
                t.find('tr').each((_, tr) => {
                    const tds = $(tr).find('td');
                    if (tds.length >= 2) {
                        const name = $(tds[0]).text().trim().replace(/\s+/g,'');
                        const amount = $(tds[1]).text().trim();
                        if (name && amount) components.push({ name, amountStr: amount });
                    }
                });
            }
        }
    });
    console.log("EFFICACY:", efficacy);
    console.log("USAGE:", usage);
    console.log("COMPONENTS:", components);
}

scrapeMed();
