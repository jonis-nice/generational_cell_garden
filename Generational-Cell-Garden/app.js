(()=>{'use strict';
const $=id=>document.getElementById(id),svg=$('plan'),NS='http://www.w3.org/2000/svg';
const state={W:24,H:16,zoom:1,tool:'select',beds:[],groups:[],paths:[],selected:null,selectedPlant:null,drawing:[],previewPoint:null,drawPointer:null,suppressClick:false,moveMode:false,undo:[],redo:[],grid:true};
const colors=['#b8b79c','#b8a99d','#b6a1a2','#a7b1a8','#a5aaa0','#c1b18a','#9eaaa5','#b5a6ad'];
const MASS_PALETTE=['#9da58d','#a99a87','#a58f91','#879b91','#b1a27e','#8d9ba0','#a88878','#929b83','#a7a08e','#899681','#aa9696','#8e9d98','#b09d83','#8b927f','#9e9084','#859492'];
function colourToHsl(hex){const m=String(hex||'#a5a58b').match(/[0-9a-f]{2}/gi)||['a5','a5','8b'];let r=parseInt(m[0],16)/255,g=parseInt(m[1],16)/255,b=parseInt(m[2],16)/255,max=Math.max(r,g,b),min=Math.min(r,g,b),h=0,s=0,l=(max+min)/2,d=max-min;if(d){s=d/(1-Math.abs(2*l-1));switch(max){case r:h=60*(((g-b)/d)%6);break;case g:h=60*((b-r)/d+2);break;default:h=60*((r-g)/d+4)}}return{h:(h+360)%360,s,l}}
function hslToColour(h,s,l){h=((h%360)+360)%360;s=clamp(s,0,1);l=clamp(l,0,1);const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;let r=0,g=0,b=0;if(h<60){r=c;g=x}else if(h<120){r=x;g=c}else if(h<180){g=c;b=x}else if(h<240){g=x;b=c}else if(h<300){r=x;b=c}else{r=c;b=x}return'#'+[r,g,b].map(v=>Math.round((v+m)*255).toString(16).padStart(2,'0')).join('')}
function speciesVisualKey(plant){
 const raw=String(plant?.latin||plant?.name||plant?.id||'unknown').toLowerCase()
  .replace(/[×’']/g,' ').replace(/[^a-z0-9 -]/g,' ').replace(/\\s+/g,' ').trim();
 // Cultivar names are excluded: all cultivars of the same botanical species share one visual identity.
 const words=raw.split(' ').filter(Boolean);
 return words.length>=2?words.slice(0,2).join('-'):raw;
}
function speciesVisualHash(value){
 let hash=2166136261;
 for(let i=0;i<String(value).length;i++)hash=Math.imul(hash^String(value).charCodeAt(i),16777619)>>>0;
 return hash>>>0;
}
function speciesVisualProfile(plant){
 const name=String(plant?.name||'').toLowerCase(),latin=String(plant?.latin||'').toLowerCase();
 const key=speciesVisualKey(plant),hash=speciesVisualHash(key);
 const green='#496b45',leaf='#91a982',bloom=botanicalBloomColor(plant);
 if(/rubus idaeus|hallon/.test(latin+' '+name))return {key,foliage:'#496b45',inner:'#9bb487',accent:'#b94d55',motif:'berry',symbol:'berryshrub'};
 if(/eutrochium|rosenflockel/.test(latin+' '+name))return {key,foliage:'#496b45',inner:'#d99aae',accent:'#a94f79',motif:'flowercluster',symbol:'eutrochium'};
 const flower=String(plant?.flowerColor||'').toLowerCase();
 let flowerHue=colourToHsl(bloom);
 if(/vit|cream/.test(flower)){flowerHue=colourToHsl('#e8dfc7')}
 else if(/gul/.test(flower)){flowerHue=colourToHsl('#d5bd62')}
 else if(/blå|violett|lila/.test(flower)){flowerHue=colourToHsl('#8985b5')}
 else if(/rosa|röd|purpur/.test(flower)){flowerHue=colourToHsl('#c47d98')}
 else if(/orange/.test(flower)){flowerHue=colourToHsl('#cf9258')}
 const inner=hslToColour(flowerHue.h,Math.max(.15,flowerHue.s*.35),.83);
 const accent=hslToColour(flowerHue.h,Math.max(.28,flowerHue.s*.82),.55);
 const motifs=['leafvein','flowerdots','stipple','ripple','cross','radial','diagonal','rosette'];
 return {key,foliage:green,inner,accent,motif:motifs[hash%motifs.length],symbol:symbolType(plant?.category,plant?.latin)};
}
function massColorFor(plant,index=0,neighbours=[]){
 const key=speciesVisualKey(plant),hash=speciesVisualHash(key);
 const base=colourToHsl(botanicalBloomColor(plant));
 // One deterministic mass colour per botanical species, not per generated cell.
 // Nearby species with similar bloom colours are separated by restrained value shifts.
 const hue=(base.h+((hash>>>8)%17)-8+360)%360;
 const lightness=[.78,.86,.70,.82,.90,.74,.84,.67][hash%8];
 const saturation=Math.min(.42,Math.max(.22,base.s*.88));
 return hslToColour(hue,saturation,lightness);
}
function massOutlineFor(fill){const c=colourToHsl(fill);return hslToColour(c.h,Math.min(.48,Math.max(.26,c.s*1.08)),.34)}
const clone=o=>JSON.parse(JSON.stringify(o)),id=()=>Math.random().toString(36).slice(2,10),clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const catalog=window.PLANT_CATALOG||[];
// Automatic composition is restricted to herbaceous perennial groups, including individually reviewed groundcover perennials. Shrubs, trees, climbers and unverified entries are excluded.
const AUTO_PERENNIAL_CATEGORIES=new Set(['Perenner','Prydnadsgräs','Lökväxter','Marktäckare']);
// Automatic composition is restricted to species with source-reviewed core profiles.
// Unreviewed entries remain visible in the manual catalogue but are not silently treated as compatible.
const autoPerennials=catalog.filter(p=>AUTO_PERENNIAL_CATEGORIES.has(p.category)&&p.compositionReview==='granskad_kallor'&&p.verifiedSource&&p.spreadRisk!=='high');
// Muted botanical bloom/foliage hues, assigned by species rather than one global green.
function botanicalColor(p){const s=((p.name||'')+' '+(p.latin||'')).toLowerCase();const rules=[
 [/salvia|nepeta|lavandula|agastache|perovskia|veronica|delphinium/,'#8580b5'],
 [/echinacea|rudbeckia|hemerocallis|lysimachia|adonis|helianthus/,'#c99a55'],
 [/geranium|phlox|monarda|dianthus|knautia|lythrum|dicentra|lamprocapnos/,'#b77d91'],
 [/alchemilla|astilbe|aruncus|sanguisorba|astrantia/,'#a7a66e'],
 [/stachys|pulmonaria|bergenia|hosta|heuchera/,'#879c91'],
 [/actaea|eutrochium|hylotelephium/,'#a68a9f'],
 [/iris|scilla|crocus|tulipa|allium|fritillaria|galanthus/,'#858eae'],
 [/hydrangea/,'#a5a0bd'],
 [/rosa|paeonia|alcea|chaenomeles|prunus/,'#b98291'],
 [/acer|cornus|buxus|taxus|picea|abies|pinus|juniperus|thuja|quercus|betula|fagus|carpinus|tilia|sorbus/,'#849477'],
 [/panicum|molinia|calamagrostis|deschampsia|sesleria|stipa|miscanthus/,'#9a9c72']
 ];let raw=null;for(const [re,c] of rules)if(re.test(s)){raw=c;break}if(!raw)raw=p.color&&p.color!=='#668b65'?p.color:'#a0a17b';const h=colourToHsl(raw);return hslToColour(h.h,Math.min(.34,h.s*.58),.64)}
catalog.forEach(p=>{p.color=botanicalColor(p)});
function snap(){state.undo.push(JSON.stringify({beds:state.beds,groups:state.groups,paths:state.paths}));if(state.undo.length>60)state.undo.shift();state.redo=[]}
function E(tag,attrs={},parent=svg){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));parent.appendChild(n);return n}
function point(e){const r=svg.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*1200,y=(e.clientY-r.top)/r.height*780;return{x:(x-80)/(1040/state.W),y:(y-50)/(680/state.H)}}
function screen(x,y){return{x:80+x*1040/state.W,y:50+y*680/state.H}}
const polygonPathCache=new Map();
function polygonPath(points){const cacheKey=state.W+'x'+state.H+'|'+points.map(p=>p.x+','+p.y).join(';');if(polygonPathCache.has(cacheKey))return polygonPathCache.get(cacheKey);const result=points.map((p,i)=>{const q=screen(p.x,p.y);return(i?'L':'M')+q.x.toFixed(1)+' '+q.y.toFixed(1)}).join(' ')+' Z';if(polygonPathCache.size>1200)polygonPathCache.clear();polygonPathCache.set(cacheKey,result);return result}
function inside(p,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){let a=poly[i],b=poly[j];if(((a.y>p.y)!==(b.y>p.y))&&(p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x))c=!c}return c}
function orientation(a,b,c){return (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x)}
function segmentsCross(a,b,c,d){
 const o1=orientation(a,b,c),o2=orientation(a,b,d),o3=orientation(c,d,a),o4=orientation(c,d,b);
 return ((o1>1e-8&&o2< -1e-8)||(o1< -1e-8&&o2>1e-8))&&((o3>1e-8&&o4< -1e-8)||(o3< -1e-8&&o4>1e-8));
}
function polygonsOverlap(a,b){
 if(!a?.length||!b?.length)return false;
 const A=bounds(a),B=bounds(b);
 if(A.x+A.w<=B.x+1e-5||B.x+B.w<=A.x+1e-5||A.y+A.h<=B.y+1e-5||B.y+B.h<=A.y+1e-5)return false;
 for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++){
  if(segmentsCross(a[i],a[(i+1)%a.length],b[j],b[(j+1)%b.length]))return true;
 }
 return inside(a[0],b)||inside(b[0],a);
}
function scalePolygon(poly,cx,cy,factor){return poly.map(p=>({x:cx+(p.x-cx)*factor,y:cy+(p.y-cy)*factor}))}
function convexHull(points){
 const pts=[...points].sort((a,b)=>a.x-b.x||a.y-b.y);
 if(pts.length<3)return pts;
 const cross=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
 const lower=[],upper=[];
 for(const q of pts){while(lower.length>=2&&cross(lower[lower.length-2],lower[lower.length-1],q)<=0)lower.pop();lower.push(q)}
 for(let i=pts.length-1;i>=0;i--){const q=pts[i];while(upper.length>=2&&cross(upper[upper.length-2],upper[upper.length-1],q)<=0)upper.pop();upper.push(q)}
 lower.pop();upper.pop();return lower.concat(upper);
}
function convexHullsOverlap(a,b){
 const axes=[];
 for(const poly of [a,b])for(let i=0;i<poly.length;i++){
  const p=poly[i],q=poly[(i+1)%poly.length],dx=q.x-p.x,dy=q.y-p.y,len=Math.hypot(dx,dy)||1;
  axes.push({x:-dy/len,y:dx/len});
 }
 for(const axis of axes){
  let amin=Infinity,amax=-Infinity,bmin=Infinity,bmax=-Infinity;
  for(const p of a){const v=p.x*axis.x+p.y*axis.y;amin=Math.min(amin,v);amax=Math.max(amax,v)}
  for(const p of b){const v=p.x*axis.x+p.y*axis.y;bmin=Math.min(bmin,v);bmax=Math.max(bmax,v)}
  if(amax<=bmin+1e-4||bmax<=amin+1e-4)return false;
 }
 return true;
}
function bedClearOfOthers(poly,beds){
 const hull=convexHull(poly),bb=bounds(poly);
 return beds.every(b=>{
  const other=b._collisionHull||convexHull(b.points),ob=b._collisionBounds||bounds(b.points);
  if(bb.x+bb.w<=ob.x+1e-4||ob.x+ob.w<=bb.x+1e-4||bb.y+bb.h<=ob.y+1e-4||ob.y+ob.h<=bb.y+1e-4)return true;
  // Conservative convex-hull exclusion: accepted outlines cannot intersect,
  // even if their concave details might otherwise permit a closer fit.
  return !convexHullsOverlap(hull,other);
 });
}
function centroid(poly){let x=0,y=0;poly.forEach(p=>{x+=p.x;y+=p.y});return{x:x/poly.length,y:y/poly.length}}
function area(poly){let a=0;for(let i=0,j=poly.length-1;i<poly.length;j=i++)a+=poly[j].x*poly[i].y-poly[i].x*poly[j].y;return Math.abs(a/2)}
function bounds(poly){return{x:Math.min(...poly.map(p=>p.x)),y:Math.min(...poly.map(p=>p.y)),w:Math.max(...poly.map(p=>p.x))-Math.min(...poly.map(p=>p.x)),h:Math.max(...poly.map(p=>p.y))-Math.min(...poly.map(p=>p.y))}}
function segmentDistance(a,b,c,d){
 const orient=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);
 const on=(p,q,r)=>Math.min(p.x,q.x)-1e-8<=r.x&&r.x<=Math.max(p.x,q.x)+1e-8&&Math.min(p.y,q.y)-1e-8<=r.y&&r.y<=Math.max(p.y,q.y)+1e-8;
 const o1=orient(a,b,c),o2=orient(a,b,d),o3=orient(c,d,a),o4=orient(c,d,b);
 if(((o1>0&&o2<0)||(o1<0&&o2>0))&&((o3>0&&o4<0)||(o3<0&&o4>0))||(Math.abs(o1)<1e-8&&on(a,b,c))||(Math.abs(o2)<1e-8&&on(a,b,d))||(Math.abs(o3)<1e-8&&on(c,d,a))||(Math.abs(o4)<1e-8&&on(c,d,b)))return 0;
 const pointSeg=(p,x,y)=>{const dx=y.x-x.x,dy=y.y-x.y,t=clamp(((p.x-x.x)*dx+(p.y-x.y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(p.x-x.x-t*dx,p.y-x.y-t*dy)};
 return Math.min(pointSeg(a,c,d),pointSeg(b,c,d),pointSeg(c,a,b),pointSeg(d,a,b));
}

function visualCellCenter(poly){
 const c=centroid(poly);
 if(inside(c,poly))return c;
 const b=bounds(poly),step=Math.max(.025,Math.min(b.w,b.h)/32);
 const distanceToEdge=p=>{
  let best=Infinity;
  for(let i=0;i<poly.length;i++){
   const a=poly[i],q=poly[(i+1)%poly.length],dx=q.x-a.x,dy=q.y-a.y;
   const t=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);
   best=Math.min(best,Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy));
  }
  return best;
 };
 let best=null,bestD=-1;
 for(let y=b.y+step/2;y<=b.y+b.h;y+=step){
  for(let x=b.x+step/2;x<=b.x+b.w;x+=step){
   const p={x,y};if(!inside(p,poly))continue;
   const d=distanceToEdge(p);if(d>bestD){best=p;bestD=d;}
  }
 }
 return best||c;
}

