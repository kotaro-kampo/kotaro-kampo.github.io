const fs = require('fs');
let code = fs.readFileSync('js/index-D5iRUZS0.js', 'utf8');

// Force LA() to always return null so it NEVER uses stale localStorage
code = code.replace(/function LA\(\)\{[\s\S]*?catch\{return null\}\}/, 'function LA(){return null;}');

// Just to be absolutely sure, let's also remove any `Sy` recalculations if they happen
// by making Sy just return what's passed in, though it shouldn't be needed since CA() is gone.
// We won't touch Sy for now to avoid breaking other things if not needed.

fs.writeFileSync('js/index-D5iRUZS0.js', code);
console.log('Patched LA() to bypass localStorage');
