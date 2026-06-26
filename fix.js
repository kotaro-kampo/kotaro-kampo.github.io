const fs = require('fs');
const cheerio = require('cheerio');
const Si = "https://www.kegg.jp";

async function fetchMedDetails(url) {
    const res = await fetch(`${Si}/medicus-bin/${url}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let efficacy = '';
    let usage = '';
    let components = [];
    
    $('h1, h2, h3, h4, h5, .title').each((_, el) => {
        const text = $(el).text().trim();
        if (/効能|効果/.test(text) && !/薬理|追加|副作用/.test(text)) {
            efficacy = $(el).nextUntil('h1, h2, h3, h4, h5, .title').text().trim() || $(el).parent().next().text().trim();
        }
        if (/用法|用量/.test(text)) {
            usage = $(el).nextUntil('h1, h2, h3, h4, h5, .title').text().trim() || $(el).parent().next().text().trim();
        }
    });

    // Try to find components in tables
    $('table').each((_, p) => {
        const v = $(p).find("tr");
        if (v.length < 2) return;
        const x = $(v[0]).find("td");
        if (x.length === 2) {
            const w = $(x[0]).text().trim();
            const O = $(x[1]).text().trim();
            if (/\d+\.?\d*(g|mL|mg)/.test(O) || /[ァ-ヶ]/.test(w)) {
                // Approximate component logic as in update-data.js
                $(p).find("tr").each((_, tr) => {
                    const tds = $(tr).find("td");
                    if (tds.length === 2) {
                        const h = $(tds[0]).text().replace(/\s+/g,'').replace(/[Ａ-Ｚａ-ｚ０-９]/g, r => String.fromCharCode(r.charCodeAt(0) - 65248));
                        const d = $(tds[1]).text().trim();
                        if (h && d) components.push({ name: h, amountStr: d, isExtract: false });
                    }
                });
                return false;
            }
        }
    });

    // If components is still empty, add a dummy component so it's not strictly empty
    // The main issue is that efficacy is empty, which triggers the fallback K0 in the UI.
    if(components.length === 0) {
        components.push({ name: "添付文書を参照", amountStr: "", isExtract: false });
    }

    return { efficacy, usage, components };
}

function clean(n) {
    return n.replace(/[「」【】（）()GNSVＡ-Ｚ]/g,'').replace(/コタロー|エキス|顆粒|細粒|錠|小太郎|漢方/g,'').replace(/　/g,'').trim();
}

async function main() {
    console.log("Loading data.json...");
    const d = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    const bA = eval(fs.readFileSync('scripts/bA.json', 'utf8'));

    let medCount = 0;
    for (let i=0; i<d.data.length; i++) {
        let item = d.data[i];
        if (item.type === 'otc') {
            // Fix category
            let c = 'other';
            let n1 = clean(item.name);
            let n2 = clean(item.rawName);
            const match = bA.find(s => clean(s.name) === n1 || clean(s.name) === n2);
            if (match) c = match.category;
            else if (n2.includes('かっ香正気散')) c = 'sajikurabu';
            else if (n2.includes('きゅう帰調血飲第一加減')) c = 'sajikurabu';
            else if (n2.includes('清上けん痛湯')) c = 'sajikurabu';
            else if (n2.includes('虔修六神丸')) c = 'visual';
            else if (n2.includes('ショーケン分包')) c = 'sajikurabu';
            else if (n2.includes('チクラック')) c = 'kyoryokukai';
            else if (n2.includes('ボーラック')) c = 'kyoryokukai';
            
            item.otcCategory = c;
        } else if (item.type === 'medical') {
            // Re-fetch medical details if missing efficacy
            if (!item.efficacy || item.efficacy.trim() === '') {
                console.log(`Fetching Med: ${item.name}`);
                const details = await fetchMedDetails(item.url);
                item.efficacy = details.efficacy;
                item.usage = details.usage;
                item.components = details.components;
                medCount++;
                await new Promise(r => setTimeout(r, 500)); // 0.5s delay
            }
        }
    }
    
    fs.writeFileSync('data.json', JSON.stringify(d));
    console.log(`Updated! Fetched ${medCount} medical items.`);
}

main().catch(console.error);
