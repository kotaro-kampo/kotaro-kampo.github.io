const cheerio = require('cheerio');
const fs = require('fs');
const html = fs.readFileSync('D:/管理/ドキュメント/AntiGravity/小太郎関係/小太郎医薬品検索 - web/kakkon.html', 'utf8');
const $ = cheerio.load(html);
$('h3, h4, h5').each((_, el) => {
    console.log($(el).text().trim());
});
