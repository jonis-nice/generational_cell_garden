const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync(require('path').join(__dirname, '..', 'catalog.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(src, context);
const plants = context.window.PLANT_CATALOG;
const complete = plants.filter(p => p.compositionReview === 'granskad_kallor');
const partial = plants.filter(p => p.compositionReview === 'delvis_granskad');
const aliases = plants.filter(p => p.catalogStatus === 'alias');
const excluded = plants.filter(p => p.compositionReview === 'exkluderad_fel_kategori');
const unreviewed = plants.filter(p => p.compositionReview === 'ej_granskad' && p.catalogStatus !== 'alias');
const failures = [];
for (const p of complete) {
  for (const key of ['winterStructure','springValue','summerValue','autumnValue','soilMoisture','soilTexture','habit','flowerColor','verifiedSource','siteCompatibility','compositionRole','compositionRoleBasis']) {
    if (!p[key] || (Array.isArray(p[key]) && !p[key].length)) failures.push(`${p.id} ${p.name}: missing ${key}`);
  }
}
const approved = ['p001','p002','p003','p004','p005','p006','p012','p016','p028','p035','p036','p045','p048','p055','p056','p057','p059','p061','p063','p064','p068','p072','p077','p139','p140','p141','p145','p146'];
for (const id of approved) if (!complete.some(p => p.id === id) && id !== 'p035') failures.push(`Expected reviewed profile missing: ${id}`);
for (const p of aliases) if (!plants.some(x => x.id === p.aliasOf)) failures.push(`${p.id}: alias target missing`);
console.log(`catalog plants=${plants.length}; complete=${complete.length}; partial=${partial.length}; unreviewed=${unreviewed.length}; aliases=${aliases.length}; excluded=${excluded.length}`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('catalog quality audit: PASS');
