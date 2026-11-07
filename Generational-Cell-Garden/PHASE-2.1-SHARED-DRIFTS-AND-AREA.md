# Fas 2.1 – artanpassade driftareor och delad geometri

## Problem från användarens skärmbild
- Individuellt utjämnade Voronoi-celler gav gränskurvor som inte längre följde samma gemensamma kant. Resultatet blev överlappande och korsande linjer.
- Symbolerna var oproportionerligt stora i förhållande till respektive drift.
- Gruppstorlek behöver styras av artens planteringsavstånd och förväntat antal individer per drift, inte av ett universellt area-värde.

## Ändringar
1. Grupparean beräknas per art från planteringsavstånd, mogen diameter och ett artberoende antal individer per drift.
2. Varje seed tilldelas en art innan cellerna beräknas.
3. En viktad Voronoi-/power-diagram-iteration justerar cellarean mot artens målyta, samtidigt som cellerna delar exakta gränser och täcker planteringsytan.
4. Oberoende kurvutjämning av varje cell har tagits bort. Den orsakade geometriska avvikelsen där angränsande celler inte längre delade samma kant. Delade polygonkanter används nu för att förhindra överlappning och glipor.
5. Gruppsymbolen har reducerats till en diskret signatur; den är inte längre en stor blomikon som konkurrerar med massan.
6. Gruppytan har fortsatt en egen klickbar polygon. Artbyte behåller den valda gruppens polygon och räknar om plantantalet utifrån den nya artens planteringsavstånd.
7. Generera om behåller gruppens befintliga polygonram och varierar formen försiktigt.

## Areamodell
Målytan för varje art beräknas från:
- planteringsavstånd (meter),
- mogen diameter som storleksindikator,
- ett uppskattat antal individer per drift (3–6 beroende på storlek).

Målytorna skalas proportionellt så att de tillsammans täcker planteringsytan. Power-diagrammet närmar sig dessa mål under ett begränsat antal iterationer. Faktisk cellarea kan avvika från målytan på grund av planteringsytans form och granncellernas läge. Plantantalet beräknas från faktisk area och avstånd. Det är en uppskattning, inte en biologisk garanti.

## Begränsningar
- Gemensamma gränser är nu geometriskt konsekventa men raka segment. Nästa visuella steg bör vara en gemensam kantmodell som skapar organiska kurvor en gång per delad kant, inte separat per polygon.
- Artens mogna diameter och planteringsavstånd är ofullständiga för delar av katalogen. Saknade värden använder försiktiga standardvärden och bör visas som osäkra.
- Generatorn är fortfarande en designheuristik, inte en automatisk landskapsarkitekt.

## Tester
- `node --check app.js`
- Samtliga `tests/*.cjs`
- `generation-render.test.cjs` uppdaterat för gemensamma polygonkanter och klickbar gruppyta.
- Headless Chromium försöktes men nådde timeout i denna miljö; ingen visuell webbläsarverifiering redovisas.
