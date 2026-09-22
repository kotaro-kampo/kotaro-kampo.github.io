const cheerio = require('cheerio');
const fs = require('fs');
const html = fs.readFileSync('D:/管理/ドキュメント/AntiGravity/小太郎関係/小太郎医薬品検索 - web/kakkon.html', 'utf8');
const $ = cheerio.load(html);

function Y0(el, $) {
    let text = '';
    let curr = $(el).next();
    while (curr.length && !curr.is('h1, h2, h3, h4')) {
        text += curr.text() + '\n';
        curr = curr.next();
    }
    return text.trim();
}

$('h3, h4').each((_, el) => {
    const m = $(el).text().trim();
    if (/副作用/.test(m)) {
        console.log('--- ' + m + ' ---');
        console.log(Y0(el, $));
    }
});
