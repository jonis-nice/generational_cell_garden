const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync(require('path').join(__dirname, '..', 'app.js'), 'utf8');
const start = src.indexOf('function symbolType(');
const end = src.indexOf('function botanicalBloomColor', start);
if (start < 0 || end < 0) throw new Error('symbolType function not found');
const context = {};
vm.createContext(context);
vm.runInContext(src.slice(start, end) + '\nthis.symbolType = symbolType;', context);
const cases = [
  ['Perenner', 'Lavandula angustifolia', 'lavender'],
  ['Perenner', 'Rudbeckia fulgida', 'rudbeckia'],
  ['Perenner', 'Galanthus nivalis', 'snowdrop'],
  ['Perenner', 'Paeonia lactiflora', 'peony'],
  ['Perenner', 'Iris sibirica', 'iris'],
  ['Perenner', 'Allium giganteum', 'sphere'],
  ['Perenner', 'Digitalis purpurea', 'digitalis'],
  ['Perenner', 'Hosta sieboldiana', 'rosetteSpotted'],
  ['Prydnadsgräs', 'Molinia caerulea', 'finegrass'],
  ['Prydnadsgräs', 'Calamagrostis × acutiflora', 'featherygrass'],
  ['Perenner', 'Echinops bannaticus', 'echinops'],
  ['Perenner', 'Knautia macedonica', 'button']
];
for (const [category, latin, expected] of cases) {
  const actual = context.symbolType(category, latin);
  if (actual !== expected) throw new Error(`${latin}: expected ${expected}, got ${actual}`);
}
console.log(`symbol library mappings ${cases.length}/${cases.length} passed`);
