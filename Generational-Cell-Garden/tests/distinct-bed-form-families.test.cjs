const assert=require('assert'),fs=require('fs'),vm=require('vm'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const a=src.indexOf('function makeFlowBedShape('),b=src.indexOf('\nfunction pathPreview',a);
const ctx={Math};vm.createContext(ctx);vm.runInContext(src.slice(a,b),ctx);
const make=vm.runInContext('makeBedShape',ctx);
const forms=[
 {id:'field',family:'rounded-field',power:4.6},{id:'long',family:'long-field',power:5.4},
 {id:'trapezoid',family:'soft-trapezoid',power:3.8},{id:'taper',family:'tapered-field',power:4.2},
 {id:'sweep',family:'swept-field',power:4.4},{id:'double',family:'double-room',power:3.2},
 {id:'corner',family:'rounded-corner-field',power:4.8},{id:'border',family:'long-curved-border',power:4.5}
];
const signatures=forms.map((f,i)=>make(0,0,6,3,f,0,1234+i).map(p=>`${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(';'));
assert.equal(new Set(signatures).size,forms.length,'all new form families produce distinct geometry');
console.log('eight distinct geometry families: PASS');
