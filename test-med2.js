const cheerio = require('cheerio');

async function scrapeMed() {
    const res = await fetch('https://www.kegg.jp/medicus-bin/japic_med?japic_code=00000582');
    const html = await res.text();
    const $ = cheerio.load(html);
    
    console.log("=== ALL HEADINGS ===");
    $('h1, h2, h3, h4, h5, .title').each((_, el) => {
        console.log($(el).text().trim());
    });
    
    console.log("\n=== ALL TD ===");
    let text = [];
    $('td').each((_, el) => {
        const t = $(el).text().trim();
        if(t && t.length < 50) text.push(t);
    });
    console.log(text.slice(0, 30).join(' | '));
}

scrapeMed();