function polygonDistance(a,b){const A=bounds(a),B=bounds(b),dx=Math.max(0,A.x-(B.x+B.w),B.x-(A.x+A.w)),dy=Math.max(0,A.y-(B.y+B.h),B.y-(A.y+A.h)),lower=Math.hypot(dx,dy);if(lower>.85)return lower;const ca=centroid(a),cb=centroid(b),ra=Math.max(...a.map(p=>Math.hypot(p.x-ca.x,p.y-ca.y))),rb=Math.max(...b.map(p=>Math.hypot(p.x-cb.x,p.y-cb.y))),cd=Math.hypot(ca.x-cb.x,ca.y-cb.y);if(cd-ra-rb>.85)return cd-ra-rb;if(a.some(p=>inside(p,b))||b.some(p=>inside(p,a)))return 0;let d=Infinity;for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++){d=Math.min(d,segmentDistance(a[i],a[(i+1)%a.length],b[j],b[(j+1)%b.length]));if(d<.835)return d}return d}
// Fresh, geometry-led form library. These are generic design studies derived from
// the user's supplied plan references; no form is attributed to a named project.
const BED_FORM_LIBRARY=[
 {id:'hallonbat',label:'Hallonbåt',aspect:1.65,family:'hallonbat',power:3.8},
 {id:'halvmane',label:'Halvmåne',aspect:1.55,family:'halvmane',power:3.6},
 {id:'njurform',label:'Njurform',aspect:1.35,family:'njurform',power:3.5},
 {id:'bladform',label:'Bladform',aspect:2.0,family:'bladform',power:2.6},
 {id:'lansett',label:'Lansett med rundade spetsar',aspect:2.5,family:'lansett',power:2.8},
 {id:'batform',label:'Båtform',aspect:2.2,family:'batform',power:3.2},
 {id:'mjuktrapets',label:'Mjuk trapets',aspect:1.45,family:'mjuktrapets',power:5.2},
 {id:'rundadtriangel',label:'Rundad triangel',aspect:1.2,family:'rundadtriangel',power:2.8},
 {id:'droppform',label:'Droppform',aspect:1.35,family:'droppform',power:2.8},
 {id:'sadel',label:'Sadel / dubbelbukt',aspect:1.8,family:'sadel',power:3.6},
 {id:'sveptband',label:'Svept bandform',aspect:2.8,family:'sveptband',power:5.0},
 {id:'oval',label:'Mjuk oval',aspect:1.5,family:'oval',power:2.4},
 {id:'mjukrektangel',label:'Mjuk rektangel',aspect:1.55,family:'mjukrektangel',power:7.0},
 {id:'rundadkil',label:'Rundad kil',aspect:1.8,family:'rundadkil',power:3.4},
 {id:'snacka',label:'Snäckform',aspect:1.5,family:'snacka',power:3.1},
 {id:'boomerang',label:'Böjd boomerang',aspect:2.1,family:'boomerang',power:3.3},
 {id:'njurbat',label:'Njurbåt',aspect:1.7,family:'njurbat',power:3.4},
 {id:'asymmetriskoval',label:'Asymmetrisk oval',aspect:1.65,family:'asymmetriskoval',power:3.2},
 {id:'rundadskold',label:'Rundad sköld',aspect:1.25,family:'rundadskold',power:4.0},
 {id:'halvcirkel',label:'Halvcirkel med mjuk bas',aspect:1.45,family:'halvcirkel',power:3.0},
 {id:'bona',label:'Bönform',aspect:1.8,family:'bona',power:3.4},
 {id:'slinga',label:'Slingrande fält',aspect:2.0,family:'slinga',power:3.0},
 {id:'rundadpanel',label:'Rundad panel',aspect:1.5,family:'rundadpanel',power:6.0},
 {id:'mjukspets',label:'Mjuk spetsform',aspect:1.75,family:'mjukspets',power:3.0},
 {id:'asymmetric-panel',label:'Asymmetriskt fält med mjuka hörn',aspect:1.75,family:'asymmetric-panel',power:5.2},
 {id:'long-room',label:'Långsträckt planteringsrum',aspect:2.2,family:'long-room',power:5.2},
 {id:'swept-panel',label:'Svept fält med böjd långsida',aspect:2.0,family:'swept-panel',power:4.2},
 {id:'paired-room',label:'Tvådelat fält med mjuk midja',aspect:1.7,family:'paired-room',power:3.8}
];
const BED_FORM_ARCHETYPES=BED_FORM_LIBRARY;
function makeFlowBedShape(cx,cy,w,h,form,rotation,seed){return makeBedShape(cx,cy,w,h,form,rotation,seed)}
function makeBedShape(cx,cy,w,h,form,rotation,seed){
 let z=seed>>>0;const rand=()=>{z=(z*1664525+1013904223)>>>0;return z/4294967296};
 const family=form.family||'rounded-field',power=form.power||4.4,phase=rand()*Math.PI*2,ca=Math.cos(rotation),sa=Math.sin(rotation),pts=[],n=48;
 for(let i=0;i<n;i++){
  const a=i*Math.PI*2/n,co=Math.cos(a),si=Math.sin(a);
  // Superellipse: long straight-ish flanks with deliberately generous rounded corners.
  const norm=Math.pow(Math.pow(Math.abs(co),power)+Math.pow(Math.abs(si),power),-1/power);
  let x=co*norm*w*.5,y=si*norm*h*.5;
  const along=(co+1)*.5;
  // Named, deliberately authored silhouettes. These are repeatable design forms,
  // not random blobs: each family has its own stable contour logic.
  let radial=1;
  switch(family){
   case 'hallonbat': radial=.82+.18*Math.pow(Math.abs(co),.72);x*=1.08;y*=.88;break;
   case 'halvmane': radial=1+.20*Math.cos(a)-.48*Math.exp(-Math.pow((a-Math.PI)/.48,2));x+=w*.105;y*=.94;break;
   case 'njurform': radial=1-.43*Math.exp(-Math.pow((a-Math.PI)/.43,2));x*=1.02;break;
   case 'bladform': x=Math.sign(co)*Math.pow(Math.abs(co),.72)*w*.5;y=si*(.82+.18*Math.pow(Math.abs(co),.7))*h*.5;break;
   case 'lansett': x=Math.sign(co)*Math.pow(Math.abs(co),.48)*w*.5;y=si*(.48+.52*Math.pow(Math.abs(co),.62))*h*.5;break;
   case 'batform': radial=.66+.34*Math.pow(Math.abs(si),.8);x*=1.1;break;
   case 'mjuktrapets': x*=1+.13*si;y*=.94+.06*co;break;
   case 'rundadtriangel': radial=.79+.21*(.5+.5*Math.cos(3*a+Math.PI/2));break;
   case 'droppform': radial=1+.34*Math.sin(a);x*=.92;break;
   case 'sadel': radial=1+.24*Math.cos(2*a);y*=.88;break;
   case 'sveptband': y+=h*.11*Math.sin(co*Math.PI*.72);x*=1+.08*si;break;
   case 'oval': radial=1+.025*Math.cos(2*a);break;
   case 'mjukrektangel': radial=Math.pow(Math.pow(Math.abs(co),7)+Math.pow(Math.abs(si),7),-1/7)/Math.max(.001,norm);break;
   case 'rundadkil': x*=.58+.42*along;y*=.82+.18*along;break;
   case 'snacka': radial=.88+.20*Math.sin(a*2+.45)+.07*Math.cos(a*3);x+=w*.035*Math.cos(a*1.4);break;
   case 'boomerang': y+=h*.30*Math.sin(co*Math.PI*.78);x*=1-.20*Math.abs(si);break;
   case 'njurbat': radial=1-.36*Math.exp(-Math.pow((a-.2)/.48,2));x+=w*.045;break;
   case 'asymmetriskoval': radial=1+.09*Math.sin(a)+.035*Math.cos(3*a);break;
   case 'rundadskold': radial=1-.08*Math.cos(2*a);x*=.95+.05*co;break;
   case 'halvcirkel': y*=si>0?.52:1.0;x*=1+.035*si;break;
   case 'bona': radial=1+.25*Math.cos(a*2+.65);x*=1.06;break;
   case 'slinga': y+=h*.23*Math.sin(co*2.2+phase*.12);x+=w*.055*Math.sin(si*2);break;
   case 'rundadpanel': radial=Math.pow(Math.pow(Math.abs(co),6)+Math.pow(Math.abs(si),6),-1/6)/Math.max(.001,norm);break;
   case 'mjukspets': radial=.52+.48*along;y*=.78+.22*Math.abs(co);break;
  }
  x*=radial;y*=radial;
  if(family==='asymmetric-panel'){x*=1+.075*si;y+=h*.055*Math.sin(co*Math.PI*.72);if(co<-.35)y*=.94}
  if(family==='long-room'){y*=.91+.08*Math.cos(a*2);y+=h*.018*Math.sin(co*3.4+phase)}
  if(family==='soft-corner-strip'){x*=1+.025*si;y*=.86+.14*Math.pow(Math.abs(co),2)}
  if(family==='swept-panel'){y+=h*.14*Math.sin(co*Math.PI*.78+phase*.18);x+=w*.025*Math.sin(si*Math.PI)}
  if(family==='tapered-room'){y*=.64+.46*along;x+=w*.025*Math.sin(si*Math.PI)}
  if(family==='paired-room'){y+=h*.075*Math.exp(-Math.pow(co*3.1,2))*Math.sign(si);x*=1-.035*Math.exp(-Math.pow(co*4,2))}
  if(family==='curved-wedge'){y*=.72+.34*along;x+=w*.04*Math.sin(co*Math.PI*.7)}
  if(family==='stepped-soft'){x+=w*.035*Math.sign(si)*Math.exp(-Math.pow((co+.05)*3,2));y+=h*.025*Math.sin(co*2.4+phase)}
  if(family==='soft-trapezoid')x*=1+.12*si;
  if(family==='tapered-field')y*=.70+.42*along;
  if(family==='swept-field'||family==='long-curved-border')y+=h*.12*Math.sin(co*Math.PI*.82+phase*.25);
  if(family==='double-room')y+=h*.105*Math.exp(-Math.pow((co+.05)*3.2,2))*Math.sign(si);
  if(family==='rounded-corner-field'){
   const corner=Math.exp(-Math.pow((a-(Math.PI*.20+phase*.03))/.40,2));
   x-=w*.055*corner*Math.sign(co);y-=h*.045*corner*Math.sign(si);
  }
  if(family==='long-field'||family==='long-curved-border')y+=h*.012*Math.sin(co*5+phase);
  // Very restrained pencil irregularity. The authored silhouette remains dominant.
  const jitter=1+.008*Math.sin(a*5+phase)+.005*Math.sin(a*11-phase);
  x*=jitter;y*=jitter;
  pts.push({x:cx+x*ca-y*sa,y:cy+x*sa+y*ca});
 }
 return pts;
}

function pathPreview(points,close=false){if(points.length<2)return'';const p=points.map(v=>screen(v.x,v.y));let d=`M ${p[0].x} ${p[0].y}`;for(let i=1;i<p.length-1;i++){const mx=(p[i].x+p[i+1].x)/2,my=(p[i].y+p[i+1].y)/2;d+=` Q ${p[i].x} ${p[i].y} ${mx} ${my}`}const last=p[p.length-1];d+=` L ${last.x} ${last.y}`;if(close&&p.length>2)d+=' Z';return d}
function convexHull(points){const a=[...points].sort((p,q)=>p.x-q.x||p.y-q.y);if(a.length<3)return a;const cross=(o,x,y)=>(x.x-o.x)*(y.y-o.y)-(x.y-o.y)*(y.x-o.x),lo=[],hi=[];for(const q of a){while(lo.length>1&&cross(lo.at(-2),lo.at(-1),q)<=0)lo.pop();lo.push(q)}for(const q of [...a].reverse()){while(hi.length>1&&cross(hi.at(-2),hi.at(-1),q)<=0)hi.pop();hi.push(q)}lo.pop();hi.pop();return lo.concat(hi)}
function clipHalfPlane(poly,nx,ny,c){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=nx*a.x+ny*a.y-c,db=nx*b.x+ny*b.y-c,ina=da<=1e-8,inb=db<=1e-8;if(ina)out.push(a);if(ina!==inb){const t=da/(da-db);out.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t})}}return out}
function smoothClosed(poly,passes=2){let pts=poly;for(let k=0;k<passes;k++){const out=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];out.push({x:a.x*.75+b.x*.25,y:a.y*.75+b.y*.25},{x:a.x*.25+b.x*.75,y:a.y*.25+b.y*.75})}pts=out}return pts}

