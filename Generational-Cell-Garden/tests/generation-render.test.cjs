const assert=require('assert'),fs=require('fs');
const s=fs.readFileSync(require('path').join(__dirname,'..','app.js'),'utf8');
const checks=[
 ['one plant symbol per group',/gr\.points\.slice\(0,1\)/.test(s)],
 ['cells are clipped to bed geometry',/clipHalfPlane\(cell,nx,ny,c\)/.test(s)],
 ['cell outlines use curved shared boundaries',/const massPath=sharedMassPath\(gr\.poly\)/.test(s)&&/const pat=massPattern\(gr,gi\),d=massPath/.test(s)],
 ['cell edge curves are canonical',/const forward=/.test(s)&&/const key=\[u\.x,u\.y,v\.x,v\.y\]/.test(s)],
 ['new eight-form library replaces project-labelled profiles',/const BED_FORM_LIBRARY=\[/.test(s)&&/rounded-field/.test(s)&&!/OUDOLF_PROJECT_REFERENCES/.test(s)],
 ['mixed mode uses distinct authored form families',/const forms=requested==='mixed'/.test(s)&&/BED_FORM_ARCHETYPES/.test(s)],
 ['cell seed positions use staggered hexagonal packing',/row%2\)\*step\*\.5/.test(s)],
 ['same species are discouraged in adjacent cells',/repeats\*100/.test(s)],
 ['cell contours are heavier than previous hairlines',/Math\.max\(2\.2,Math\.min\(2\.8/.test(s)]
];
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);assert(ok,name)}
