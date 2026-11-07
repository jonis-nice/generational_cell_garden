const fs=require('fs'),vm=require('vm');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/../catalog.js','utf8'),ctx);
const catalog=ctx.window.PLANT_CATALOG;
const pool=catalog.filter(p=>['Perenner','Prydnadsgräs','Lökväxter','Marktäckare'].includes(p.category)&&p.compositionReview==='granskad_kallor'&&p.verifiedSource);
if(pool.length<53) throw new Error(`Expected at least 54 reviewed auto plants, got ${pool.length}`);
if(pool.some(p=>!p.winterStructure||!p.siteCompatibility||!p.compositionRole||!p.flowerColor)) throw new Error('Auto pool contains incomplete plant profile');
if(!pool.some(p=>p.category==='Marktäckare')) throw new Error('Reviewed groundcovers must be eligible for automatic composition');
if(pool.some(p=>p.latin==='Lavandula angustifolia')) throw new Error('Woody lavender incorrectly included in perennial pool');
console.log(`automatic plant pool=${pool.length}; reviewed herbaceous perennials/grasses only: PASS`);
