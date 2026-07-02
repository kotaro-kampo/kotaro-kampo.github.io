const fs = require('fs');
let code = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');

// 1. Update QA signature and filter logic
let qaRegex = /function QA\(n,r,l,s,o,f,d\)\{/;
code = code.replace(qaRegex, "function QA(n,r,l,s,o,f,d,excIng){");

// 2. Update ingredient filter logic inside QA
let ingFilterRegex = /l==="ingredient"\?p=p\.filter\(w=>\{const O=cn\.get\(w\.url\);return O\?x\.every\(C=>O\.ingredients\.some\(N=>bl\(N\.name,C,N\.aliases\)\)\):!1\}\)/;
code = code.replace(ingFilterRegex, `l==="ingredient"?p=p.filter(w=>{const O=cn.get(w.url);return O?x.every(C=>excIng?!O.ingredients.some(N=>bl(N.name,C,N.aliases)):O.ingredients.some(N=>bl(N.name,C,N.aliases))):!1})`);

// 3. Update name filter logic inside QA
let nameFilterRegex = /l==="name"\?p=p\.filter\(w=>x\.every\(O=>w\.sortKey\.includes\(O\)\?!0:yl\(w\.name,O\)\|\|yl\(w\.rawName,O\)\|\|yl\(w\.subCategory\|\|"",O\)\)\)/;
code = code.replace(nameFilterRegex, `l==="name"?p=p.filter(w=>x.every(O=>w.sortKey.includes(O)?!0:yl(w.name,O)||yl(w.rawName,O)||yl(w.subCategory||"",O)||(w.subCategorySortKey&&w.subCategorySortKey.includes(O))))`);

// 4. Update QA dependencies
let qaDepRegex = /m\(p\)\},\[n,r,l,s,o,f,d\]\),h\}/;
code = code.replace(qaDepRegex, `m(p)},[n,r,l,s,o,f,d,excIng]),h}`);

// 5. Update WA state hooks
let waStateRegex = /\[N,B\]=E\.useState\(!1\);/;
code = code.replace(waStateRegex, `[N,B]=E.useState(!1),[excIng,setExcIng]=E.useState(!1);`);

// 6. Update QA call in WA
let qaCallRegex = /U=QA\(\$,n,l,o,m,I,ce\)/;
code = code.replace(qaCallRegex, `U=QA($,n,l,o,m,I,ce,excIng)`);

// 7. Update UI to add checkbox
let uiRegex = /S\.jsx\("div",\{"data-loc":"client\/src\/pages\/Home\.tsx:427",className:"flex gap-1 mb-2",children:\["name","ingredient","efficacy"\]\.map\(le=>\{const Ee=\{name:"商品名",ingredient:"生薬名",efficacy:"効能効果"\},Ve=l===le;return S\.jsx\("button",\{"data-loc":"client\/src\/pages\/Home\.tsx:436",onClick:\(\)=>\{s\(le\),r\(""\)\},className:`text-xs px-3 py-1 rounded-full font-medium border transition-all \$\{Ve\?"bg-white text-emerald-800 border-white":"bg-white\/10 text-white\/70 border-white\/20 hover:bg-white\/20"\}`,children:Ee\[le\]\},le\)\}\)\}\)/;
const uiReplacement = `S.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:427",className:"flex items-center gap-2 mb-2 flex-wrap",children:[S.jsx("div",{className:"flex gap-1",children:["name","ingredient","efficacy"].map(le=>{const Ee={name:"商品名",ingredient:"生薬名",efficacy:"効能効果"},Ve=l===le;return S.jsx("button",{"data-loc":"client/src/pages/Home.tsx:436",onClick:()=>{s(le),r(""),setExcIng(!1)},className:\`text-xs px-3 py-1 rounded-full font-medium border transition-all \${Ve?"bg-white text-emerald-800 border-white":"bg-white/10 text-white/70 border-white/20 hover:bg-white/20"}\`,children:Ee[le]},le)})}),l==="ingredient"&&S.jsxs("label",{className:"flex items-center gap-1.5 text-xs text-white/90 cursor-pointer ml-1",children:[S.jsx("input",{type:"checkbox",checked:excIng,onChange:e=>setExcIng(e.target.checked),className:"accent-emerald-600 w-3.5 h-3.5 cursor-pointer"}),S.jsx("span",{children:"を除く"})]})]})`;
code = code.replace(uiRegex, uiReplacement);

// Bump SW version
let sw = fs.readFileSync('service-worker.js', 'utf8');
sw = sw.replace(/kotaro-kampo-cache-v\d+/, 'kotaro-kampo-cache-v25');
fs.writeFileSync('service-worker.js', sw);

fs.writeFileSync('js/index-D5iRUZS0.js', code);
console.log("Successfully patched JS bundle and SW!");
