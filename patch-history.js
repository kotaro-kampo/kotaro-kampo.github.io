const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('isModalOpen')) {
  const script = `
<script>
(function() {
  let isModalOpen = false;
  const observer = new MutationObserver(() => {
    const backBtn = document.querySelector('button[aria-label="戻る"]');
    if (backBtn && !isModalOpen) {
      isModalOpen = true;
      history.pushState({ modalOpen: true }, '');
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
</script>
`;
  html = html.replace('</head>', script + '</head>');
  fs.writeFileSync('index.html', html);
  console.log('Patched index.html');
} else {
  console.log('Already patched');
}
