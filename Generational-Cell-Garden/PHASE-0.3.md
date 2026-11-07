# Fas 0.3 – Perennkomposition och säsongsdata

## Första implementerade avgränsning
- Automatisk generering använder nu endast katalogkategorierna `Perenner`, `Prydnadsgräs` och `Lökväxter`.
- Buskar, träd, barrträd, klätterväxter och marktäckare ingår inte i automatisk generering i denna version. Marktäckarkategorin är botaniskt blandad och behöver artgranskas innan enskilda arter kan godkännas.
- Varje katalogpost har fått explicita fält för kompositionsgranskning, vinterstruktur och säsongsvärde. Okända uppgifter är `null`; de har inte fyllts med uppskattningar.
- Växtdata är markerad `ej_granskad` tills artens ståndort, färg, form, blomning och vinterstruktur har verifierats.

## Viktig begränsning
Denna version garanterar inte att genererade arter är estetiskt eller ekologiskt kompatibla med varandra. Den begränsar endast automatpoolen och skapar en datamodell som kan bära verifierade uppgifter. Fullständig kuratering kräver artvis källgranskning och kompositionsregler.

## Nästa utvecklingssteg
1. Granska varje art med tillförlitliga svenska odlings-/botaniska källor.
2. Dokumentera ljus, fukt, jord, härdighet, höjd, bredd, blomfärg, blomningstid och vinterstruktur.
3. Skapa kompatibilitetsregler och uteslut kombinationer med oförenliga ståndortskrav.
4. Bygg säsongsvis poängsättning: vår, sommar, höst och vinter.
5. Bygg en kompositionsgenerator som väljer matrix, följeväxter och accenter utifrån både ståndort och helårsgestaltning.

## Tester
- `node --check app.js`
- `node --check catalog.js`
- `node tests/perennial-filter.test.cjs`
- `node tests/geometry-smoke.test.cjs`
