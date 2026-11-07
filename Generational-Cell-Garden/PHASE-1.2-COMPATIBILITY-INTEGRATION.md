# Fas 1.2 – kompatibilitetsfilter i automatisk växtval

## Genomfört
- `compatibility.js` jämför nu ljusintervall, grova fuktintervall, svensk övervintringsbedömning och höjd.
- Okända värden behandlas som okända. De ger inte automatiskt ett avslag.
- Tydliga konflikter filtreras bort: skilda ljusintervall, torrt mot fuktigt samt övervintringsbedömning D.
- `väldränerad` tolkas inte längre som synonymt med torrt.
- Kandidater bedöms mot hela den redan valda växtgemenskapen vid varje tillägg, inte bara mot matrixarten.
- Matrix väljs i första hand bland poster med rollerna `matrix`, `matrix_edge` eller `repeated_drift`.
- Urvalet premierar fortfarande höjd-/breddkontrast och vinterstrukturella roller, men kompatibilitet påverkar rangordningen.
- Lökväxter screenas mot den valda paletten innan de läggs till.

## Viktiga begränsningar
- Detta är ett konservativt regelbaserat filter, inte en fullständig botanisk samplanteringsdatabas.
- Höjdskillnad är ett kompositionsvärde, inte bevis på ekologisk kompatibilitet.
- Fuktklassningen är avsiktligt grov och måste utvecklas med strukturerade intervall för jordfuktighet.
- Perennagruppens A–D/* är ett svenskt övervintringsstöd, inte en garanti för etablering på varje plats.
- Katalogen innehåller fortfarande endast 17 källgranskade poster av 150; automatpoolen är därför begränsad.

## Verifiering
- `node --check app.js`
- `node --check compatibility.js`
- `node tests/compatibility-smoke.test.cjs`
- `node tests/catalog-quality-audit.cjs`
- `node tests/plant-pool-smoke.test.cjs`
- `node tests/geometry-smoke.test.cjs`

Webbläsarbaserad visuell granskning är inte utförd i denna fas.
