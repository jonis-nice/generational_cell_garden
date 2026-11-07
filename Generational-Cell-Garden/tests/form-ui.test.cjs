const assert=require('assert'),fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const select=html.match(/<select id="bedForm">([\s\S]*?)<\/select>/)?.[1]||'';
const options=[...select.matchAll(/<option value="([^"]+)"/g)].map(x=>x[1]);
assert.equal(options.length,29,'mixed mode plus 28 named silhouettes');
assert(options.includes('hallonbat')&&options.includes('halvmane')&&options.includes('njurform'));
assert(!/Oudolf|Vandalorum|High Line|Detroit/.test(select),'no unsupported project attribution');
assert(html.includes('value="24"')&&html.includes('value="16"'),'24 x 16 m default');
console.log('form UI: PASS (28 named silhouettes, 24 x 16 m default)');
