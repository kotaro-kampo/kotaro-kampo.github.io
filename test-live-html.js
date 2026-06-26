fetch('https://kotaro-kampo.github.io/')
  .then(r => r.text())
  .then(t => {
    const match = t.match(/<script[^>]*src="([^"]+)"/);
    console.log('Script URL:', match ? match[1] : 'Not found');
  });
