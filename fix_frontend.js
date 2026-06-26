const fs = require('fs');

const file = 'js/index-D5iRUZS0.js';
let code = fs.readFileSync(file, 'utf8');

// Fix CA (Medical Scraper)
code = code.replace(
  /let O="";p\.length>=3\?O=p\[2\]\.textContent\?\.trim\(\)\|\|"":p\.length>=2&&\(\O=p\[1\]\.textContent\?\.trim\(\)\|\|""\);const C=L0\(O\),N=U0\(x\);n\.push\(\{name:N,rawName:x,url:H0\(w\),type:"medical",otcCategory:null,subCategory:C/g,
  'let O="";if(p.length>=2)O=p[1].textContent?.trim()||"";const C=L0(O),N=U0(x);n.push({name:N,rawName:x,url:H0(w),type:"medical",otcCategory:null,subCategory:C'
);

// Fix OA (OTC Scraper)
code = code.replace(
  /let O="";p\.length>=3\?O=p\[2\]\.textContent\?\.trim\(\)\|\|"":p\.length>=2&&\(\O=p\[1\]\.textContent\?\.trim\(\)\|\|""\);const C=L0\(O\),N=U0\(x\),B=Sy/g,
  'let O="";if(p.length>=3)O=p[2].textContent?.trim()||"";const C=L0(O),N=U0(x),B=Sy'
);

// Fix Sy function for Yokuinin S
code = code.replace(
  /function Sy\(n\)\{const r=xA\(n\);return bA\.find\(s=>s\.normalized===r\)\?\.category\?\?null\}/g,
  'function Sy(n){if(n.includes("ヨクイニンS"))return "kyoryokukai";const r=xA(n);return bA.find(s=>s.normalized===r)?.category??null}'
);

fs.writeFileSync(file, code);
console.log('Fixed js/index-D5iRUZS0.js');
