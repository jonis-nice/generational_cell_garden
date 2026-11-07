const fs=require('fs'),assert=require('assert');
const app=fs.readFileSync('app.js','utf8');
const fn=app.slice(app.indexOf('function sharedMassPath(poly){'),app.indexOf('function organicPath(poly)'));
assert.ok(fn.includes('const cut=Math.min(26,len*.46)'),'cell corners use broad rounding');
assert.ok(fn.includes('Math.min(5.8,ul*.14)'),'cell edges receive visible curved bulge');
assert.ok(app.includes('const localRadius=step*(.24+rand()*.27)'),'plant-cell centers use variable spacing');
assert.ok(app.includes('rawCenter=visualCellCenter(cell),inset=.82+rand()*.105'),'plant cells use varied gaps');
assert.ok(app.includes('const f=1+.052*Math.sin(2*a+morphPhase)+.032*Math.sin(3*a+morphPhase2)+.016*Math.sin(5*a+morphPhase3)'),'each plant-cell contour gets independent asymmetry');
console.log('rounded, varied botanical plant cells: PASS');
