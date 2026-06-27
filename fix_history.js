const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace the previous script with a better one
html = html.replace(/<script>\s*\(function\(\) \{\s*let isModalOpen = false;[\s\S]*?\}\)\(\);\s*<\/script>/, `
<script>
(function() {
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
})();
</script>`);

fs.writeFileSync('index.html', html);

let sw = fs.readFileSync('service-worker.js', 'utf8');
sw = sw.replace(/kotaro-kampo-cache-v\d+/, 'kotaro-kampo-cache-v18');
fs.writeFileSync('service-worker.js', sw);

console.log('Fixed index.html and bumped SW to v18');
