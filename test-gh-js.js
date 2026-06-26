fetch('https://kotaro-kampo.github.io/js/index-D5iRUZS0.js?t=' + Date.now())
  .then(r => r.text())
  .then(t => {
    console.log('Includes fetch(data.json):', t.includes('fetch("data.json'));
  });
