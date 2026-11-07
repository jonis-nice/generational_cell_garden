const assert=require('assert'),fs=require('fs'),vm=require('vm'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const a=src.indexOf('function inside('),b=src.indexOf('function distanceColour',a);
const ctx={Math,clamp:(n,a,b)=>Math.max(a,Math.min(b,n)),id:(()=>{let i=0;return()=>String(++i)})()};
vm.createContext(ctx);vm.runInContext(src.slice(a,b),ctx);
const forms=vm.runInContext('BED_FORM_LIBRARY',ctx),make=vm.runInContext('makeBedShape',ctx),layout=vm.runInContext('generateBedLayout',ctx);
assert.equal(forms.length,28,'28 authored cell silhouettes');
assert.equal(new Set(forms.map(f=>f.id)).size,28,'all form IDs unique');
for(const f of forms){
 const p=make(0,0,4.5,3.2,f,.18,12345);
 assert.equal(p.length,48,`${f.id} has a complete closed contour`);
 assert(p.every(q=>Number.isFinite(q.x)&&Number.isFinite(q.y)),`${f.id} coordinates finite`);
 const xs=p.map(q=>q.x),ys=p.map(q=>q.y);
 assert(Math.max(...xs)-Math.min(...xs)>2,`${f.id} has meaningful width`);
 assert(Math.max(...ys)-Math.min(...ys)>1.3,`${f.id} has meaningful height`);
}
for(const [w,h,n] of [[24,16,1],[24,16,2],[24,16,3],[24,16,6],[24,16,8],[24,16,10],[10,10,7],[30,20,10]]){
 let seed=987+n+w;const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const r=layout(w,h,n,forms,rng,5);
 assert.equal(r.beds.length,n,`${w}x${h}: ${n} cells created`);
 assert.equal(r.paths.length,5,'guide count remains independently configurable');
 for(const bed of r.beds){assert(bed.points.length>=48);assert(bed.cx>0&&bed.cx<w&&bed.cy>0&&bed.cy<h);}
 for(let i=0;i<r.beds.length;i++)for(let j=i+1;j<r.beds.length;j++){
  const A=r.beds[i]._collisionBounds,B=r.beds[j]._collisionBounds;
  const boxesSeparate=A.x+A.w<=B.x+1e-6||B.x+B.w<=A.x+1e-6||A.y+A.h<=B.y+1e-6||B.y+B.h<=A.y+1e-6;
  if(!boxesSeparate){
   const inside=(p,poly)=>{let c=false;for(let k=0,l=poly.length-1;k<poly.length;l=k++){const a=poly[k],b=poly[l];if(((a.y>p.y)!=(b.y>p.y))&&(p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x))c=!c}return c};
   const cross=(a,b,c,d)=>{const o=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);return o(a,b,c)*o(a,b,d)<-1e-8&&o(c,d,a)*o(c,d,b)<-1e-8};
   const pa=r.beds[i].points,pb=r.beds[j].points;let overlap=inside(pa[0],pb)||inside(pb[0],pa);
   for(let x=0;x<pa.length&&!overlap;x++)for(let y=0;y<pb.length&&!overlap;y++)overlap=cross(pa[x],pa[(x+1)%pa.length],pb[y],pb[(y+1)%pb.length]);
   assert(!overlap,`actual cell polygons overlap ${i}/${j} at ${w}x${h}`);
  }
 }
}
console.log('28 authored silhouettes; 1–10 cells; 1–8 guide lines; no cell-bound overlaps: PASS');
