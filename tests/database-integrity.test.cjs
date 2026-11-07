const fs=require('fs'),vm=require('vm');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/../catalog.js','utf8'),ctx);
const plants=ctx.window.PLANT_CATALOG;
const ids=new Set();const errors=[];
const completeFields=['winterStructure','springValue','summerValue','autumnValue','soilMoisture','soilTexture','habit','flowerColor','verifiedSource','siteCompatibility','compositionRole'];
for(const p of plants){
  if(ids.has(p.id)) errors.push(`duplicate id ${p.id}`); ids.add(p.id);
  if(!p.name||!p.latin||!p.category) errors.push(`${p.id}: missing identity/category`);
  if(p.winteringRating && (!p.winteringRatingSource||!p.winteringRatingSourceUrl||!p.winteringRatingNote)) errors.push(`${p.id}: winter rating without provenance`);
  if(p.compositionReview==='granskad_kallor'){
    for(const k of completeFields) if(!p[k]||(Array.isArray(p[k])&&!p[k].length)) errors.push(`${p.id}: complete profile missing ${k}`);
    if(!p.compositionRoleBasis) errors.push(`${p.id}: missing distinction between design role and botanical fact`);
  }
  if(p.catalogStatus==='alias'&&!plants.some(x=>x.id===p.aliasOf)) errors.push(`${p.id}: alias target missing`);
  if(p.compositionReview==='delvis_granskad'&&!p.verifiedSource) errors.push(`${p.id}: partial review without source`);
}
const auto=plants.filter(p=>['Perenner','Prydnadsgräs','Lökväxter','Marktäckare'].includes(p.category)&&p.compositionReview==='granskad_kallor'&&p.verifiedSource);
if(auto.some(p=>['Buskar','Träd','Barrträd','Klätterväxter'].includes(p.category))) errors.push('woody plant in automatic perennial pool');
if(auto.some(p=>!p.compositionRole||!p.siteCompatibility||!p.winterStructure)) errors.push('incomplete plant entered automatic pool');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`database integrity: PASS (${plants.length} records; ${auto.length} reviewed herbaceous perennials/bulbs/grasses/groundcovers)`);
