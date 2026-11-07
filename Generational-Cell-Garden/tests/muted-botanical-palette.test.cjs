const assert=require('assert'),fs=require('fs'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const pattern=src.slice(src.indexOf('function massPattern('),src.indexOf('function render(){'));
assert(pattern.includes('speciesVisualProfile'),'species palette must be derived from plant characteristics');
assert(pattern.includes("fill:profile.inner")&&pattern.includes('outline:profile.foliage'),'cell must distinguish inner foliage/flower colour from foliage outline');
assert(pattern.includes("profile.accent"),'pattern must use species accent pigment');
assert(pattern.includes("profile.motif==='berry'")&&pattern.includes("profile.motif==='flowercluster'"),'fruiting and large flower clusters need distinct motifs');
console.log('botanical colour and fill grammar: PASS');
