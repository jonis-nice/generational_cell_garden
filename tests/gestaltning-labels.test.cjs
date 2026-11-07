const fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
for(const label of ['Sammanhängande växtgrupper','Basväxt med accenter','Blandad ängsplantering']) assert(html.includes(label),`Missing label: ${label}`);
assert(html.includes('aesthetic.js'),'Aesthetic module should load before app');
console.log('gestaltning labels tests passed');
