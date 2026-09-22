async function fetchDetails(url, type) {
    console.log(`Fetching details for ${url}...`);
    const l = `${Si}/medicus-bin/${url}`;
    const res = await fetch(l);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const r = {
        type, efficacy: "", feature: "",
        ingredients: [], components: [], additives: [], dailyDose: "",
        usage: "", precautions: "", usageNotes: ""
    };

    if (type === "medical") {
        $("h3, h4").each((_, h) => {
            const m = $(h).text().trim();
            const p = Y0(h, $);
            if (/効能|効果/.test(m) && !/禁忌/.test(m) && !r.efficacy) r.efficacy = p;
            else if (/用法.*用量|用量.*用法/.test(m) && !r.usage) {
                r.usage = p;
                const v = p.match(/1日\s*([\d.]+\s*g)/);
                if (v && !r.dailyDose) r.dailyDose = v[1];
            } else if (/禁忌|使用上の注意|重要な基本的注意|特定の背景を有する患者に関する注意|相互作用|副作用|その他の注意/.test(m)) {
                const title = m.replace(/^\d+\.?\s*/, '').trim();
                r.precautions = r.precautions ? r.precautions + '\n\n【' + title + '】\n' + p : '【' + title + '】\n' + p;
            }
            else if (/用法に関する注意/.test(m) && !r.usageNotes) r.usageNotes = p;
        });
        
        const d = url.match(/japic_code=(\d+)/);
        if (d) {
            const h = `${Si}/medicus-bin/japic_med_product?id=${d[1]}`;
            try {
                const m2 = await fetch(h);
                const html2 = await m2.text();
                const $2 = cheerio.load(html2);
                $2("td.title, td").each((_, s) => {
                    const o = $2(s).text().trim();
                    const f = $2(s).next();
                    if (f.length) {
                        if (/^成分/.test(o) || o === "有効成分") {
                            const dm = o.match(/[（(]([^）)]+)[）)]/);
                            if (dm) r.dailyDose = dm[1].replace(/中$/, "");
                            const ht = f.find("table");
                            if (ht.length) {
                                r.ingredients = zA(ht, $2);
                            } else {
                                r.ingredients = Ey(f.text() || "");
                            }
                        } else if (o === "添加剤" || o === "添加物") {
                            r.additives = V0(f, $2);
                        }
                    }
                });
                
                if (r.ingredients.length === 0) {
                    $2("table").each((_, o) => {
                        $2(o).find("tr").each((_, tr) => {
                            const th = $2(tr).find("th").text().trim();
                            const td = $2(tr).find("td");
                            if (th === "有効成分") {
                                r.ingredients = Ey(td.text() || "");
                            }
                        });
                    });
                }
            } catch (err) {
                console.warn(`Failed to fetch japic_med_product for ${url}`);
            }
        }
        return r;
    }
    
    // OTC Details logic
    $("td.title").each((_, m) => {
        const p = $(m).text().trim();
        const v = $(m).next();
        if (v.length) {
            if (/^成分/.test(p)) {
                const y = p.match(/[（(](.*)[）)]/);
                if (y) r.dailyDose = y[1].replace(/中$/, "");
            } else if (p === "添加物") {
                r.additives = V0(v, $);
            }
        }
    });

    const tables = $("table");
    tables.each((_, p) => {
        const v = $(p).find("tr");
        if (v.length < 2) return;
        const x = $(v[0]).find("td");
        if (x.length === 2) {
            const w = $(x[0]).text().trim();
            const O = $(x[1]).text().trim();
            if (/エキス|[ァ-ヶ]/.test(w) && /\d+\.?\d*(g|mL|mg)/.test(O)) {
                r.ingredients = _A(p, $);
                return false;
            }
        }
    });

    $("h3, h4").each((_, m) => {
        const p = $(m).text().trim();
        const v = Y0(m, $);
        if (/効果[・･]効能|効能[・･]効果/.test(p)) r.efficacy = v;
        else if (p === "特徴") r.feature = v;
        else if (/使用上の注意/.test(p) && !r.precautions) r.precautions = v;
        else if (/用法[・･]用量|用量[・･]用法/.test(p)) r.usage = v;
        else if (/用法に関する注意/.test(p)) r.usageNotes = v;
    });

    Object.keys(r).forEach(k => {
        if (typeof r[k] === 'string') {
            r[k] = r[k].replace(/，/g, '、');
        } else if (Array.isArray(r[k])) {
            r[k] = r[k].map(s => typeof s === 'string' ? s.replace(/，/g, '、') : s);
        }
    });
    return r;
}

const cheerio = require('cheerio'); 
const Si = 'https://www.kegg.jp'; 
function Y0(el, $) { 
    let t = ''; let c = $(el).next(); 
    while(c.length && !c.is('h1, h2, h3, h4')) { 
        t += c.text() + '\n'; 
        c = c.next(); 
    } 
    return t.trim(); 
}
// Stub Ey, zA, V0
function Ey() { return []; }
function zA() { return []; }
function V0() { return []; }

fetchDetails('japic_med?japic_code=00000185', 'medical').then(r => console.log('Result:', r.precautions.substring(0, 100)));
