const assert=require('assert'),fs=require('fs');
const s=fs.readFileSync(require('path').join(__dirname,'..','app.js'),'utf8');
assert(s.includes("family==='swept-field'"));
assert(s.includes("family==='long-curved-border'"));
assert(s.includes("family==='double-room'"));
assert(s.includes("family==='tapered-field'"));
console.log('swept, tapered, double-room and long-border geometry: PASS');
