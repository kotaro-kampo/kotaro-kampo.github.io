const fs = require('fs');

// 1. Fix the history script in index.html
let html = fs.readFileSync('index.html', 'utf8');

// First remove the old buggy script
html = html.replace(/<script>\s*\(function\(\) \{\s*let isModalOpen = false;[\s\S]*?\}\)\(\);\s*<\/script>/, '');

// Now inject the new one with DOMContentLoaded
const newScript = `
<script>
document.addEventListener('DOMContentLoaded', function() {
  let isModalOpen = false;
  const observer = new MutationObserver(() => {
    const backBtn = document.querySelector('button[aria-label="戻る"]');
    if (backBtn && !isModalOpen) {
      isModalOpen = true;
      history.pushState({ modalOpen: true }, '', '#detail');
    } else if (!backBtn && isModalOpen) {
      isModalOpen = false;
      if (history.state && history.state.modalOpen) {
        history.back();
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('popstate', (e) => {
    if (isModalOpen) {
      const backBtn = document.querySelector('button[aria-label="戻る"]');
      if (backBtn) {
        isModalOpen = false;
        backBtn.click();
      }
    }
  });
});
</script>
`;
html = html.replace('</head>', newScript + '</head>');
fs.writeFileSync('index.html', html);

// 2. Bump SW
let sw = fs.readFileSync('service-worker.js', 'utf8');
sw = sw.replace(/kotaro-kampo-cache-v\d+/, 'kotaro-kampo-cache-v19');
fs.writeFileSync('service-worker.js', sw);

// 3. Fix data.json for Inchin-goreisan
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
data.data.forEach(x => {
    if (x.name.includes('茵陳五苓散エキス細粒G')) {
        x.otcCategory = 'sajikurabu';
    }
});
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

// 4. Fix update-data.js
let update = fs.readFileSync('scripts/update-data.js', 'utf8');
// We need to add logic to override the badge for Inchin-goreisan
// Let's insert it where matchKey is checked.
update = update.replace(
  /if \(matchKey === "ヨクイニンs"\) \{/,
  `if (matchKey.includes("茵陳五苓散エキス細粒g")) { B = "sajikurabu"; }
            if (matchKey === "ヨクイニンs") {`
);
fs.writeFileSync('scripts/update-data.js', update);

console.log('Fixed history script, bumped SW, and updated Inchin-goreisan badge');
