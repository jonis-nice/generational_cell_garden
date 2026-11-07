const assert=require('assert');
function control(a,b){const forward=(a.x<b.x)||(Math.abs(a.x-b.x)<1e-7&&a.y<=b.y),u=forward?a:b,v=forward?b:a,dx=v.x-u.x,dy=v.y-u.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,key=[u.x,u.y,v.x,v.y].map(x=>Math.round(x*1000)/1000).join(':');let hash=2166136261;for(let j=0;j<key.length;j++)hash=Math.imul(hash^key.charCodeAt(j),16777619)>>>0;const sign=(hash&1)?1:-1,offset=Math.min(1.05,len*.018)*sign;return{x:(u.x+v.x)/2+nx*offset,y:(u.y+v.y)/2+ny*offset}}
const edges=[[{x:1,y:1},{x:4,y:2}],[{x:4,y:2},{x:3,y:6}],[{x:-2,y:3},{x:5,y:-1}],[{x:0,y:0},{x:.1,y:.1}]];
for(const [a,b] of edges){const p=control(a,b),q=control(b,a);assert(Math.abs(p.x-q.x)<1e-10&&Math.abs(p.y-q.y)<1e-10,'shared edge must use identical quadratic control point in either winding')}
const s=require('fs').readFileSync(require('path').join(__dirname,'..','app.js'),'utf8');assert(/function sharedMassPath/.test(s)&&/forward\?a:b/.test(s));
console.log(`shared edge curve: PASS (${edges.length} reversed-edge pairs share identical control points)`);