function generateBedLayout(w,h,count,forms,rng,lineCount=2,compositionPattern='mixed'){
 // Designed field layout: a 2-D family of authored silhouettes, arranged as
 // one composition. Guide curves modulate the field; they never create a row
 // of beads and never run through the center of a bed as a visible spine.
 const margin=Math.max(.22,Math.min(w,h)*.018),usableW=w-2*margin,usableH=h-2*margin;
 const seed=Math.floor(rng()*0xffffffff),phase=(seed%10000)/10000*Math.PI*2;
 const compositionNames={oak:'leaf-vein-field',river:'meandering-river-field',branching:'branching-garden-rooms',spiral:'spiral-field',braid:'braided-composition',grove:'linked-groves',radial:'radial-garden',contour:'contour-terraces'};
 const selectedComposition=compositionPattern==='mixed'?['oak','river','branching','spiral','braid','grove','radial','contour'][seed%8]:compositionPattern;
 const composition=compositionNames[selectedComposition]||'mixed-naturalistic-field';
 const nLines=clamp(Math.round(+lineCount||1),1,8);
 const rows=Math.max(1,Math.round(Math.sqrt(count*h/w))),cols=Math.ceil(count/rows);
 const cellW=usableW/cols,cellH=usableH/rows;
 const guides=[];
 for(let i=0;i<nLines;i++){
  const v=(i+1)/(nLines+1),pts=[];
  for(let j=0;j<=40;j++){
   const u=j/40,yy=margin+usableH*(v+.025*Math.sin(u*Math.PI*2+phase+i*.83));
   pts.push({x:margin+u*usableW,y:clamp(yy,margin,h-margin)});
  }
  guides.push({id:`guide-${i+1}`,kind:'composition-boundary-guide',points:pts});
 }
 const beds=[],pool=[...forms],centers=[];
 for(let i=0;i<count;i++){
  const row=Math.floor(i/cols),col=i%cols,remaining=count-row*cols;
  const rowCols=Math.min(cols,remaining);
  const stagger=row%2?.018:-.012;
  let u=(col+.5+stagger)/cols,v=(row+.5)/rows;
  // A shared gentle sweep gives the field a common direction without making
  // the cells follow a single line.
  const sweep=.012*Math.sin(u*Math.PI*2+phase)+.006*Math.sin(u*Math.PI*4-phase*.4);
  let warp=0;
  if(selectedComposition==='oak')warp=.055*Math.sin(u*Math.PI*2+phase)*(row%2?1:-1);
  else if(selectedComposition==='river')warp=.095*Math.sin(u*Math.PI*2+phase);
  else if(selectedComposition==='branching')warp=(col%2?1:-1)*.045*Math.sin((u+.12)*Math.PI);
  else if(selectedComposition==='spiral')warp=.075*Math.sin(u*Math.PI*2+phase+v*Math.PI);
  else if(selectedComposition==='braid')warp=.065*Math.sin(u*Math.PI*4+phase);
  else if(selectedComposition==='grove')warp=.045*Math.sin((u*2+Math.floor(col/2)*.35)*Math.PI);
  else if(selectedComposition==='radial')warp=.06*Math.cos((u-.5)*Math.PI*2+phase);
  else if(selectedComposition==='contour')warp=.08*Math.sin(u*Math.PI*3+phase);
  v=clamp(v+(sweep+warp)/Math.max(.6,rows),.08,.92);
  const cx=margin+u*usableW+(rng()-.5)*cellW*.012;
  const cy=margin+v*usableH+(rng()-.5)*cellH*.012;
  const form=forms.length===1?forms[0]:(pool.length?pool.splice(Math.floor(rng()*pool.length),1)[0]:BED_FORM_LIBRARY[(i+seed)%BED_FORM_LIBRARY.length]);
  // Each authored silhouette fills its allocated planting room. Its contour
  // family, not a skinny aspect-ratio fit, supplies the distinctive geometry.
  let bedW=cellW*.96,bedH=cellH*.96;
  // A small range of purposeful size hierarchy, while preserving each cell's
  // allocated room and the overall density of the composition.
  const scale=[1,.94,.98,.91,1.02,.96][i%6];bedW*=scale;bedH*=scale;
  const rotation=(row%2?.025:-.018)+(col%2?.012:-.01)+(rng()-.5)*.012;
  const raw=makeBedShape(cx,cy,bedW,bedH,form,rotation,seed+i*7919);
  const fullPoints=smoothClosed(raw,2);let points=null,fitScale=1;
  for(let sc=1;sc>=.62;sc-=.04){
   const candidate=scalePolygon(fullPoints,cx,cy,sc);
   if(candidate.every(q=>q.x>=margin&&q.x<=w-margin&&q.y>=margin&&q.y<=h-margin)&&bedClearOfOthers(candidate,beds)){
    points=candidate;fitScale=sc;break;
   }
  }
  if(!points)continue;
  const bb=bounds(points);
  beds.push({id:id(),points,shape:form.id,formLabel:form.label,project:'',projectCountry:'',
   composition:'authored-silhouette-field',compositionId:composition,compositionPath:'shared-field',
   pathIndex:0,pathT:i/Math.max(1,count-1),junctions:[],_collisionHull:convexHull(points),_collisionBounds:bb,
   spineIndex:i,strandIndex:0,spineT:i/Math.max(1,count-1),rotation,cx,cy,w:bb.w,h:bb.h,
   fitScale,overlapChecked:true,flowTangent:rotation,shapeClass:form.family});
  centers.push({x:cx,y:cy,index:i,row,col,form:form.id});
 }
 return{beds,cols,rows,gap:Math.min(cellW,cellH)*.045,composition,strandCount:nLines,lineCount:nLines,
  paths:guides.map(g=>({id:g.id,kind:g.kind,length:g.points.length,junctions:[]})),centers,
  coverage:beds.reduce((sum,b)=>sum+area(b.points),0)/(usableW*usableH)};
}

