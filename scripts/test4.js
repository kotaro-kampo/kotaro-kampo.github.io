const cheerio = require('cheerio');
function Y0(el, $) {
    let text = '';
    let curr = $(el).next();
    while (curr.length && !curr.is('h1, h2, h3, h4')) {
        text += curr.text() + '\n';
        curr = curr.next();
    }
    return text.trim();
}
fetch('https://www.kegg.jp/medicus-bin/japic_med?japic_code=00000185').then(r=>r.text()).then(html=>{
    const $ = cheerio.load(html);
    const r = { precautions: '' };
    $('h3, h4').each((_, h) => {
        const m = $(h).text().trim();
        const p = Y0(h, $);
        if (/禁忌|使用上の注意|重要な基本的注意|特定の背景を有する患者に関する注意|相互作用|副作用|その他の注意/.test(m)) {
            const title = m.replace(/^\d+\.?\s*/, '').trim();
            r.precautions = r.precautions ? r.precautions + '\n\n【' + title + '】\n' + p : '【' + title + '】\n' + p;
        }
    });
    console.log('Result:', r.precautions.substring(0, 100));
});
