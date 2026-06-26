const html = require('fs').readFileSync('kotaro.html', 'utf8');
const rx = /<img[^>]+src="([^"]+btn_[^"]+)"/g;
let m;
const badges = new Set();
while((m = rx.exec(html)) !== null) {
  badges.add(m[1]);
}
console.log(Array.from(badges));