function distanceColour(a,b){
 const ca=window.PLANT_AESTHETICS?.colourOf(a)||'',cb=window.PLANT_AESTHETICS?.colourOf(b)||'';
 return ca===cb?0:1;
}
function latinCode(latin=''){const genus=String(latin).trim().split(/\\s+/)[0].replace(/[^A-Za-z×]/g,'');return genus?genus.slice(0,3).replace(/^./,c=>c.toUpperCase()):' sp.'} function shortCode(name=''){return name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-zÅÄÖåäö]/g,'').slice(0,3).toUpperCase()}
function addDefs(){const d=E('defs');const f=E('filter',{id:'pencil',x:'-20%',y:'-20%',width:'140%',height:'140%'},d);E('feTurbulence',{type:'fractalNoise',baseFrequency:'.8',numOctaves:'2',seed:'8',result:'noise'},f);E('feDisplacementMap',{in:'SourceGraphic',in2:'noise',scale:'.45',xChannelSelector:'R',yChannelSelector:'G'},f)}
function drawSymbol(g,p,scale=1){
 const q=screen(p.x,p.y),r=(p.d||.45)*1040/state.W*.48*scale,c=p.color||'#87977d',bloom=p.bloomColor||c,type=p.symbol||symbolType(p.category,p.latin);let grp=E('g',{transform:`translate(${q.x} ${q.y}) rotate(${p.rotation||0})`,filter:'url(#pencil)'},g);
 const pen=(p.strokeWidth||.72)*(p.sketch?(.72+p.sketch*.18):.8);
 // A subtle but explicit individual plant contour makes every generated/manual specimen locatable.
 
 const path=(d,attrs={})=>E('path',{d,fill:'none',stroke:c,'stroke-width':pen,'stroke-linecap':'round','stroke-linejoin':'round',...attrs},grp);
 const leaf=(x,y,rx,ry,rot=0,opacity=.18)=>E('ellipse',{cx:x,cy:y,rx,ry,transform:`rotate(${rot} ${x} ${y})`,fill:c,'fill-opacity':opacity,stroke:c,'stroke-width':pen*.78},grp);
 const petal=(x,y,rx,ry,rot=0,opacity=.48)=>E('ellipse',{cx:x,cy:y,rx,ry,transform:`rotate(${rot} ${x} ${y})`,fill:bloom,'fill-opacity':opacity,stroke:bloom,'stroke-opacity':.78,'stroke-width':pen*.72},grp);
 const dot=(x,y,rr,col=c,opacity=.55)=>E('circle',{cx:x,cy:y,r:rr,fill:col,'fill-opacity':opacity,stroke:col,'stroke-width':pen*.62},grp);
 // Botanically differentiated, strictly top-down marks. Each mark combines foliage and inflorescence.
 if(type==='eutrochium'){
   for(let i=0;i<5;i++){const a=i*Math.PI*2/5,rr=r*(i===0?.12:.48),cx=Math.cos(a)*rr,cy=Math.sin(a)*rr;
    for(let j=0;j<9;j++){const b=j*Math.PI*2/9,px=cx+Math.cos(b)*r*.105,py=cy+Math.sin(b)*r*.105;petal(px,py,r*.052,r*.072,b*180/Math.PI,.94)}
    dot(cx,cy,r*.045,'#784b5d',.95);
   }
   for(let i=0;i<5;i++){const a=i*Math.PI*2/5;leaf(Math.cos(a)*r*.63,Math.sin(a)*r*.63,r*.065,r*.22,a*180/Math.PI,.36)}
  }else if(type==='berryshrub'){
   for(let i=0;i<9;i++){const a=i*2.399,rr=r*(.16+(i%4)*.16),x=Math.cos(a)*rr,y=Math.sin(a)*rr;leaf(x,y,r*.10,r*.22,a*180/Math.PI,.42)}
   for(let i=0;i<7;i++){const a=i*2.4,rr=r*(.18+(i%3)*.13);dot(Math.cos(a)*rr,Math.sin(a)*rr,r*.075,bloom,.98)}
   path(`M ${-r*.45} ${r*.05} Q 0 ${-r*.42} ${r*.45} ${r*.08}`,{'stroke-width':.9,'stroke':c});
  }else if(type==='lavender'){
   // Dense, coarse stippling: compact flower spikes viewed from above.
   for(let i=0;i<34;i++){const a=i*2.399,rr=r*(.12+(i%7)*.105),x=Math.cos(a)*rr,y=Math.sin(a)*rr;dot(x,y,r*(.045+(i%3)*.008),bloom,.88);if(i%3===0)path(`M 0 0 L ${x} ${y}`,{'stroke-width':.5,'stroke-opacity':.48})}
   for(let i=0;i<7;i++){const a=i*Math.PI*2/7;leaf(Math.cos(a)*r*.42,Math.sin(a)*r*.42,r*.035,r*.28,a*180/Math.PI,.2)}
 }else if(type==='snowdrop'){
   // Fine green outline and pale hanging bells, represented as cream stippled lobes.
   for(let i=0;i<5;i++){const a=i*Math.PI*2/5,x=Math.cos(a),y=Math.sin(a);path(`M 0 0 Q ${x*r*.32-y*r*.08} ${y*r*.32+x*r*.08} ${x*r*.76} ${y*r*.76}`,{'stroke-width':.8,'stroke': '#718b68'});E('ellipse',{cx:x*r*.66,cy:y*r*.66,rx:r*.085,ry:r*.14,transform:`rotate(${a*180/Math.PI} ${x*r*.66} ${y*r*.66})`,fill:'#eee8d5','fill-opacity':.95,stroke:'#9b9b83','stroke-width':.55},grp)}
   dot(0,0,r*.045,'#718b68',.75)
 }else if(type==='grass'){
   for(let i=0;i<25;i++){let a=i*Math.PI*2/25,rr=r*(.55+((i*7)%7)*.045),bend=((i%5)-2)*r*.035,x=Math.cos(a),y=Math.sin(a);path(`M ${-y*bend} ${x*bend} Q ${x*r*.22-y*bend} ${y*r*.22+x*bend} ${x*rr} ${y*rr}`,{'stroke-width':.55+(i%4)*.07,'stroke-opacity':.8})}
   for(let i=0;i<7;i++){let a=i*2.399,rr=r*(.12+(i%3)*.07);path(`M 0 0 Q ${Math.cos(a)*r*.22} ${Math.sin(a)*r*.22} ${Math.cos(a)*rr} ${Math.sin(a)*rr}`,{'stroke-width':.5})}
 }else if(type==='echinacea'||type==='rudbeckia'){
   for(let i=0;i<10;i++){let a=i*Math.PI*2/10;leaf(Math.cos(a)*r*.35,Math.sin(a)*r*.35,r*.09,r*.25,a*180/Math.PI,.12)}
   const n=type==='echinacea'?13:15;for(let i=0;i<n;i++){let a=i*Math.PI*2/n;petal(Math.cos(a)*r*.31,Math.sin(a)*r*.31,r*.075,r*.22,a*180/Math.PI,.72)}
   dot(0,0,r*.16,type==='echinacea'?'#8c6950':'#292820',.96);for(let i=0;i<15;i++){let a=i*2.4;dot(Math.cos(a)*r*.105,Math.sin(a)*r*.105,r*.025,type==='rudbeckia'?'#e2bd4c':'#d8bd83',.96)}
 }else if(type==='salvia'){
   for(let i=0;i<6;i++){let a=i*Math.PI/3;leaf(Math.cos(a)*r*.25,Math.sin(a)*r*.25,r*.12,r*.31,a*180/Math.PI,.16)}
   for(let i=0;i<7;i++){let a=i*.9-.5,x=Math.cos(a),y=Math.sin(a);path(`M 0 0 Q ${x*r*.25} ${y*r*.25} ${x*r*.68} ${y*r*.68}`,{'stroke-width':.65,'stroke':bloom})}
   for(let i=0;i<13;i++){let a=i*.83;petal(Math.cos(a)*r*.52,Math.sin(a)*r*.52,r*.045,r*.085,a*180/Math.PI,.85)}
 }else if(type==='geranium'){
   for(let i=0;i<5;i++){let a=i*Math.PI*2/5,x=Math.cos(a),y=Math.sin(a);petal(x*r*.22,y*r*.22,r*.17,r*.22,a*180/Math.PI,.52);leaf(x*r*.59,y*r*.59,r*.10,r*.22,a*180/Math.PI,.16)}dot(0,0,r*.055,'#d8bd83',.9)
 }else if(type==='alchemilla'){
   for(let i=0;i<9;i++){let a=i*Math.PI*2/9,x=Math.cos(a),y=Math.sin(a);path(`M 0 0 Q ${x*r*.35-y*r*.08} ${y*r*.35+x*r*.08} ${x*r*.78} ${y*r*.78} Q ${x*r*.48} ${y*r*.55} 0 0 Z`,{fill:c,'fill-opacity':.12})}
   for(let i=0;i<12;i++){let a=i*2.4;dot(Math.cos(a)*r*.18,Math.sin(a)*r*.18,r*.035,'#d5c77d',.75)}
 }else if(type==='nepeta'){
   for(let i=0;i<18;i++){const a=i*2.399,rr=r*(.15+(i%5)*.12),x=Math.cos(a)*rr,y=Math.sin(a)*rr;leaf(x,y,r*.075,r*.19,(i*41)%180,.17);if(i%2===0)dot(x+r*.04,y-r*.03,r*.045,bloom,.82)}
 }else if(type==='ground'){
   for(let i=0;i<22;i++){let a=i*2.399,rr=r*(.12+(i%5)*.13),x=Math.cos(a)*rr,y=Math.sin(a)*rr;leaf(x,y,r*.075,r*.16,(i*47)%180,.2)}
   for(let i=0;i<11;i++){let a=i*2.4,rr=r*(.18+(i%4)*.12);petal(Math.cos(a)*rr,Math.sin(a)*rr,r*.035,r*.075,a*180/Math.PI,.8)}
 }else if(type==='daisy'||type==='umbel'||type==='panicle'||type==='rosette'){
   const count=type==='daisy'?12:type==='umbel'?9:type==='panicle'?17:8;for(let i=0;i<count;i++){let a=i*2.399,rr=type==='panicle'?r*(.18+(i%5)*.12):r*.42,x=Math.cos(a)*rr,y=Math.sin(a)*rr;if(type==='daisy')petal(x,y,r*.055,r*.17,a*180/Math.PI,.7);else if(type==='umbel'){path(`M 0 0 Q ${x*.45} ${y*.45} ${x} ${y}`,{'stroke-width':.55});dot(x,y,r*.045,bloom,.8)}else if(type==='panicle'){path(`M 0 0 Q ${x*.6-r*.03} ${y*.6+r*.03} ${x} ${y}`,{'stroke-width':.55,'stroke':bloom});dot(x,y,r*.035,bloom,.7)}else leaf(x,y,r*.10,r*.22,a*180/Math.PI,.18)}dot(0,0,r*.08,type==='daisy'?'#c3a35e':c,.8)
 }else if(type==='bulb'){
   for(let i=0;i<6;i++){let a=i*Math.PI/3;petal(Math.cos(a)*r*.27,Math.sin(a)*r*.27,r*.12,r*.24,a*180/Math.PI,.72)}dot(0,0,r*.10,'#b99b62',.8)
 }else if(type==='shrub'||type==='shrubTree'){
   for(let i=0;i<21;i++){let a=i*2.399,rr=r*(.08+(i%5)*.13),x=Math.cos(a)*rr,y=Math.sin(a)*rr;leaf(x,y,r*.15,r*.12,(i*31)%180,.16)}
   path(`M ${-r*.52} ${r*.06} Q ${-r*.42} ${-r*.42} ${-r*.05} ${-r*.46} Q ${r*.42} ${-r*.48} ${r*.5} ${-r*.08} Q ${r*.53} ${r*.34} ${r*.13} ${r*.48} Q ${-r*.32} ${r*.52} ${-r*.52} ${r*.06} Z`,{'stroke-width':.85})
 }else if(type==='eryngium'){
   // Spiky thistle-like star: sharp bracts around a dense central head.
   for(let i=0;i<11;i++){const a=i*Math.PI*2/11,x=Math.cos(a),y=Math.sin(a);path(`M ${x*r*.12} ${y*r*.12} L ${x*r*.78} ${y*r*.78} L ${x*r*.61-y*r*.07} ${y*r*.61+x*r*.07} Z`,{fill:bloom,'fill-opacity':.18,stroke:bloom,'stroke-width':.85})}dot(0,0,r*.17,'#526d76',.9);for(let i=0;i<18;i++){const a=i*2.4;dot(Math.cos(a)*r*.11,Math.sin(a)*r*.11,r*.025,'#e0d7bf',.9)}
 }else if(type==='sanguisorba'){
   // Fine bottlebrush / burnet heads, drawn as irregular stippled ellipses on fine stalks.
   for(let j=0;j<3;j++){const a=j*2.1-.8,x=Math.cos(a),y=Math.sin(a);path(`M 0 0 Q ${x*r*.28} ${y*r*.28} ${x*r*.62} ${y*r*.62}`,{'stroke-width':.65});for(let i=0;i<13;i++){const t=i/13,off=(i%2?1:-1)*r*.045;dot(x*r*(.43+t*.22)-y*off,y*r*(.43+t*.22)+x*off,r*.035,bloom,.88)}}
 }else if(type==='liatris'){
   for(let j=0;j<3;j++){const a=j*2.1;path(`M 0 0 L ${Math.cos(a)*r*.68} ${Math.sin(a)*r*.68}`,{'stroke-width':.7});for(let i=0;i<9;i++){const t=.2+i*.065;dot(Math.cos(a)*r*t,Math.sin(a)*r*t,r*.055,bloom,.9)}}
 }else if(type==='monarda'){
   for(let i=0;i<8;i++){const a=i*Math.PI/4;path(`M 0 0 Q ${Math.cos(a)*r*.25} ${Math.sin(a)*r*.25} ${Math.cos(a)*r*.72} ${Math.sin(a)*r*.72}`,{'stroke-width':.7,'stroke':bloom});petal(Math.cos(a)*r*.62,Math.sin(a)*r*.62,r*.06,r*.16,a*180/Math.PI,.85)}dot(0,0,r*.10,'#665c4e',.9)
 }else if(type==='amsonia'){
   for(let i=0;i<5;i++){const a=i*Math.PI*2/5;petal(Math.cos(a)*r*.25,Math.sin(a)*r*.25,r*.11,r*.22,a*180/Math.PI,.75)}for(let i=0;i<5;i++){const a=i*Math.PI*2/5;leaf(Math.cos(a)*r*.58,Math.sin(a)*r*.58,r*.06,r*.2,a*180/Math.PI,.16)}dot(0,0,r*.035,'#d5c99d',.8)
 }else if(type==='digitalis'){
   for(let j=-1;j<=1;j++){const x=j*r*.18;path(`M 0 ${r*.4} Q ${x-r*.08} 0 ${x} ${-r*.55}`,{'stroke-width':.75,'stroke':c});for(let i=0;i<5;i++){const y=r*.22-i*r*.17;E('ellipse',{cx:x+(i%2?-.06:.06)*r,cy:y,rx:r*.085,ry:r*.12,fill:bloom,'fill-opacity':.58,stroke:c,'stroke-width':.55},grp)}}
 }else if(type==='sphere'){
   for(let i=0;i<36;i++){const a=i*2.399,rr=r*Math.sqrt((i+.5)/36);dot(Math.cos(a)*rr,Math.sin(a)*rr,r*(.018+(i%3)*.006),bloom,.9)}path(`M ${-r*.34} ${r*.05} Q 0 ${-r*.5} ${r*.34} ${r*.05} Q 0 ${r*.5} ${-r*.34} ${r*.05} Z`,{'stroke-width':.65,'stroke':c});
 }else if(type==='lily'){
   for(let i=0;i<6;i++){const a=i*Math.PI/3;petal(Math.cos(a)*r*.28,Math.sin(a)*r*.28,r*.095,r*.39,a*180/Math.PI,.62)}dot(0,0,r*.07,'#c49c53',.92);for(let i=0;i<5;i++){const a=i*2.4;dot(Math.cos(a)*r*.11,Math.sin(a)*r*.11,r*.018,'#66513b',.9)}
 }else if(type==='starflower'){
   for(let i=0;i<5;i++){const a=i*Math.PI*2/5;petal(Math.cos(a)*r*.25,Math.sin(a)*r*.25,r*.10,r*.34,a*180/Math.PI,.62)}dot(0,0,r*.075,'#b99a5d',.92);
 }else if(type==='spike'){
   for(let j=-1;j<=1;j++){const x=j*r*.19;path(`M 0 ${r*.48} Q ${x-r*.04} 0 ${x} ${-r*.58}`,{'stroke-width':.7});for(let i=0;i<8;i++){const y=r*.28-i*r*.105;petal(x+(i%2?-.045:.045)*r,y,r*.055,r*.095,(i%2?25:-25),.78)}}
 }else if(type==='bell'){
   for(let i=0;i<5;i++){const a=i*Math.PI*2/5,x=Math.cos(a),y=Math.sin(a);path(`M 0 0 Q ${x*r*.35-y*r*.1} ${y*r*.35+x*r*.1} ${x*r*.66} ${y*r*.66}`,{'stroke-width':.75});E('path',{d:`M ${x*r*.66} ${y*r*.66} q ${-y*r*.11} ${x*r*.08} ${-x*r*.04} ${r*.17} q ${x*r*.13} ${r*.06} ${x*r*.22} ${-r*.04}`,fill:'#eee8d6',stroke:'#829274','stroke-width':.65},grp)}
 }else if(type==='cup'){
   for(let i=0;i<6;i++){const a=i*Math.PI/3;petal(Math.cos(a)*r*.2,Math.sin(a)*r*.2,r*.10,r*.28,a*180/Math.PI,.68)}E('circle',{cx:0,cy:0,r:r*.14,fill:bloom,'fill-opacity':.72,stroke:c,'stroke-width':.6},grp);dot(0,0,r*.055,'#d3ae50',.95)
 }else if(type==='rosetteSpotted'){
   for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=r*.31;E('path',{d:`M 0 0 Q ${Math.cos(a-.22)*r*.24} ${Math.sin(a-.22)*r*.24} ${Math.cos(a)*r*.78} ${Math.sin(a)*r*.78} Q ${Math.cos(a+.2)*r*.38} ${Math.sin(a+.2)*r*.38} 0 0 Z`,fill:c,'fill-opacity':.12,stroke:c,'stroke-width':.72},grp)}for(let i=0;i<9;i++){const a=i*2.399,rr=r*(.18+(i%3)*.09);dot(Math.cos(a)*rr,Math.sin(a)*rr,r*.025,bloom,.72)}
 }else if(type==='dotmat'){
   for(let i=0;i<42;i++){const a=i*2.399,rr=r*Math.sqrt((i+.5)/42);dot(Math.cos(a)*rr,Math.sin(a)*rr,r*(.018+(i%4)*.008),i%5===0?bloom:c,.78)}
 }else if(type==='arch'){
   for(let j=-1;j<=1;j++){const x=j*r*.22;path(`M ${x-r*.18} ${r*.38} Q ${x-r*.34} ${-r*.3} ${x} ${-r*.48} Q ${x+r*.34} ${-r*.3} ${x+r*.18} ${r*.38}`,{'stroke-width':.78});for(let i=0;i<5;i++){const y=r*.22-i*r*.14;petal(x+(i%2?-.08:.08)*r,y,r*.07,r*.11,0,.76)}}
 }else if(type==='spire'){
   for(let j=-1;j<=1;j++){const x=j*r*.18;path(`M 0 ${r*.48} Q ${x-r*.04} 0 ${x} ${-r*.62}`,{'stroke-width':.78});for(let i=0;i<7;i++){const y=r*.3-i*r*.13;E('ellipse',{cx:x+(i%2?-.07:.07)*r,cy:y,rx:r*.09,ry:r*.07,fill:bloom,'fill-opacity':.58,stroke:c,'stroke-width':.5},grp)}}
 }else if(type==='peony'){
   for(let i=0;i<3;i++){const n=8+i*2;for(let j=0;j<n;j++){const a=j*Math.PI*2/n+i*.17,rr=r*(.16+i*.17);petal(Math.cos(a)*rr,Math.sin(a)*rr,r*(.09+i*.018),r*(.15+i*.018),a*180/Math.PI,.38+i*.12)}}dot(0,0,r*.09,'#b79a68',.85);
 }else if(type==='iris'){
   for(let i=0;i<3;i++){const a=i*Math.PI*2/3;petal(Math.cos(a)*r*.24,Math.sin(a)*r*.24,r*.11,r*.39,a*180/Math.PI,.55);path(`M 0 0 Q ${Math.cos(a)*r*.25} ${Math.sin(a)*r*.25} ${Math.cos(a)*r*.76} ${Math.sin(a)*r*.76}`,{'stroke-width':.7})}dot(0,0,r*.06,'#d2bd75',.9);
 }else if(type==='echinops'){
   for(let i=0;i<42;i++){const a=i*2.399,rr=r*Math.sqrt((i+.5)/42);dot(Math.cos(a)*rr,Math.sin(a)*rr,r*.035,bloom,.92)}path(`M ${-r*.48} 0 Q 0 ${-r*.52} ${r*.48} 0 Q 0 ${r*.52} ${-r*.48} 0 Z`,{'stroke-width':.75,'stroke':c});
 }else if(type==='button'){
   for(let i=0;i<24;i++){const a=i*2.399,rr=r*(.15+(i%4)*.16);dot(Math.cos(a)*rr,Math.sin(a)*rr,r*.045,bloom,.9)}dot(0,0,r*.10,'#5e5444',.85);
 }else if(type==='phlox'){
   for(let i=0;i<5;i++){const a=i*Math.PI*2/5;petal(Math.cos(a)*r*.24,Math.sin(a)*r*.24,r*.14,r*.18,a*180/Math.PI,.62)}dot(0,0,r*.055,'#e4d8bd',.9);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;dot(Math.cos(a)*r*.42,Math.sin(a)*r*.42,r*.035,bloom,.8)}
 }else if(type==='carnation'){
   // Fringed five-petal Dianthus flower: narrow, notched petals and a small central eye.
   for(let i=0;i<5;i++){const a=i*Math.PI*2/5,x=Math.cos(a),y=Math.sin(a);E('path',{d:`M ${x*r*.08-y*r*.04} ${y*r*.08+x*r*.04} Q ${x*r*.25-y*r*.13} ${y*r*.25+x*r*.13} ${x*r*.48} ${y*r*.48} Q ${x*r*.39-y*r*.06} ${y*r*.39+x*r*.06} ${x*r*.34} ${y*r*.58} Q ${x*r*.62} ${y*r*.55} ${x*r*.66} ${y*r*.31} Q ${x*r*.38} ${y*r*.12} ${x*r*.08-y*r*.04} ${y*r*.08+x*r*.04} Z`,fill:bloom,'fill-opacity':.52,stroke:c,'stroke-width':pen*.8},grp);for(let j=0;j<3;j++){const t=j/3;path(`M ${x*r*(.3+t*.08)} ${y*r*(.3+t*.08)} l ${-y*r*.035} ${x*r*.035}`,{'stroke-width':pen*.55})}}dot(0,0,r*.055,'#b89c65',.9)
 }else if(type==='anemone'){
   for(let i=0;i<8;i++){const a=i*Math.PI/4;petal(Math.cos(a)*r*.3,Math.sin(a)*r*.3,r*.085,r*.23,a*180/Math.PI,.52)}dot(0,0,r*.13,'#37342d',.95);for(let i=0;i<14;i++){const a=i*2.399;dot(Math.cos(a)*r*.12,Math.sin(a)*r*.12,r*.025,'#d0b66e',.95)}
 }else if(type==='succulent'){
   for(let i=0;i<3;i++){const n=7+i*2;for(let j=0;j<n;j++){const a=j*Math.PI*2/n+i*.24,rr=r*(.12+i*.17);leaf(Math.cos(a)*rr,Math.sin(a)*rr,r*.065,r*.17,a*180/Math.PI,.25)}}dot(0,0,r*.045,bloom,.8);
 }else if(type==='finegrass'){
   for(let i=0;i<31;i++){const a=(i/31)*Math.PI*2,rr=r*(.45+(i%5)*.09),bend=(randSeed(p,i)-.5)*r*.14;path(`M ${-Math.sin(a)*bend} ${Math.cos(a)*bend} Q ${Math.cos(a)*r*.22} ${Math.sin(a)*r*.22} ${Math.cos(a)*rr} ${Math.sin(a)*rr}`,{'stroke-width':.38+(i%3)*.08,'stroke-opacity':.82})}
 }else if(type==='featherygrass'){
   for(let i=0;i<19;i++){const a=i*Math.PI*2/19,x=Math.cos(a),y=Math.sin(a),end=r*(.55+(i%4)*.08);path(`M 0 0 Q ${x*r*.24-y*r*.04} ${y*r*.24+x*r*.04} ${x*end} ${y*end}`,{'stroke-width':.72,'stroke':c});for(let j=1;j<5;j++){const t=j/5,px=x*end*t,py=y*end*t;path(`M ${px} ${py} l ${-y*r*.07} ${x*r*.07}`,{'stroke-width':.42,'stroke-opacity':.65})}}
 }else{
   for(let i=0;i<7;i++){let a=i*Math.PI*2/7;leaf(Math.cos(a)*r*.30,Math.sin(a)*r*.30,r*.12,r*.25,a*180/Math.PI,.16);petal(Math.cos(a)*r*.16,Math.sin(a)*r*.16,r*.07,r*.13,a*180/Math.PI,.45)}dot(0,0,r*.09,'#b49a68',.7)
 }
 // Delicate irregular pencil ticks, kept subordinate to the plant silhouette.
 const tickCount=3+Math.floor((p.sketch||.5)*5);for(let i=0;i<tickCount;i++){let a=i*1.71+(p.sketch||0)*.4,x=Math.cos(a)*r*(.58+(i%2)*.08),y=Math.sin(a)*r*(.58+(i%2)*.08);path(`M ${x} ${y} l ${r*.035} ${-r*.025}`,{'stroke-opacity':.18+(p.sketch||.5)*.18,'stroke-width':pen*.62})}
 return grp
}
function randSeed(p,i){const v=Math.sin((p.x||0)*91.7+(p.y||0)*37.1+(p.rotation||0)*.13+i*17.3)*43758.5453;return v-Math.floor(v)}
function symbolType(cat='',latin=''){
 const s=(cat+' '+latin).toLowerCase();
 // Specific genera first; broad family matches are deliberately last.
 if(/rubus idaeus|hallon/.test(s))return'berryshrub';if(/eutrochium|rosenflockel/.test(s))return'eutrochium';if(/lavandula|lavendel/.test(s))return'lavender';
 if(/galanthus|snödroppe/.test(s))return'snowdrop';
 if(/rudbeckia/.test(s))return'rudbeckia';if(/echinacea|solhatt/.test(s))return'echinacea';
 if(/paeonia|pion/.test(s))return'peony';if(/echinops|bolltistel/.test(s))return'echinops';if(/iris/.test(s))return'iris';if(/digitalis|fingerborgsblomma/.test(s))return'digitalis';
 if(/dianthus|nejlika/.test(s))return'carnation';if(/knautia|scabiosa|vädd/.test(s))return'button';if(/phlox/.test(s))return'phlox';if(/anemone|sippor/.test(s))return'anemone';
 if(/hylotelephium|sedum|phedimus|kärleksört/.test(s))return'succulent';
 if(/allium/.test(s))return'sphere';if(/hemerocallis/.test(s))return'lily';if(/helleborus|adonis|ranunculus/.test(s))return'starflower';
 if(/actaea|delphinium|lythrum|agastache|veronicastrum|liatris/.test(s))return'spike';
 if(/fritillaria|scilla/.test(s))return'bell';if(/narcissus|crocus|eranthis|tulipa/.test(s))return'cup';
 if(/hosta|bergenia|pulmonaria|stachys|heuchera|antennaria/.test(s))return'rosetteSpotted';
 if(/eutrochium|aruncus|astilbe|filipendula|thalictrum/.test(s))return'panicle';
 if(/lysimachia|origanum|thymus/.test(s))return'dotmat';if(/dicentra|lamprocapnos/.test(s))return'arch';if(/alcea|digitalis/.test(s))return'spire';
 if(/calamagrostis|rörflen|miscanthus|spartina|phalaris|pennisetum/.test(s))return'featherygrass';
 if(/molinia|blåtåtel|festuca|sesleria|carex|hakonechloa|deschampsia|stipa|panicum|melica/.test(s))return'finegrass';
 if(/echinops|eryngium/.test(s))return'eryngium';if(/sanguisorba|blodtopp/.test(s))return'sanguisorba';
 if(/monarda/.test(s))return'monarda';if(/amsonia/.test(s))return'amsonia';if(/geranium|näva/.test(s))return'geranium';
 if(/alchemilla|daggkåpa/.test(s))return'alchemilla';if(/nepeta|kantnepeta/.test(s))return'nepeta';
 if(/salvia|perovskia|veronica/.test(s))return'salvia';if(/achillea|aster|leucanthemum/.test(s))return'daisy';
 if(/astrantia|angelica|foeniculum/.test(s))return'umbel';if(/busk|träd|tree|cornus|hydrangea|amelanchier|acer|betula|pinus/.test(s))return'shrubTree';
 if(/lök|bulb/.test(s))return'bulb';return'perennial'
}
function botanicalBloomColor(p){const s=((p.name||'')+' '+(p.latin||'')).toLowerCase();const rules=[
 [/echinacea|solhatt/,'#b77c91'],[/rudbeckia/,'#d2a64e'],[/salvia|nepeta|lavandula|perovskia|veronica|delphinium/,'#8580b5'],[/geranium|näva|phlox|monarda|dianthus|knautia|lythrum/,'#bd829f'],[/alchemilla|daggkåpa/,'#c8bd72'],[/astilbe/,'#c58b9c'],[/allium/,'#9b91bd'],[/rosa|paeonia|pion/,'#c9859b'],[/achillea|röllika/,'#d0b65e'],[/anemone/,'#c7a0b1'],[/astrantia/,'#a77f9d'],[/gräs|grass|molinia|panicum|stipa|miscanthus|calamagrostis/,'#aaa77c']
 ];for(const [re,c] of rules)if(re.test(s))return c;return p.bloomColor||'#b9a4a2'}
