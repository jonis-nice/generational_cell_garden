# Fas 0.4 – tätare naturalistiska växtöar

## Ändringar
- Växtgrupper skapas som oregelbundna, loberade öar med ungefärlig målsättning runt 0,8–1,35 m² beroende på grupproll.
- Plantor placeras i förskjutet, lätt jitterat rutnät inom varje ö.
- Symbolernas diameter hålls mindre än tidigare och placeringen använder ett tätare centrumavstånd.
- Automatiskt genererade gruppankare läggs över planteringsytan i ett förskjutet fält för att minska stora tomma luckor.
- Grupperna består av arter ur den befintliga automatiska perennpoolen.

## Kända begränsningar
- Öarnas ungefärliga area är en parameter i ritmotorn, inte en garanterad exakt kvadratmeter efter klippning mot planteringsytans polygon.
- Det finns ännu ingen global Voronoi-/täckningsoptimering som garanterar att varje punkt i planteringsytan täcks av en växtgrupp.
- Krockkontroll mellan olika arter/grupper är inte fullständig. Tätare placering kan därför fortfarande ge vissa symbolkollisioner.
- Arturvalet är ännu inte individuellt botaniskt kvalitetssäkrat för färgharmoni, ståndort och vinterstruktur.
- Visuell webbläsarkontroll är inte genomförd i denna byggmiljö.

## Tester
Körda vid paketering:
- `node --check app.js`
- `node --check catalog.js`
- `node tests/geometry-smoke.test.cjs`
- `node tests/perennial-filter.test.cjs`
