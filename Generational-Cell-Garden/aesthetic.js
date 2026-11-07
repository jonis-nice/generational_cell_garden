/* Naturalistic composition heuristics.
 * Prioritises plant architecture, foliage texture and seasonal structure;
 * colour is treated as a restrained palette, not as the primary selection key.
 * This is a transparent aid, not a reconstruction of any designer's proprietary method.
 */
window.PLANT_AESTHETICS = (() => {
 const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const formOf=p=>{
  const l=norm(p.latin), f=norm(p.flowerColor), h=norm(p.habit), fol=norm(p.foliageCharacter);
  if(/calamagrostis|veronicastrum|salvia|agastache|veronica|liatris|digitalis|persicaria/.test(l)) return 'spike';
  if(/sanguisorba|astilbe|molinia|deschampsia|briza|gillenia|thalictrum/.test(l)) return 'airy';
  if(/echinops/.test(l)) return 'globe';
  if(/eryngium/.test(l)) return 'cone';
  if(/rudbeckia|echinacea|aster|symphyotrichum|helenium|knautia|scabiosa|achillea/.test(l)) return 'daisy';
  if(/eutrochium|eupatorium/.test(l)) return 'dome';
  if(/miscanthus|panicum|pennisetum|helictotrichon|heliktotrichon|festuca|sesleria|hakonechloa|carex/.test(l)) return 'grass';
  if(/alchemilla|nepeta|geranium|waldsteinia|galium|pachysandra|asarum|stachys/.test(l)) return 'mound';
  if(/hosta|pulmonaria|helleborus|actaea/.test(l)) return 'foliage';
  if(/astrantia/.test(l)) return 'button';
  if(/hylotelephium/.test(l)) return 'flat_cluster';
  if(/iris|fritillaria|narcissus|crocus|scilla|galanthus/.test(l)) return 'architectural';
  if(/phlox|monarda/.test(l)) return 'cluster';
  if(/lamprocapnos/.test(l)) return 'arch';
  if(/tuva|tuvbildande/.test(h)) return 'mound';
  if(/gräs|vippa/.test(fol+' '+h)) return 'grass';
  return 'cluster';
 };
 const colourOf=p=>{
  const s=norm(p.flowerColor);
  if(!s)return 'unknown';
  const hasWarm=/gul|orange|guld|rost|koppar/.test(s);
  const hasCool=/violett|lila|bla|purpur|indigo/.test(s);
  const hasRose=/rosa|magenta|rod|vinrod|karmosin/.test(s);
  const hasNeutral=/vit|kram|cream|silver|gron|brun|halm|diskret/.test(s);
  const n=[hasWarm,hasCool,hasRose].filter(Boolean).length;
  if(n>1)return 'multicolour';
  if(hasWarm)return 'warm';
  if(hasCool)return 'cool';
  if(hasRose)return 'rose';
  if(hasNeutral)return 'neutral';
  return 'unknown';
 };
 const textureOf=p=>{
  const s=norm((p.foliageCharacter||'')+' '+(p.habit||''));
  if(/finblad|smala blad|luftig|transparent|tunna stjalkar/.test(s)) return 'fine';
  if(/grova|stora blad|bredblad|kottig|tjocka blad/.test(s)) return 'bold';
  if(/aromatisk|silvrig|harig|luden|bla gra|blagra/.test(s)) return 'soft';
  return 'medium';
 };
 const heightOf=p=>Number(p.height)||0.5;
 const winterOf=p=>{
  const s=norm(p.winterStructure);
  if(/hog|arkitekton|framtradande|dekorativ|fruk/ .test(s))return 2;
  if(/medel|viss struktur|kan sta kvar/.test(s))return 1;
  if(/lag|svag|saknar|inte/.test(s))return 0;
  return p.winterStructure?1:0;
 };

 const rolesOf=p=>{const r=Array.isArray(p.compositionRole)?p.compositionRole:[p.compositionRole].filter(Boolean);return r.map(x=>norm(x))};
 const structuralRole=p=>{
  const r=rolesOf(p),f=formOf(p),w=winterOf(p);
  if(r.some(x=>/matrix|groundcover|foliage_mass|low/.test(x))||['mound','foliage'].includes(f))return 'matrix';
  if(r.some(x=>/winter_skeleton|structural_grass|winter_foliage/.test(x))||w>=2||f==='grass')return 'structure';
  if(r.some(x=>/vertical_accent|sculptural/.test(x))||['spike','cone','globe','architectural'].includes(f))return 'accent';
  if(r.some(x=>/airy|textural|pollinator/.test(x))||['airy','daisy','button'].includes(f))return 'weaver';
  return 'support';
 };
 const seasonSignals=p=>{
  const fields=[p.springValue,p.summerValue,p.autumnValue,p.winterStructure].map(x=>norm(x));
  const tests=[
   /var|tidig|bladutveck|lök|vark|april|maj/,
   /blom|blomning|sommar|ax|vippor|juni|juli|augusti/,
   /host|frukt|fröst|fruk|avblom|farg|oktober|september/,
   /vinter|fröställ|stjalk|struktur|sta kvar|arkitekton/
  ];
  return fields.map((s,i)=>!!s&&tests[i].test(s));
 };
 const seasonalProfile=p=>{
  const signals=seasonSignals(p);
  const known=[p.springValue,p.summerValue,p.autumnValue,p.winterStructure].filter(Boolean).length;
  return {signals,known,coverage:signals.filter(Boolean).length/4};
 };
 const communityPlan=plants=>{
  const counts={matrix:0,structure:0,accent:0,weaver:0,support:0};
  plants.forEach(p=>counts[structuralRole(p)]++);
  const seasons=[0,0,0,0],known=[0,0,0,0];
  plants.forEach(p=>seasonSignals(p).forEach((v,i)=>{if(v)seasons[i]++;if([p.springValue,p.summerValue,p.autumnValue,p.winterStructure][i])known[i]++}));
  const populated=seasons.filter(x=>x>0).length;
  const balance=seasons.reduce((n,x)=>n+(x?1:0),0)/4;
  return {counts,seasons,known,seasonalBalance:balance,rolesComplete:plants.length?Object.values(counts).filter(x=>x>0).length/5:0};
 };
 const rolePlacement=(p,mode)=>{
  const role=structuralRole(p);
  if(mode==='matrix')return role==='matrix'?'bas':role==='structure'?'struktur':'accent';
  if(role==='matrix')return 'matta';
  if(role==='structure'||role==='accent')return 'vertikal accent';
  if(role==='weaver')return 'utfyllnad';
  return 'följeväxt';
 };
 const pair=(a,b)=>{
  const fa=formOf(a),fb=formOf(b),ta=textureOf(a),tb=textureOf(b),ca=colourOf(a),cb=colourOf(b);
  let score=0,reasons=[];
  // Form repetition establishes rhythm; contrast prevents monotony.
  if(fa!==fb){score+=2.0;reasons.push('kompletterande växtformer')}
  else {score+=0.9;reasons.push('upprepad form skapar rytm')}
  if(ta!==tb){score+=1.4;reasons.push('kontrast mellan bladtexturer')}
  else score+=0.55;
  const ha=heightOf(a),hb=heightOf(b),ratio=Math.max(ha,hb)/Math.max(.1,Math.min(ha,hb));
  if(ratio>=1.35&&ratio<=3.2){score+=1.2;reasons.push('tydlig höjdskiktning')}
  else if(ratio>4)score-=0.35;
  else score+=0.45;
  if(ca==='unknown'||cb==='unknown'||ca==='multicolour'||cb==='multicolour')score+=0.15;
  else if(ca===cb){score+=1.0;reasons.push('sammanhållen färgfamilj')}
  else if(ca==='neutral'||cb==='neutral'){score+=1.05;reasons.push('neutral färg binder samman paletten')}
  else if((ca==='cool'&&cb==='rose')||(ca==='rose'&&cb==='cool')){score+=1.0;reasons.push('närliggande svala färger')}
  else if((ca==='warm'&&cb==='cool')||(ca==='cool'&&cb==='warm')){score-=0.25;reasons.push('stark varm/kall kontrast')}
  else score+=0.2;
  const wa=winterOf(a),wb=winterOf(b);
  if(wa>0&&wb>0){score+=.45;reasons.push('båda bidrar med vinterstruktur')}
  return {score,reasons,forms:[fa,fb],colours:[ca,cb]};
 };
 const rankAgainstCommunity=(candidate,community)=>{
  if(!community.length)return {score:0,reasons:[],form:formOf(candidate),colour:colourOf(candidate)};
  const pairs=community.map(p=>pair(candidate,p));
  const avg=pairs.reduce((n,x)=>n+x.score,0)/pairs.length;
  const forms=[...community.map(formOf),formOf(candidate)];
  const colours=[...community.map(colourOf),colourOf(candidate)].filter(c=>!['unknown','multicolour'].includes(c));
  const formCounts=forms.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
  const formDiversity=Object.keys(formCounts).length;
  const dominantForm=Math.max(...Object.values(formCounts))/forms.length;
  const colourSet=new Set(colours),paletteDiversity=colourSet.size;
  const warmCool=colourSet.has('warm')&&colourSet.has('cool');
  // Keep a coherent palette while allowing neutral bridges and controlled accents.
  const colourPenalty=Math.max(0,paletteDiversity-3)*1.35+(warmCool?1.0:0);
  // Reward repeated forms in a legible rhythm; penalise an unstructured "one of everything" mix.
  const rhythmBonus=dominantForm>=.28?.65:dominantForm>=.20?.3:0;
  const scatterPenalty=formDiversity>5?(formDiversity-5)*.35:0;
  const winterAverage=[...community,candidate].reduce((n,p)=>n+winterOf(p),0)/(community.length+1);
  const winterBonus=winterAverage>=1.1?.55:0;
  const season=communityPlan([...community,candidate]);
  const seasonalBonus=season.seasonalBalance*.9+(season.counts.structure>0?.25:0);
  return {score:avg+rhythmBonus+winterBonus-colourPenalty-scatterPenalty+seasonalBonus,
   seasonalBonus,seasonal:season.seasons,roles:season.counts,reasons:[...new Set(pairs.flatMap(x=>x.reasons))],form:formOf(candidate),colour:colourOf(candidate),
   paletteDiversity,formDiversity,winterAverage,colourPenalty};
 };
 return {formOf,colourOf,textureOf,winterOf,rolesOf,structuralRole,seasonSignals,seasonalProfile,communityPlan,rolePlacement,pair,rankAgainstCommunity};
})();