function roundedCellPath(poly){
 const pts=poly.map(v=>screen(v.x,v.y));if(pts.length<3)return polygonPath(poly);
 const cut=.16,starts=[],ends=[];
 for(let i=0;i<pts.length;i++){
  const prev=pts[(i-1+pts.length)%pts.length],cur=pts[i],next=pts[(i+1)%pts.length];
  starts.push({x:cur.x+(prev.x-cur.x)*cut,y:cur.y+(prev.y-cur.y)*cut});
  ends.push({x:cur.x+(next.x-cur.x)*cut,y:cur.y+(next.y-cur.y)*cut});
 }
 let d=`M ${ends[0].x.toFixed(2)} ${ends[0].y.toFixed(2)}`;
 for(let i=1;i<pts.length;i++)d+=` L ${starts[i].x.toFixed(2)} ${starts[i].y.toFixed(2)} Q ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)} ${ends[i].x.toFixed(2)} ${ends[i].y.toFixed(2)}`;
 d+=` L ${starts[0].x.toFixed(2)} ${starts[0].y.toFixed(2)} Q ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} ${ends[0].x.toFixed(2)} ${ends[0].y.toFixed(2)} Z`;return d;
}
function sharedMassPath(poly){
 const pts=poly.map(v=>screen(v.x,v.y));if(pts.length<3)return polygonPath(poly);
 const starts=[],ends=[],controls=[];
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;
  const cut=Math.min(26,len*.46);
  starts.push({x:a.x+dx*cut/len,y:a.y+dy*cut/len});
  ends.push({x:b.x-dx*cut/len,y:b.y-dy*cut/len});
  const forward=(a.x<b.x)||(Math.abs(a.x-b.x)<1e-7&&a.y<=b.y),u=forward?a:b,v=forward?b:a;
  const ux=v.x-u.x,uy=v.y-u.y,ul=Math.hypot(ux,uy)||1,nx=-uy/ul,ny=ux/ul;
  const key=[u.x,u.y,v.x,v.y].map(x=>Math.round(x*1000)/1000).join(':');let hash=2166136261;
  for(let j=0;j<key.length;j++)hash=Math.imul(hash^key.charCodeAt(j),16777619)>>>0;
  const sign=(hash&1)?1:-1,offset=Math.min(5.8,ul*.14)*sign;
  controls.push({x:(u.x+v.x)/2+nx*offset,y:(u.y+v.y)/2+ny*offset});
 }
 let d=`M ${starts[0].x.toFixed(2)} ${starts[0].y.toFixed(2)}`;
 for(let i=0;i<pts.length;i++){
  const next=(i+1)%pts.length,e=ends[i],c=controls[i],v=pts[next],ns=starts[next];
  d+=` Q ${c.x.toFixed(2)} ${c.y.toFixed(2)} ${e.x.toFixed(2)} ${e.y.toFixed(2)} Q ${v.x.toFixed(2)} ${v.y.toFixed(2)} ${ns.x.toFixed(2)} ${ns.y.toFixed(2)}`;
 }
 return d+' Z';
}
function organicPath(poly){const pts=poly.map(v=>screen(v.x,v.y));if(pts.length<3)return polygonPath(poly);let d=`M ${pts[0].x} ${pts[0].y}`;for(let i=0;i<pts.length;i++){const p0=pts[(i-1+pts.length)%pts.length],p1=pts[i],p2=pts[(i+1)%pts.length],p3=pts[(i+2)%pts.length];const c1={x:p1.x+(p2.x-p0.x)/6,y:p1.y+(p2.y-p0.y)/6},c2={x:p2.x-(p3.x-p1.x)/6,y:p2.y-(p3.y-p1.y)/6};d+=` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`}return d+' Z'}
function plantFor(id){return catalog.find(p=>p.id===id)||catalog[0]}
function makeGroup(plant,poly,seedIndex=0,density=2,center=null,role='accent',spread=1){
 const b=bounds(poly),spacing=Math.max(.22,Math.min(.34,(plant.spacing||40)/100*.72));let seed=(seedIndex+31)*7919;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 if(!center){for(let k=0;k<900;k++){const c={x:b.x+rand()*b.w,y:b.y+rand()*b.h};if(inside(c,poly)){center=c;break}}}if(!center)center={x:b.x+b.w/2,y:b.y+b.h/2};
 // Naturalistic, roughly one-square-metre species island with an irregular lobed outline.
 const targetArea=role==='matrix'?1.35:role==='secondary'?1.05:.82,baseR=Math.sqrt(targetArea/Math.PI)*spread;
 const drift=[],n=44,phase=rand()*Math.PI*2,lobes=3+Math.floor(rand()*4);
 for(let i=0;i<n;i++){const ang=phase+i*Math.PI*2/n,wave=1+.17*Math.sin(ang*lobes+phase)+.09*Math.sin(ang*(lobes+2)+1.7)+.045*(rand()-.5),rr=baseR*wave;drift.push({x:center.x+Math.cos(ang)*rr*(.96+rand()*.08),y:center.y+Math.sin(ang)*rr*(.86+rand()*.12)})}
 // Staggered, slightly jittered planting grid: dense coverage without symbol collisions.
 const pts=[],step=spacing,dy=step*.866,x0=center.x-baseR*1.5,y0=center.y-baseR*1.5;
 for(let row=0;y0+row*dy<center.y+baseR*1.6;row++)for(let col=0;x0+col*step<center.x+baseR*1.6;col++){
  const x=x0+col*step+(row%2)*step*.5,y=y0+row*dy,p={x:x+(rand()-.5)*step*.16,y:y+(rand()-.5)*step*.16};
  if(inside(p,poly)&&inside(p,drift)){const d=Math.min(.27,Math.max(.19,(plant.diameter||.4)*.52));pts.push({...p,rotation:Math.round(rand()*360),d,color:plant.color||colors[seedIndex%colors.length],bloomColor:botanicalBloomColor(plant),symbol:symbolType(plant.category,plant.latin)})}
 }
 let roundedDrift=drift;for(let pass=0;pass<2;pass++){const softened=[];for(let j=0;j<roundedDrift.length;j++){const a=roundedDrift[j],b=roundedDrift[(j+1)%roundedDrift.length];softened.push({x:a.x*.75+b.x*.25,y:a.y*.75+b.y*.25},{x:a.x*.25+b.x*.75,y:a.y*.25+b.y*.75})}roundedDrift=softened;}
 return{id:id(),plantId:plant.id,name:plant.name,latin:plant.latin,category:plant.category,color:plant.color||colors[seedIndex%colors.length],bloomColor:botanicalBloomColor(plant),spacing:Math.round(step*100),poly:roundedDrift,center,points:pts.filter(p=>inside(p,roundedDrift)),locked:false,scale:82,role,bedId:null,code:''}
}
const BOTANICAL_PENCIL_PALETTE=[
 '#b97870','#c28b68','#c5ad70','#a8ad79','#7e9a7d','#668d83',
 '#6f9999','#7794a9','#7c87a6','#8982a0','#a1849b','#b18491',
 '#b98e9a','#c59a9d','#9b806d','#a98c70','#78866f','#7f8d8c',
 '#c9aaa0','#a9b8c5','#cdbf98','#afbea2','#bca9bc','#d0ad83'
];
function massPattern(gr,index){
 const profile=speciesVisualProfile({id:gr.plantId,name:gr.name,latin:gr.latin,category:gr.category,flowerColor:gr.flowerColor});
 const pid='pattern-'+String(profile.key).replace(/[^a-zA-Z0-9_-]/g,'-');
 const size=profile.motif==='berry'?15:profile.motif==='flowercluster'?17:19;
 const defs=svg.querySelector('defs')||E('defs',{},svg);
 const existing=svg.querySelector('#'+pid);
 if(existing)return {id:pid,fill:`url(#${pid})`,outline:profile.foliage,second:profile.accent,outlineWidth:3,borderDash:'none',profile};
 const pat=E('pattern',{id:pid,patternUnits:'userSpaceOnUse',width:size,height:size},defs);
 E('rect',{x:0,y:0,width:size,height:size,fill:profile.inner},pat);
 const path=(d,stroke=profile.foliage,w=1,opacity=.8)=>E('path',{d,fill:'none',stroke,'stroke-width':w,opacity,'stroke-linecap':'round','stroke-linejoin':'round'},pat);
 const dot=(x,y,r,fill)=>E('circle',{cx:x,cy:y,r,fill,opacity:.94},pat);
 if(profile.motif==='berry'){
  path(`M 1 ${size*.72} Q ${size*.35} ${size*.25} ${size-1} ${size*.22}`,profile.foliage,1.5);
  path(`M ${size*.38} ${size*.48} q -3 -4 -5 -5 m 5 5 q 4 -4 6 -4`,profile.foliage,1.2);
  [[4,4],[11,8],[6,13],[14,14],[15,3]].forEach(([x,y])=>dot(x,y,1.65,profile.accent));
 }else if(profile.motif==='flowercluster'){
  for(let y=4;y<size;y+=8)for(let x=4;x<size;x+=8){
   dot(x,y,2.1,profile.accent);dot(x+2,y-1,1.35,'#f0c4d0');
  }
  path(`M 1 ${size-2} Q ${size*.45} ${size*.55} ${size-1} 2`,profile.foliage,1.4);
 }else if(profile.motif==='leafvein'){
  path(`M 1 ${size-1} Q ${size*.45} ${size*.48} ${size-1} 1`,profile.foliage,1.5);
  path(`M ${size*.45} ${size*.55} l -3 -4 m 3 4 l 4 -4`,profile.foliage,1);
  dot(size*.72,size*.3,1.5,profile.accent);
 }else if(profile.motif==='flowerdots'){
  for(let y=3;y<size;y+=7)for(let x=3;x<size;x+=7)dot(x,y,1.65,profile.accent);
  path(`M 1 ${size*.8} Q ${size*.45} ${size*.3} ${size-1} ${size*.2}`,profile.foliage,1);
 }else if(profile.motif==='stipple'){
  for(let i=0;i<10;i++)dot((i*7+3)%size,(i*11+2)%size,.8+(i%3)*.35,i%3?profile.foliage:profile.accent);
 }else if(profile.motif==='ripple'){
  for(let y=4;y<size;y+=6)path(`M 0 ${y} q 4 -3 8 0 t 8 0`,profile.foliage,1);
  dot(size*.7,size*.3,1.6,profile.accent);
 }else if(profile.motif==='cross'){
  for(let y=4;y<size;y+=8)for(let x=4;x<size;x+=8){path(`M ${x-2} ${y-2} l 4 4 m 0 -4 l -4 4`,profile.accent,1.15)}
 }else if(profile.motif==='radial'){
  for(let i=0;i<4;i++){let x=4+(i%2)*9,y=4+Math.floor(i/2)*9;path(`M ${x} ${y-3} q 4 3 0 6 q -4 -3 0 -6`,profile.accent,1)}
 }else if(profile.motif==='diagonal'){
  for(let x=-size;x<size*2;x+=6)path(`M ${x} 0 l ${size} ${size}`,profile.foliage,.9);
  dot(size*.65,size*.3,1.5,profile.accent);
 }else{
  for(let i=0;i<5;i++){let x=(i*5+3)%size,y=(i*7+4)%size;path(`M ${x} ${y-2} q 3 2 0 4 q -3 -2 0 -4`,profile.accent,1)}
 }
 return {id:pid,fill:`url(#${pid})`,outline:profile.foliage,second:profile.accent,outlineWidth:3,borderDash:'none',profile};
}
// Keep the immutable paper/grid SVG subtree between frames. Only dynamic geometry is replaced.
let backgroundKey='',backgroundLayer=null;
function renderNow(){
 const key=[state.W,state.H,Boolean(state.grid)].join('|');
 if(key!==backgroundKey||!backgroundLayer||backgroundLayer.parentNode!==svg){
  svg.innerHTML='';backgroundKey=key;
  backgroundLayer=E('g',{'data-render-layer':'background'},svg);
  E('rect',{x:0,y:0,width:1200,height:780,fill:'#fbfaf7'},backgroundLayer);
  const left=80,top=50,w=1040,h=680;
  if(state.grid){
   for(let x=0;x<=state.W;x++){const v=left+x*w/state.W;E('line',{x1:v,y1:top,x2:v,y2:top+h,stroke:'#ecece5','stroke-width':.65},backgroundLayer)}
   for(let y=0;y<=state.H;y++){const v=top+y*h/state.H;E('line',{x1:left,y1:v,x2:left+w,y2:v,stroke:'#ecece5','stroke-width':.65},backgroundLayer)}
  }
 }
 // Dynamic nodes start after the persistent background layer.
 while(backgroundLayer.nextSibling)svg.removeChild(backgroundLayer.nextSibling);
 addDefs();

 const defs=svg.querySelector('defs');state.beds.forEach(b=>{let d=E('defs',{},svg);let cp=E('clipPath',{id:'clip-'+b.id},d);E('path',{d:polygonPath(b.points)},cp);E('path',{d:polygonPath(b.points),fill:'#f4f0e7','fill-opacity':.42,stroke:'#9e9b8e','stroke-width':1.5,'stroke-linejoin':'round'})});
 state.paths.forEach(p=>E('path',{d:polygonPath(p.points),fill:'#fff',stroke:'#c9c5b9','stroke-width':1.2,'stroke-linejoin':'round'}));
 state.groups.forEach((gr,gi)=>{let defs=svg.querySelector('defs');let gid='mass-'+gr.id;const massPath=sharedMassPath(gr.poly);let cp=E('clipPath',{id:gid},defs);E('path',{d:massPath},cp);let g=E('g',{'clip-path':`url(#${gid})`,class:'group-shape'+(state.selected===gr.id?' selected':''),'data-id':gr.id,'data-kind':'group','data-bed-id':gr.bedId||''},svg);if(gr.poly?.length>=3){const pat=massPattern(gr,gi),d=massPath;E('path',{d,fill:pat.fill,'fill-opacity':1,stroke:'none','pointer-events':'all','data-id':gr.id,'data-kind':'group'},g);E('path',{d,fill:'none',stroke:pat.outline,'stroke-opacity':.98,'stroke-width':Math.max(2.2,Math.min(2.8,(pat.outlineWidth||2.8)*.88)),'stroke-dasharray':pat.borderDash||'none','stroke-linejoin':'round','stroke-linecap':'round','pointer-events':'none'},g);E('path',{d,fill:'none',stroke:pat.second||'#514b42','stroke-opacity':.48,'stroke-width':.65+((gi%3)*.18),'stroke-dasharray':gi%4===0?'2 2':'none','stroke-linejoin':'round','stroke-linecap':'round','transform':`translate(${.55+(gi%3)*.35} ${-.35-(gi%2)*.3})`,'pointer-events':'none'},g)}gr.points.slice(0,1).forEach(p=>drawSymbol(g,p,1.38));const gc=gr.poly&&gr.poly.length>=3?centroid(gr.poly):gr.center;const gp=screen(gc.x,gc.y);if(gr.points.length>0)E('text',{x:gp.x,y:gp.y+3,'font-size':10,'font-family':'Georgia,serif','font-style':'italic','text-anchor':'middle',fill:'#4d5148','fill-opacity':.82,'pointer-events':'none'}).textContent=latinCode(gr.latin);if(state.selected===gr.id){E('path',{d:organicPath(gr.poly),fill:'none',stroke:'#587452','stroke-width':2.8,'stroke-dasharray':'5 4','pointer-events':'none'},g)}});
 state.beds.forEach(b=>{const d=polygonPath(b.points);E('path',{d,fill:'none',stroke:'transparent','stroke-width':12,'stroke-linejoin':'round','pointer-events':'stroke','data-id':b.id,'data-kind':'bed'});E('path',{d,fill:'none',stroke:state.selected===b.id?'#557452':'#a9a69a','stroke-width':state.selected===b.id?3.2:1.35,'stroke-dasharray':state.selected===b.id?'6 3':'none','stroke-linejoin':'round','pointer-events':'none'})});
 state.paths.forEach(p=>E('path',{d:polygonPath(p.points),fill:'none',stroke:state.selected===p.id?'#557452':'#bcb8ac','stroke-width':1.4,'data-id':p.id,'data-kind':'path'}));
 if(state.drawing.length){const preview=[...state.drawing,...(state.previewPoint?[state.previewPoint]:[])];E('path',{d:pathPreview(preview,false),fill:'none',stroke:'#557b55','stroke-width':2.2,'stroke-linecap':'round','stroke-linejoin':'round','stroke-dasharray':'6 4'});state.drawing.forEach(p=>{const q=screen(p.x,p.y);E('circle',{cx:q.x,cy:q.y,r:3.2,fill:'#fff',stroke:'#557b55','stroke-width':1.5})});if(state.drawing.length>=2){const q=screen(state.drawing[0].x,state.drawing[0].y);E('circle',{cx:q.x,cy:q.y,r:5,fill:'none',stroke:'#557b55','stroke-width':1.2,'stroke-dasharray':'2 2'})}}
 E('text',{x:82,y:31,fill:'#929187','font-size':10,'letter-spacing':2}).textContent='PLANTING PLAN · TOP VIEW';E('text',{x:1110,y:755,fill:'#929187','font-size':10,'text-anchor':'end'}).textContent=`${state.W} × ${state.H} m`;
 updatePanels()}
let renderFrame=0;function render(){if(renderFrame)return;renderFrame=requestAnimationFrame(()=>{renderFrame=0;renderNow()})}
const portraitCache=new Map();
function showPlantPortrait(p){
 if(!p)return;
 const overlay=$('plantPortrait'),img=$('portraitImage'),status=$('portraitImageStatus');
 $('portraitName').textContent=p.name||'Okänd art';$('portraitLatin').textContent=p.latin||'';
 img.classList.remove('ready');img.removeAttribute('src');img.alt=`Foto av ${p.name} (${p.latin||''})`;status.textContent='Hämtar artfoto…';
 const parts=[];if(p.habit)parts.push(`Växtsätt: ${p.habit}.`);if(p.foliageCharacter)parts.push(`Bladverk: ${p.foliageCharacter}.`);if(p.flowerColor)parts.push(`Blomning: ${p.flowerColor}.`);if(p.summerValue)parts.push(p.summerValue+'.');
 $('portraitDescription').textContent=parts.join(' ')||'Artporträttet kompletteras när mer verifierad artinformation finns i växtbiblioteket.';
 $('portraitFacts').innerHTML='';
 [['Höjd',p.height?`${p.height} m`:null],['Blomning',p.bloom],['Ljus',p.light],['Markfukt',p.soilMoisture],['Jord',p.soilTexture],['Vinterstruktur',p.winterStructure]].filter(x=>x[1]).forEach(([k,v])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;$('portraitFacts').append(dt,dd)});
 overlay.classList.remove('hidden');
 const key=p.latin||p.name,applyPhoto=data=>{if(data?.url){img.src=data.url;img.onload=()=>{img.classList.add('ready');status.textContent=''};img.onerror=()=>{status.textContent='Artfoto kunde inte laddas.'};$('portraitCredit').textContent=data.credit||'Bildkälla: iNaturalist'}else status.textContent='Inget artfoto hittades. Artporträttet visas utan bild.'};
 if(portraitCache.has(key)){applyPhoto(portraitCache.get(key));return}
 fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?q=${encodeURIComponent(key)}&per_page=8`)
  .then(r=>{if(!r.ok)throw Error('taxon lookup failed');return r.json()})
  .then(data=>{const exact=(data.results||[]).find(t=>(t.name||'').toLowerCase()===String(p.latin||'').toLowerCase()) ,photo=exact?.default_photo,result=photo?.medium_url?{url:photo.medium_url,credit:photo.attribution?`Foto: ${photo.attribution} · iNaturalist`:'Bildkälla: iNaturalist'}:null;portraitCache.set(key,result);applyPhoto(result)})
  .catch(()=>{portraitCache.set(key,null);status.textContent='Kunde inte hämta artfoto. Kontrollera internetanslutningen.'});
}
$('closePortrait').onclick=()=>$('plantPortrait').classList.add('hidden');
$('plantPortrait').addEventListener('click',e=>{if(e.target===$('plantPortrait'))$('plantPortrait').classList.add('hidden')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('plantPortrait').classList.add('hidden')});
let catalogRenderKey='';
function renderCatalog(){const q=$('plantSearch').value.toLowerCase(),cat=$('categoryFilter').value,key=q+'|'+cat+'|'+(state.selectedPlant?.id||'');if(key===catalogRenderKey)return;catalogRenderKey=key;const list=catalog.filter(p=>p.catalogStatus!=='alias'&&(cat==='Alla'||p.category===cat)&&(`${p.name} ${p.latin}`).toLowerCase().includes(q));$('plantCount').textContent=list.length;$('plantList').innerHTML='';list.slice(0,100).forEach(p=>{let b=document.createElement('button');b.className='plant-item'+(state.selectedPlant?.id===p.id?' active':'');b.innerHTML=`<i class="swatch" style="background:${p.color||'#a5b49a'}"></i><span><strong>${p.name}</strong><em>${p.latin}</em></span><small class="plant-open">Porträtt ↗</small>`;b.onclick=()=>{state.selectedPlant=p;renderCatalog();$('status').textContent=`Vald art: ${p.name}`;showPlantPortrait(p)};$('plantList').appendChild(b)})}
const groupSpeciesOptions=catalog.filter(p=>p.catalogStatus!=='alias').map(p=>`<option value="${p.id}">${p.name} · ${p.latin}</option>`).join('');
let scheduleRenderKey='';
function updatePanels(){let g=state.groups.find(x=>x.id===state.selected),bed=state.beds.find(x=>x.id===state.selected);$('emptyState').classList.toggle('hidden',!!g);$('groupEditor').classList.toggle('hidden',!g);$('selectionType').textContent=g?'Växtgrupp':bed?'Rabattcell':'Ingen';$('emptyState').textContent=bed?`Rabattcell markerad · ${area(bed.points).toFixed(1)} m² · ${state.groups.filter(q=>q.bedId===bed.id).length} växtceller. Aktivera Flyttläge och dra i rabattens kontur för att flytta rabattcellen tillsammans med alla växtceller inuti.`:'Välj en växtcell eller klicka på rabattcellens ytterkontur för att markera hela rabatten.';if(g){$('selectedName').textContent=g.name;$('selectedLatin').textContent=g.latin;$('selectedName').onclick=()=>showPlantPortrait(plantFor(g.plantId));$('selectedLatin').onclick=()=>showPlantPortrait(plantFor(g.plantId));$('selectedSwatch').style.background=g.color;$('groupCount').value=g.estimatedPlants||Math.max(1,Math.round(area(g.poly)/(.8660254*Math.pow((g.spacing||35)/100,2))));$('groupCount').readOnly=true;if($('groupSpecies').dataset.optionsReady!=='1'){$('groupSpecies').innerHTML=groupSpeciesOptions;$('groupSpecies').dataset.optionsReady='1'}$('groupSpecies').value=g.plantId;$('groupMeta').textContent=`${area(g.poly).toFixed(1)} m² · ${g.role==='matrix'?'Matrix':g.role==='secondary'?'Drift':'Accent'} · ${g.locked?'Låst':'Olåst'} · 1 gruppsymbol · cirka ${g.estimatedPlants||Math.max(1,Math.round(area(g.poly)/(.8660254*Math.pow((g.spacing||35)/100,2))))} plantor`;$('lockGroup').textContent=g.locked?'Lås upp grupp':'Lås grupp'}let totalArea=state.beds.reduce((s,b)=>s+area(b.points),0),species=new Set(state.groups.map(g=>g.plantId));$('areaStat').textContent=totalArea.toFixed(1);$('speciesStat').textContent=species.size;$('countStat').textContent=state.groups.reduce((s,g)=>s+(g.estimatedPlants||Math.max(1,Math.round(area(g.poly)/(.8660254*Math.pow((g.spacing||35)/100,2))))),0);$('objectStats').textContent=`${state.beds.length} planteringsytor · ${state.groups.length} växtgrupper`;const nextScheduleKey=state.groups.map(g=>[g.id,g.plantId,g.estimatedPlants,g.spacing,g.poly?.length].join(':')).join('|');if(nextScheduleKey!==scheduleRenderKey){scheduleRenderKey=nextScheduleKey;$('schedule').innerHTML='';const by={};state.groups.forEach(g=>{by[g.plantId]??={plant:plantFor(g.plantId),count:0};by[g.plantId].count+=(g.estimatedPlants||Math.max(1,Math.round(area(g.poly)/(.8660254*Math.pow((g.spacing||35)/100,2)))))});Object.values(by).forEach(x=>{let row=document.createElement('div');row.className='schedule-row';row.innerHTML=`<i style="background:${x.plant.color||'#a5b49a'}"></i><span><b>${x.plant.name}</b><small>${x.plant.latin}</small></span><strong>${x.count} st</strong>`;$('schedule').appendChild(row)});if(!Object.keys(by).length)$('schedule').innerHTML='<p class="micro">Generera en plantering för att skapa växtförteckningen.</p>'}}
function setTool(t){state.tool=t;if(t!=='select'&&state.moveMode)setMoveMode(false);document.querySelectorAll('[data-tool]').forEach(b=>b.classList.toggle('active',b.dataset.tool===t));$('finishPolygon').classList.toggle('hidden',!['bed','path'].includes(t));$('toolHint').textContent=t==='bed'?'Dra med musen för att frihandsrita en mjuk kontur, eller klicka för att lägga hörnpunkter. Konturen följer pekaren. Avsluta med knappen.':t==='path'?'Dra med musen för att frihandsrita gångens kontur, eller klicka för att lägga hörnpunkter. Konturen följer pekaren. Avsluta med knappen.':t==='plant'?'Välj en art och klicka i ritningen.':(state.moveMode?'Flyttläge aktivt: dra en växtcell eller rabattens ytterkontur.':'Markera en grupp eller ett objekt. Tryck M för flyttläge.')}
document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>setTool(b.dataset.tool));
$('finishPolygon').onclick=()=>{if(state.drawing.length<3)return;snap();let clean=state.drawing.filter((p,i,a)=>i===0||Math.hypot(p.x-a[i-1].x,p.y-a[i-1].y)>.08);if(clean.length<3)return;let obj={id:id(),points:clean.length>=8?smoothClosed(clean,2):clean.length>=5?smoothClosed(clean,1):clone(clean)};if(state.tool==='bed')state.beds.push(obj);else state.paths.push(obj);state.drawing=[];state.previewPoint=null;state.selected=obj.id;setTool('select');render();$('status').textContent='Yta skapad'};
let dragState=null;
svg.addEventListener('pointerdown',e=>{
 if(state.tool!=='select'||!state.moveMode)return;
 const groupTarget=e.target.closest('[data-kind="group"]');
 const bedTarget=e.target.closest('[data-kind="bed"]');
 if(groupTarget){
  const gr=state.groups.find(x=>x.id===groupTarget.dataset.id);if(!gr||gr.locked)return;
  state.selected=gr.id;snap();const p=point(e);
  dragState={type:'group',id:gr.id,bedId:gr.bedId,last:p,dx:0,dy:0,nodes:[groupTarget]};
 }else if(bedTarget){
  const bed=state.beds.find(x=>x.id===bedTarget.dataset.id);if(!bed)return;
  state.selected=bed.id;snap();const p=point(e);
  const related=[...svg.querySelectorAll(`[data-kind="group"][data-bed-id="${bed.id}"]`)];
  dragState={type:'bed',id:bed.id,last:p,dx:0,dy:0,nodes:[bedTarget,...related]};
 }else return;
 dragState.nodes.forEach(n=>n.classList.add('dragging'));
 svg.setPointerCapture?.(e.pointerId);
});
svg.addEventListener('pointermove',e=>{
 if(!dragState)return;const p=point(e),dx=p.x-dragState.last.x,dy=p.y-dragState.last.y;if(Math.hypot(dx,dy)<.002)return;
 dragState.dx+=dx;dragState.dy+=dy;dragState.last=p;
 const tx=dragState.dx*1040/state.W,ty=dragState.dy*680/state.H;
 dragState.nodes.forEach(n=>n.setAttribute('transform',`translate(${tx} ${ty})`));
});
svg.addEventListener('pointerup',()=>{
 if(!dragState)return;const {type,id,dx,dy}=dragState;
 if(dx||dy){
  if(type==='group'){
   const gr=state.groups.find(x=>x.id===id);
   if(gr){gr.poly=gr.poly.map(v=>({x:v.x+dx,y:v.y+dy}));gr.points=gr.points.map(v=>({...v,x:v.x+dx,y:v.y+dy}));gr.center={x:gr.center.x+dx,y:gr.center.y+dy};}
   $('status').textContent='Växtgruppen flyttad';
  }else{
   const bed=state.beds.find(x=>x.id===id);
   if(bed){bed.points=bed.points.map(v=>({x:v.x+dx,y:v.y+dy}));state.groups.filter(g=>g.bedId===id).forEach(gr=>{gr.poly=gr.poly.map(v=>({x:v.x+dx,y:v.y+dy}));gr.points=gr.points.map(v=>({...v,x:v.x+dx,y:v.y+dy}));gr.center={x:gr.center.x+dx,y:gr.center.y+dy};});}
   $('status').textContent='Rabattcell flyttad tillsammans med sina växtceller';
  }
 }
 dragState=null;render();
});
svg.addEventListener('pointerdown',e=>{
 if(!['bed','path'].includes(state.tool))return;
 state.drawPointer={start:point(e),last:point(e),dragging:false,pointerId:e.pointerId};svg.setPointerCapture?.(e.pointerId);
});
svg.addEventListener('pointermove',e=>{
 if(!['bed','path'].includes(state.tool))return;
 const p=point(e);
 if(state.drawPointer){const d=Math.hypot(p.x-state.drawPointer.start.x,p.y-state.drawPointer.start.y);
  if(!state.drawPointer.dragging&&d>.10){state.drawPointer.dragging=true;state.drawing.push({...state.drawPointer.start});}
  if(state.drawPointer.dragging&&Math.hypot(p.x-state.drawPointer.last.x,p.y-state.drawPointer.last.y)>.055){state.drawing.push(p);state.drawPointer.last=p;state.previewPoint=p;render();return;}
 }
 if(state.drawing.length){state.previewPoint=p;render()}
});
svg.addEventListener('pointerup',e=>{if(!state.drawPointer)return;if(state.drawPointer.dragging){state.suppressClick=true;const p=point(e);if(Math.hypot(p.x-state.drawPointer.last.x,p.y-state.drawPointer.last.y)>.025)state.drawing.push(p);state.previewPoint=p;render();setTimeout(()=>{state.suppressClick=false},0)}state.drawPointer=null});
svg.addEventListener('pointercancel',()=>{state.drawPointer=null;state.previewPoint=null;render()});
svg.addEventListener('click',e=>{if(state.suppressClick){state.suppressClick=false;return}const p=point(e);if(['bed','path'].includes(state.tool)){state.drawing.push(p);state.previewPoint=null;render();return}if(state.tool==='plant'&&state.selectedPlant){let bed=state.beds.find(b=>inside(p,b.points));if(!bed){$('status').textContent='Välj en punkt inuti en planteringsyta';return}snap();const plant=state.selectedPlant,radius=Math.max(.40,Math.min(.55,Math.sqrt(.72/Math.PI))),poly=[];for(let i=0;i<40;i++){const a=i*Math.PI*2/40,wave=1+.08*Math.sin(a*3+.7)+.035*Math.sin(a*5+1.2);poly.push({x:p.x+Math.cos(a)*radius*wave,y:p.y+Math.sin(a)*radius*.82*wave})}const gr={id:id(),plantId:plant.id,name:plant.name,latin:plant.latin,category:plant.category,color:plant.color||'#87977d',bloomColor:botanicalBloomColor(plant),spacing:Math.round((plant.spacing||40)),poly,center:{...p},points:[{...p,d:plant.diameter||.45,rotation:0,color:plant.color,bloomColor:botanicalBloomColor(plant),symbol:symbolType(plant.category,plant.latin)}],locked:false,scale:82,role:'manual',bedId:bed.id,code:latinCode(plant.latin),estimatedPlants:Math.max(1,Math.round(area(poly)/Math.pow((plant.spacing||35)/100,2)))};state.groups.push(gr);state.selected=gr.id;setTool('select');render();$('status').textContent='Växt placerad exakt på klickpunkten';return}let target=e.target.closest('[data-id]');if(target){state.selected=target.dataset.id;render();return}let groupHit=state.groups.find(g=>g.points.some(v=>Math.hypot(v.x-p.x,v.y-p.y)<(v.d||.4)*.7));state.selected=groupHit?.id||null;render()});
function compositionCandidatePool(plants,community){
 // First screen horticultural conflicts; then rank by form, texture, height and palette.
 const engine=window.PLANT_COMPATIBILITY, aesthetics=window.PLANT_AESTHETICS;
 return plants.map(p=>{
  const fit=engine?engine.rankAgainstCommunity(p,community):{status:'candidate',score:0};
  const visual=aesthetics?aesthetics.rankAgainstCommunity(p,community):{score:0};
  return {plant:p,fit,visual,total:fit.score*.45+visual.score*2.8+(visual.seasonalBonus||0)*1.15};
 }).filter(x=>x.fit.status!=='avoid')
  .sort((a,b)=>b.total-a.total).map(x=>x.plant);
}
$('generateBtn').onclick=()=>{
 if(!state.beds.length){$('status').textContent='Skapa först minst en planteringsyta';return}
 snap();state.groups=state.groups.filter(g=>g.locked);
 const mode=$('designMode').value,pool=autoPerennials.filter(p=>['Perenner','Prydnadsgräs','Lökväxter','Marktäckare'].includes(p.category));
 if(!pool.length){$('status').textContent='Växtbiblioteket saknar granskade arter för automatgenerering.';return}
 const inkFor=(p,i)=>massColorFor(p);
 let totalGroups=0,totalPlants=0,failures=[];
 state.beds.forEach((bed,bi)=>{
  const bedArea=area(bed.points);
  if(bedArea<.5){failures.push('En planteringsyta är för liten');return}
  const b=bounds(bed.points);
  let seed=(Date.now()+bi*7919)>>>0;
  const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const matrixPool=pool.filter(p=>{
   const roles=Array.isArray(p.compositionRole)?p.compositionRole:[p.compositionRole].filter(Boolean);
   return roles.some(x=>['matrix','matrix_edge','repeated_drift'].includes(x));
  });
  const matrixChoices=(matrixPool.length?matrixPool:pool).map(p=>{
   const roles=Array.isArray(p.compositionRole)?p.compositionRole:[p.compositionRole].filter(Boolean);
   const structure=(p.winterStructure?1:0)+(roles.includes('winter_skeleton')?1.4:0)+(roles.includes('structural_grass')?1.2:0)+(p.category==='Prydnadsgräs'?.7:0);
   return {p,structure};
  }).sort((a,b)=>b.structure-a.structure);
  const matrix=matrixChoices[Math.floor(rand()*Math.min(5,matrixChoices.length))].p;
  const candidates=pool.filter(p=>p.id!==matrix.id),palette=[matrix];
  const desiredSpecies=Math.min(10,Math.max(4,Math.round(bedArea/3.5)));
  while(palette.length<desiredSpecies&&candidates.length){
   const ranked=compositionCandidatePool(candidates,palette);
   if(!ranked.length)break;
   const chosen=ranked[Math.floor(rand()*Math.min(ranked.length,Math.max(1,Math.ceil(ranked.length*.22))))];
   palette.push(chosen);candidates.splice(candidates.findIndex(p=>p.id===chosen.id),1);
  }
  const densityLevel=+$('density').value||2;
  const seedCount=clamp(Math.round(bedArea/(densityLevel===1?.82:densityLevel===2?.58:.40)),10,125);
  const step=Math.sqrt(bedArea/seedCount),seeds=[],maxAttempts=seedCount*520;
  // Plant-species cells: independent 2D distribution inside the selected bed.
  // These are not the bed-composition guides or large rabattcell shapes.
  for(let k=0;k<maxAttempts&&seeds.length<seedCount;k++){
   const q={x:b.x+rand()*b.w,y:b.y+rand()*b.h};
   if(!inside(q,bed.points))continue;
   const localRadius=step*(.24+rand()*.27);
   if(seeds.every(z=>Math.hypot(q.x-z.x,q.y-z.y)>Math.max(localRadius,z.radius)))
    seeds.push({...q,radius:localRadius,weight:(rand()-.5)*step*step*.5});
  }
  for(let k=0;seeds.length<seedCount&&k<seedCount*300;k++){
   const q={x:b.x+rand()*b.w,y:b.y+rand()*b.h};
   if(inside(q,bed.points)&&seeds.every(z=>Math.hypot(q.x-z.x,q.y-z.y)>step*.14))
    seeds.push({...q,radius:step*.14,weight:(rand()-.5)*step*step*.2});
  }
  if(!seeds.length){failures.push('Kunde inte placera växtgrupper i planteringsytan');return}
  const anchorCount=Math.min(palette.length,seeds.length),anchors=seeds.slice(0,anchorCount);
  const nearestAnchorIndex=z=>{let nearest=0,best=Infinity;anchors.forEach((a,i)=>{const d=Math.hypot(z.x-a.x,z.y-a.y);if(d<best){best=d;nearest=i}});return nearest};
  const bloomStart=p=>{const q=String(p.bloom||'').toLowerCase(),months=['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'],m=q.match(/jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec/);return m?months.indexOf(m[0]):6};
  const nearestSpecies=seeds.map(z=>palette[nearestAnchorIndex(z)]);
  const neighbourRadius=Math.max(.42,Math.sqrt(bedArea/Math.max(1,seeds.length))*1.55);
  const adjacency=seeds.map((z,i)=>seeds.map((q,j)=>({j,d:Math.hypot(z.x-q.x,z.y-q.y)})).filter(v=>v.j!==i&&v.d<neighbourRadius).map(v=>v.j));
  const order=seeds.map((_,i)=>i).sort((a,b)=>adjacency[b].length-adjacency[a].length),assigned=Array(seeds.length).fill(null);
  order.forEach(zi=>{
   const used=adjacency[zi].map(j=>assigned[j]).filter(Boolean);
   const options=palette.map(p=>{
    const repeats=used.filter(q=>q.id===p.id).length;
    const visual=window.PLANT_AESTHETICS?.rankAgainstCommunity(p,used)||{score:0};
    const colourNovelty=used.reduce((sum,q)=>sum+distanceColour(p,q),0);
    const anchorBonus=nearestSpecies[zi]?.id===p.id?.18:0;
    const matrixBonus=mode==='matrix'&&p.id===matrix.id?.42:0;
    const meadowBonus=mode==='meadow'?(bloomStart(p)>=bloomStart(nearestSpecies[zi]||p)?.08:0):0;
    return {p,score:colourNovelty*1.4+visual.score*.35+anchorBonus+matrixBonus+meadowBonus-repeats*100};
   }).sort((x,y)=>y.score-x.score);
   assigned[zi]=options[0]?.p||nearestSpecies[zi]||palette[zi%palette.length];
  });
  const cells=seeds.map((z,zi)=>{
   let cell=bed.points.map(v=>({...v}));
   seeds.forEach((o,oi)=>{
    if(oi===zi||cell.length<3)return;
    const nx=2*(o.x-z.x),ny=2*(o.y-z.y),c=(o.x*o.x+o.y*o.y-z.x*z.x-z.y*z.y)+(z.weight||0)-(o.weight||0);
    cell=clipHalfPlane(cell,nx,ny,c);
   });
   return cell;
  });
  cells.forEach((cell,zi)=>{
   const z=seeds[zi];
   if(cell.length<3||area(cell)<.055)return;
   const rawCenter=visualCellCenter(cell),inset=.82+rand()*.105;
   const insetCell=cell.map(v=>({x:rawCenter.x+(v.x-rawCenter.x)*inset,y:rawCenter.y+(v.y-rawCenter.y)*inset}));
   const morphPhase=rand()*Math.PI*2,morphPhase2=rand()*Math.PI*2,morphPhase3=rand()*Math.PI*2,morphCenter=visualCellCenter(insetCell);
   const sculpted=insetCell.map(v=>{
    const dx=v.x-morphCenter.x,dy=v.y-morphCenter.y,a=Math.atan2(dy,dx);
    const f=1+.052*Math.sin(2*a+morphPhase)+.032*Math.sin(3*a+morphPhase2)+.016*Math.sin(5*a+morphPhase3);
    return{x:morphCenter.x+dx*f,y:morphCenter.y+dy*f};
   });
   const poly=smoothClosed(sculpted,2+(rand()<.34?1:0)),species=assigned[zi];
   const role=window.PLANT_AESTHETICS?.rolePlacement(species,mode)||'följeväxt';
   const center=visualCellCenter(poly),spacing=Math.max(20,Math.min(80,Number(species.spacing)||38)),visual=speciesVisualProfile(species);
   const estimatedPlants=Math.max(1,Math.round(area(cell)/(.8660254*Math.pow(spacing/100,2))));
   const symbol={x:center.x,y:center.y,d:Math.max(.34,Math.min(.62,Math.sqrt(area(cell)/Math.PI)*.48)),rotation:0,color:visual.foliage,bloomColor:visual.accent,symbol:visual.symbol||symbolType(species.category,species.latin),sketch:rand(),strokeWidth:.85};
   const neighbourMasses=adjacency[zi].map(j=>assigned[j]).filter(Boolean).map(p=>botanicalBloomColor(p));
   const massFill=visual.inner,massOutline=visual.foliage;
   const group={id:id(),plantId:species.id,name:species.name,latin:species.latin,category:species.category,color:massFill,bloomColor:botanicalBloomColor(species),flowerColor:species.flowerColor||'',spacing,poly,center,points:[{...symbol,color:visual.foliage,bloomColor:visual.accent}],estimatedPlants,locked:false,scale:138,role,bedId:bed.id,code:latinCode(species.latin),showMass:true,outlineColor:massOutline,compositionRole:role,seasonalProfile:window.PLANT_AESTHETICS?.seasonalProfile(species)||null,cellMorphology:'organic-botanical-mass',cellWeight:seeds[zi].weight||0,compositionStatus:species.winteringRating?'hardiness_partly_reviewed':'hardiness_unverified',winterVerified:!!species.winterStructure,hardinessReviewed:!!species.winteringRating,winterStructure:species.winterStructure||'Ej verifierad'};
   state.groups.push(group);totalGroups++;totalPlants+=estimatedPlants;
  });
 });
 state.selected=state.groups.at(-1)?.id||null;render();
 $('status').textContent=totalGroups?`Genererade ${totalGroups} växtmassor i ${state.beds.length} rabatter. Cirka ${totalPlants} plantor enligt planteringsavstånd. ${failures.join('; ')}`:'Ingen växtgrupp kunde skapas. Kontrollera planteringsytans storlek.';
};
$('groupSpecies').onchange=()=>{let g=state.groups.find(x=>x.id===state.selected),p=plantFor($('groupSpecies').value);if(!g||g.locked)return;snap();g.plantId=p.id;g.name=p.name;g.latin=p.latin;g.category=p.category;const visual=speciesVisualProfile(p);g.color=visual.inner;g.outlineColor=visual.foliage;g.flowerColor=p.flowerColor||'';g.spacing=Math.max(20,Math.min(80,Number(p.spacing)||g.spacing));g.points=[{...g.points[0],color:visual.foliage,bloomColor:visual.accent,symbol:visual.symbol||symbolType(p.category,p.latin),rotation:0}];g.code=latinCode(p.latin);g.estimatedPlants=Math.max(1,Math.round(area(g.poly)/(.8660254*Math.pow(g.spacing/100,2))));render()};$('groupCount').onchange=()=>{render()};$('regenGroup').onclick=()=>{let g=state.groups.find(x=>x.id===state.selected);if(!g||g.locked)return;snap();let seed=(Date.now()>>>0),rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296},c=g.center||centroid(g.poly),candidate=null;for(let attempt=0;attempt<100;attempt++){const phase=rand()*Math.PI*2,lobes=2+Math.floor(rand()*3),amp=.003+rand()*.006;const poly=g.poly.map((v,i)=>{const dx=v.x-c.x,dy=v.y-c.y,a=Math.atan2(dy,dx),factor=.992+amp*Math.sin(a*lobes+phase)+amp*.35*Math.sin(a*(lobes+2)+phase*.7);return{x:c.x+dx*factor,y:c.y+dy*factor}});if(poly.every(v=>inside(v,g.poly))&&poly.every(v=>inside(v,state.beds.find(b=>b.id===g.bedId)?.points||g.poly))){candidate=poly;break}}if(candidate){g.poly=candidate;const p=plantFor(g.plantId);g.points=[{...g.points[0],x:c.x,y:c.y,rotation:0,color:speciesVisualProfile(p).foliage,bloomColor:speciesVisualProfile(p).accent,symbol:speciesVisualProfile(p).symbol}];g.estimatedPlants=Math.max(1,Math.round(area(candidate)/(.8660254*Math.pow(g.spacing/100,2))));g.code=latinCode(g.latin);render();$('status').textContent='Gruppens kontur har slumpats om. Storleken är i stort sett bevarad.'}else{$('status').textContent='Kunde inte variera formen säkert. Den befintliga gruppen är oförändrad.'}};$('lockGroup').onclick=()=>{let g=state.groups.find(x=>x.id===state.selected);if(!g)return;g.locked=!g.locked;render()};$('deleteGroup').onclick=()=>{snap();state.groups=state.groups.filter(g=>g.id!==state.selected);state.selected=null;render()};
$('plantSearch').oninput=renderCatalog;$('categoryFilter').onchange=renderCatalog;$('gridToggle').onchange=e=>{state.grid=e.target.checked;render()};$('density').oninput=()=>{$('densityOut').textContent=['Gles','Normal','Tät'][+$('density').value-1]};$('resizeSite').onclick=()=>{state.W=clamp(+$('siteW').value||24,5,100);state.H=clamp(+$('siteH').value||16,5,100);render()};$('makeSite').onclick=()=>{
 snap();state.W=clamp(+$('siteW').value||24,5,100);state.H=clamp(+$('siteH').value||16,5,100);
 const w=state.W,h=state.H,count=clamp(+$('bedCount').value||2,1,10),requested=$('bedForm')?.value||'mixed';
 const forms=requested==='mixed'
  ?BED_FORM_ARCHETYPES.filter((f,i,a)=>a.findIndex(q=>q.family===f.family)===i)
  :BED_FORM_LIBRARY.filter(f=>f.id===requested);
 const rng=()=>Math.random();
 const lineCount=clamp(+$('compositionLineCount')?.value||2,1,8);
 const bedComposition=$('bedComposition')?.value||'mixed';
 const result=generateBedLayout(w,h,count,forms,rng,lineCount,bedComposition);
 state.beds=result.beds;state.paths=[];state.compositionNetwork=result;state.groups=[];state.selected=null;state.drawing=[];state.previewPoint=null;render();
 $('status').textContent=state.beds.length===count
  ?`Skapade ${count} tydligt formade rabattceller i en sammanhängande komposition. Formvariation: ${new Set(result.beds.map(b=>b.shape)).size} silhuetter.`
  :`Kunde skapa ${state.beds.length} av ${count} rabattceller. Prova färre celler eller större tomtyta.`;
};
$('zoomIn').onclick=()=>{$('zoomLabel').textContent='110%'};$('zoomOut').onclick=()=>{$('zoomLabel').textContent='90%'};$('fitBtn').onclick=()=>{$('zoomLabel').textContent='100%'};
function saveFile(data,name,type){let a=document.createElement('a'),u=URL.createObjectURL(new Blob([data],{type}));a.href=u;a.download=name;a.click();URL.revokeObjectURL(u)}$('saveBtn').onclick=()=>saveFile(JSON.stringify({app:'Generational Cell Garden',version:1,name:$('projectName').value,W:state.W,H:state.H,beds:state.beds,paths:state.paths,groups:state.groups},null,2),'generational-cell-garden-project.json','application/json');$('exportBtn').onclick=()=>{let cloneSvg=svg.cloneNode(true);cloneSvg.setAttribute('xmlns',NS);saveFile(new XMLSerializer().serializeToString(cloneSvg),'generational-cell-garden-plan.svg','image/svg+xml')};$('loadBtn').onclick=()=>$('loadInput').click();$('loadInput').onchange=async e=>{let f=e.target.files[0];if(!f)return;try{let d=JSON.parse(await f.text());state.W=d.W||24;state.H=d.H||16;state.beds=d.beds||[];state.paths=d.paths||[];state.groups=d.groups||[];$('projectName').value=d.name||'Importerat projekt';render()}catch(err){alert('Kunde inte öppna projektet: '+err.message)}e.target.value=''};$('newBtn').onclick=()=>{if(!confirm('Skapa ett nytt projekt?'))return;state.beds=[];state.paths=[];state.groups=[];state.selected=null;state.drawing=[];render()};$('undoBtn').onclick=()=>{if(!state.undo.length)return;state.redo.push(JSON.stringify({beds:state.beds,groups:state.groups,paths:state.paths}));let d=JSON.parse(state.undo.pop());Object.assign(state,d);render()};$('redoBtn').onclick=()=>{if(!state.redo.length)return;state.undo.push(JSON.stringify({beds:state.beds,groups:state.groups,paths:state.paths}));let d=JSON.parse(state.redo.pop());Object.assign(state,d);render()};
function setMoveMode(on){state.moveMode=!!on;$('moveModeBtn')?.classList.toggle('active',state.moveMode);$('moveModeBtn')?.setAttribute('aria-pressed',String(state.moveMode));$('status').textContent=state.moveMode?'Flyttläge aktivt – dra en växtcell separat eller rabattens ytterkontur för att flytta hela rabatten.':'Flyttläge av – klick markerar utan att flytta.';}
$('moveModeBtn')?.addEventListener('click',()=>setMoveMode(!state.moveMode));
document.addEventListener('keydown',e=>{const tag=(e.target?.tagName||'').toLowerCase();if(['input','textarea','select'].includes(tag)||e.target?.isContentEditable)return;if((e.key==='m'||e.key==='M')&&!e.metaKey&&!e.ctrlKey&&!e.altKey){e.preventDefault();setMoveMode(!state.moveMode)}if(e.key==='Escape'){state.drawing=[];state.previewPoint=null;setMoveMode(false);render()}});
// Start with a genuinely blank site; the user chooses or generates the site geometry.
renderCatalog();render();
})();
