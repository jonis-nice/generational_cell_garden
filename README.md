# Generational Cell Garden

Fristående SVG-prototyp för naturalistiska planteringsplaner.

## Starta
1. Packa upp ZIP-filen.
2. Öppna mappen `naturalistic_design_studio_dev`.
3. Öppna `index.html` i Chrome eller Firefox.

Ingen installation krävs för grundfunktionerna.

## Nytt i fas 0.4
- Tätare, förskjutet planteringsmönster inom organiska växtöar.
- Oregelbundna loberade konturer och varierande östorlek.
- Mindre symboler och tätare centrumavstånd.
- Fördelning av gruppankare över planteringsytan för att minska stora tomrum.

## Begränsningar
- Fullständig täckningsoptimering av hela planteringsytan saknas fortfarande.
- Krockkontroll mellan olika växtgrupper är inte fullständig.
- Växtpoolen är inte färdiggranskad art för art för färgharmoni, ståndort och vinterståndare.
- Symbolerna är schematiska, inte färdiggranskade botaniska illustrationer.
- Skalenlig tomtimport, bildkalibrering, mätning och PDF-export återstår.
- Webbläsarbaserat end-to-end-test är inte utfört.

## Tester
- `node --check app.js`
- `node --check catalog.js`
- `node tests/geometry-smoke.test.cjs`
- `node tests/perennial-filter.test.cjs`

## Fas 0.5 – Composition Engine
Automatgenereringen har bytts från separata överlappande artöar till ett gemensamt förskjutet planteringsfält. Planteringspunkter fördelas en gång och tilldelas därefter artspecifika, organiskt förvrängda Voronoi-liknande drifter. Detta minskar risken för kollisioner mellan grupper och skapar sammanhängande marktäckning. Se `PHASE-0.5.md` för begränsningar och verifiering.

## Fas 0.6
Automatisk tomtkomposition skapar nu flera separata organiska planteringsrum med ett sammanhängande gångsystem mellan rummen. Växtdrifternas gränsfält har fått riktningsvariation för ett mindre regelbundet uttryck. Se `PHASE-0.6.md` för omfattning och kvarstående begränsningar.


## Fas 0.7

Fas 0.7 introduces more variable site-room geometry, randomized circulation variations, a wider species palette, separate diagram ink and bloom colours, global minimum-spacing checks, adjacency-derived species boundaries and additional botanical symbol families. See `PHASE-0.7.md` for research basis, verification and remaining limitations.


Fas 0.8 – Symbol Library & Composition Refinement: plant locations use randomized Poisson-disc sampling rather than a jittered hexagonal lattice, with global minimum spacing and a bounded symbol count. Species regions use anisotropic, warped seed fields; their borders are derived from local adjacency. The symbol library now distinguishes additional genera and growth forms (including peony, iris, allium, globe thistle, scabious, phlox, anemone, rosette foliage, spike forms and multiple grass architectures). Diagram ink colours are separated from botanical bloom colours. This remains a procedural approximation: species combinations require verified horticultural data, and browser-based visual QA is still outstanding.

## Fas 0.8 – kvalitetsarbete

Fas 0.8 lägger till ljuskravsfiltrering i automatvalet, minskad symbolstorlek för att minska kollisioner, tydligare gränssegment mellan artområden, individuell variation i pennbredd/skissmarkeringar samt explicit symbolmappning för samtliga 76 arter i automatpoolen. Genererade växtsamhällen är fortfarande preliminära. Se `PHASE-0.8-QUALITY-AUDIT.md` för katalogrevision och begränsningar. Kör även `node tests/catalog-quality-audit.cjs` för symbolmappningskontroll.


## Fas 1.1 – svensk övervintring och kompatibilitet
- Perennagruppens svenska A–D/*-system lagras separat från dekorativ vinterstruktur.
- Exakta sortposter skiljs från art-/grupphänvisningar; ingen automatisk överföring till andra sorter.
- `compatibility.js` ger transparent preliminär bedömning och kan returnera `insufficient_data`.
- Se `PROFILE-VIEW-ROADMAP.md` för framtida synkroniserad profil-/sektionsvy.

## Fas 1.2 – integrerat kompatibilitetsfilter
`compatibility.js` används nu i automatisk palettselektion. Urvalet screenas mot hela den växande växtgemenskapen; tydliga ljus- och fuktkonflikter samt D-bedömning filtreras, medan saknade data behålls som osäkerhet. Matrixvalet prioriterar dokumenterade kompositionsroller. Detta är fortfarande en transparent heuristik, inte en fullständig samplanteringsdatabas. Se `PHASE-1.2-COMPATIBILITY-INTEGRATION.md`.

## Database status (2026-11-06)

The catalog contains 150 records: 48 complete source-reviewed profiles, 7 partially reviewed profiles, 92 not yet reviewed, 2 duplicate aliases and 1 excluded woody subshrub. Automatic composition uses only the 48 complete herbaceous perennial, ornamental grass, bulb and reviewed groundcover profiles. Shrubs, trees and climbers remain manual-only. See `PHASE-1.3-DATABASE-EXPANSION.md` for scope and limitations.


## Fas 1.4 – artprofiler och spridningsrisk
- Två nya kompletta profiler: Geranium Rozanne (sortspecifik) och Geranium sanguineum.
- Miscanthus sinensis och Carex oshimensis har fått kompletta artprofiler; svensk härdighet anges inte utan belägg.
- Spridningsrisk dokumenteras separat från allmän växtkompatibilitet. Phalaris arundinacea och Iris pseudacorus hålls utanför automatpoolen på grund av dokumenterat kraftig rhizomspridning. Vinca minor markeras som kontrollerad marktäckare.
- Se PHASE-1.4-DATABASE-QUALITY-AND-SPREAD-RISK.md.

## Fas 1.5 – marktäckare och spridningsrisk
- Granskade marktäckande perenner är nu med i den automatiska kompositionspoolen.
- Hög spridningsrisk är en explicit konflikt i kompatibilitetsmotorn och filtreras bort från automatval.
- Måttlig spridningsrisk visas som varning.
- Se `PHASE-1.5-COMPOSITION-AND-SPREAD-RISK.md`.

## Fas 1.9 – växtmassor

Automatisk generering använder nu sammanhängande Voronoi-celler som täcker planteringsytan. Varje artgrupp representeras av en masspolygon och en botanisk symbol, inte en lång rad enskilda symboler. Beräknat plantantal visas som metadata utifrån area och planteringsavstånd. Se `PHASE-1.9-PLANT-MASS-RENDERING.md`.


## Fas 2.0 – artanpassad gruppstorlek och renare massritning

Se `PHASE-2.0-MASS-SIZING-AND-RENDERING.md`. Den fasta grupparean 0,72 m² är borttagen. Gruppindelningens målstorlek härleds från katalogens planteringsavstånd och diameterheuristik; faktisk area och uppskattat individantal visas separat. Konturutjämningen är ändrad för att minska överskjutande kurvor och den extra interna linjeritningen är borttagen. Alla 10 testfiler passerar. Visuell Chromium-kontroll kunde inte slutföras i denna körning.


## Fas 2.1 – delade driftgränser och artanpassad area

Se `PHASE-2.1-SHARED-DRIFTS-AND-AREA.md`. Växtgruppers målyta beräknas per art från planteringsavstånd, mogen diameter och uppskattat individantal. En viktad tessellering försöker fördela ytan efter dessa mål. Gemensamma polygonkanter används för att förhindra överlappande kurvor och glipor. Faktiska gruppareor kan avvika från målytan och plantantalet är en uppskattning.


## Fas 2.2 – tidigare layoutmodell (ersatt i fas 2.4)
- Standardtomt 10 × 10 m och val 1–10 rabatter.
- Den tidigare hexagonala cirkellayouten och de enkla silhuettvalen har ersatts av fas 2.4:s organiska formbibliotek och polygonbaserade kollisionskontroll.

## Fas 2.3
- Gemensamma gruppgränser använder samma kanoniska Bézier-kurva från båda sidor; reverserade kantpar har separat test.
- Artmassor har tydligare, artseparerade färger och starkare konturer. Standardsymbolen är större.
- Den tidigare hexagonala placeringen är ersatt av slumpad form- och positionsgenerering i fas 2.4.
- Växtkatalogen omfattar 156 poster, varav 54 kompletta källgranskade profiler är tillgängliga för automatisk generering. Fem nya profiler lades till i fas 2.3.
- Se `PHASE-2.3-REFERENCE-READABILITY-AND-GEOMETRY.md` för ändringar, källor och begränsningar.


## Fas 2.4 – organisk rabattgeometri och redigeringsläge (2026-11-06)

- Ersatt den tidigare cirkel-/hexagonplaceringen med ett bibliotek av 18 parametriska rabattfamiljer: mjuk drift, långsträckt drift, njure, öga, månskära, slingrande, tre/fyra sammanhängande rum, asymmetrisk drift, dubbelrum, solfjäder, böljande band, kommaform, delad drift, sammanlänkade fickor, bred meander, böjd gårdsform och oregelbundna planteringsrum.
- Blandat läge väljer form och rotation slumpmässigt. Placering sker med polygonbaserad kollisionskontroll; fritt avstånd mellan rabattpolygoner hålls minst 0,85 m.
- Om slumpmässig packning fastnar används ett slot-baserat reservläge med slumpad formordning. Om tomten inte rymmer angivet antal med gångkravet visas ett felmeddelande i stället för överlapp.
- Frihandsverktyget visar en live-kontur och noder under ritning; punkter jämnas försiktigt när formen slutförs.
- Markering flyttar inte längre grupper automatiskt. Flyttning kräver explicit flyttläge via knappen eller M-tangenten; Escape stänger läget och avbryter pågående frihandsritning.
- Växtarter fördelas i närliggande samhällen kring artankare i stället för strikt växlande ordning. Målytan per drift har ökats och härleds fortfarande från artens planteringsavstånd och mogna diameter.

### Verifiering och begränsningar

- Nya geometrikontroller provar alla 18 formfamiljer och 1–10 rabatter på kompakta och större testtomter.
- Polygonkollisionskontrollen använder exakt segmentavstånd efter snabba begränsningsbox-/cirkeltest.
- Samtliga befintliga katalog-, växturvals-, symbol-, kompatibilitets-, geometriska och delningskontroller körs separat.
- Visuell Chromium-kontroll kunde inte slutföras i denna körmiljö; det slutliga visuella uttrycket måste därför fortfarande granskas i användarens webbläsare.
- Reservplacering kan ge mer regelbunden positionering när slumpmässig packning inte hittar en giltig lösning. Gångkravet är ett minsta fritt avstånd, inte en garanti att varje passage har exakt samma bredd över hela sin längd.

## Fas 2.5 – silhuettvariation och frihandsritning
- Formbiblioteket har utökats till 25 kontrollerade parametriska former med njur-, ögon-, långdrifts-, böjda band- och flerrumsfamiljer.
- Frihandsritning kan göras genom att dra med pekaren; klick-för-klick-ritning finns kvar. Live-förhandsvisningen är mjukt kurvad.
- Slumpplaceraren har fler placeringsförsök och större variationsintervall. Kollisionskravet på minst 0,85 m kvarstår.
- 15 testfiler passerar. Visuell Chromium-verifiering nådde timeout och är inte godkänd.
- Se `PHASE-2.4-ORGANIC-BED-GEOMETRY-AND-EDITING.md` för fas 2.4 och 2.5.


## Fas 2.7 – pedagogiska gestaltningslägen och estetisk växtmatchning
- Gestaltningslägena heter nu **Sammanhängande växtgrupper**, **Basväxt med accenter** och **Blandad ängsplantering**.
- Ny `aesthetic.js` väger samman växtform, bladtextur, höjdskiktning och färgfamilj. Den estetiska rangordningen används efter att tydliga ståndortskonflikter har filtrerats bort.
- Växtform prioriteras före blomfärg: spiror, klot, koner, prästkrageliknande former, vippor, luftiga former, bladmassor och tuvor identifieras i den mån katalogens data medger.
- Katalogen har utökats med åtta perenner och prydnadsgräs: Veronicastrum virginicum, Deschampsia cespitosa, Briza media, Gillenia trifoliata, Knautia arvensis, Festuca glauca, Helictotrichon sempervirens och Calamagrostis brachytricha.
- Svensk härdighetsuppgift registreras endast där svensk källa uttryckligen anger den; övriga nya poster saknar påhittad A–D-klass.
- Estetisk matchning är en transparent heuristik och inte en fullständig professionell gestaltning. Den kräver fortsatt artvis granskning och visuell QA.


## Fas 2.8 – estetisk balans och vinterstruktur
Se `CHANGELOG-2.8.md`. Kompositionsmotorn väger nu form, textur, höjd, färgpalettens sammanhållning och dokumenterad vinterstruktur mer selektivt. Färgkonflikter mellan varma och kalla familjer får avdrag, neutrala växttoner kan fungera som bryggor och urvalet sker från en snävare topprankad kandidatgrupp. Detta är fortsatt en transparent heuristik och kräver visuell kvalitetskontroll.


## Fas 2.9 – växtsamhällen och säsongsförlopp
Se `PHASE-2.9-COMPOSITION-COMMUNITIES-SEASONS.md`. Generatorn klassificerar nu varje artmassa efter funktionell roll, sparar säsongsprofil och väger in vår-, sommar-, höst- och vintervärden i estetiskt urval. Ängsläget använder en mjuk fenologisk rumsgradient. Klassificeringarna är heuristiska och kräver fortsatt visuell och hortikulturell granskning.


## Fas 2.10 – generösare rabatter och rundade växtmassor
Se `CHANGELOG-2.10.md`. Automatlayouten använder större rabattgeometri, lugnare silhuetter och optimerar närmaste kantavstånd mot en gemensam målgångbredd på 0,95 m. Växtmassornas delade kanter får rundade hörn med gemensam kurvgeometri. Visuell webbläsar-QA återstår.


## Fas 2.11
Se `CHANGELOG-2.11.md`: stabil layout med en rabatt per begärd slot, bredare rundning av växtmassor och grannskapsbaserat arturval för att undvika identiska direktgrannar.

Färgade massor använder nu respektive arts blomfärg med låg kontrast i delningslinjerna. Grannskapsurvalet premierar färgmässigt skilda arter och motverkar samma art i direkt angränsande celler.


## Fas 2.15 – återställd visuell grund
Se `CHANGELOG-2.15.md`. Versionen bygger på 2.11 eftersom 2.14:s nya rabattgeometri gav ett sämre visuellt resultat. Symbolerna behåller en symbol per cell men centreras efter cellens synliga geometri.


## 2.16 – global Oudolf project references for bed and planting-mass composition

The 25 selectable bed profiles are now associated with documented Piet Oudolf projects across the Netherlands, USA, England, Germany, Denmark, Spain, Japan, South Korea and Sweden. The project metadata records country, a composition archetype and the public design characteristics used as inspiration. These are interpretive reconstructions, not traced copies or claims of exact original geometry.

The outer bed profile remains generated by the 2.11 parametric hand-drawn geometry. Internal planting-mass seed placement is now guided by the associated reference composition: matrix, blocks, groups/clusters, drifts/ribbons, patchwork/layered or island compositions. The influence is soft rather than a rigid template, preserving variation and full coverage.

The 2.11 drawing/rendering system and botanical symbols are retained. Plant-mass boundaries are drawn with a more explicit 1.5 px outline at full opacity. No ZIP or release package has been generated.

## Geometri 2.21 – nytt referensbaserat formbibliotek
Version 2.21 ersätter de tidigare projektmärkta och alltför generiska silhuetterna med åtta generiska geometriska studier. Inga av formerna påstås vara en viss Piet Oudolf-rabatt eller komma från ett namngivet projekt. Platsgeneratorn lägger nu ut långsträckta fält i en sammanhållen parallell komposition. Växtmassorna delas med ett förskjutet hexagonalt fröfält och kurvade, delade cellgränser för att efterlikna de rundade, pennritade cellerna i användarens referensutsnitt.

### Rabattcellernas formbibliotek
Generatorn innehåller 28 fasta, namngivna silhuetter som kan väljas var för sig eller blandas i en komposition. Formerna omfattar bland annat hallonbåt, halvmåne, njure, blad, båt, mjuk trapets, droppform, sadel, svept band, bönform och rundade planteringsrum. Namnen beskriver geometri och ska inte tolkas som exakta kopior av enskilda Piet Oudolf-projekt.


## 2.23 – Multi-grammar planting cells
The planting-cell generator now offers eight composition grammars (oak veins, river meanders, branching, spiral, braid, linked groves, radial fan, contour terraces). Oak is one option only. Automatic mode chooses one grammar for a complete generation so separate beds share a coherent design language. See CHANGELOG-2.23.md.


## 2.24 – Separat rabattkomposition och växtgenerering
Kompositionsprincipen styr nu de stora rabattcellerna. Växtcellerna genereras separat inuti varje rabatt. Växtgenereringshanteraren har återställts och syntax-/automattester passerar. Se CHANGELOG-2.24.md.


## 2.25 – RC/VC separation
RC composition controls the large rabattceller only. VC generation is separate and runs within each RC. The generation path is covered by regression checks. See CHANGELOG-2.25.md.


## 2.26 – Consistent species visual identity
Every botanical species now receives one deterministic colour, fill-pattern family and symbol orientation. Repeated cells of the same species therefore remain visually identical. Similar species colours are separated through controlled lightness/saturation differences and more distinct fill motifs. See CHANGELOG-2.26.md.

## 2.27 – Botanical species identity
See CHANGELOG-2.27.md. Species portraits are opened from the plant library or the selected species name; photo retrieval requires an internet connection.

## Version 2.28 – ritmotor

SVG-bakgrunden och rutnätet återanvänds mellan renderingar när mått och rutnätsläge är oförändrade. Dynamiska objekt ritas om separat. Delad masskontur beräknas en gång per växtcell och rendering. Projektets synliga namn, metadata och standardfilnamn har ändrats till Generational Cell Garden. Tidigare sparade JSON-projekt kan fortfarande importeras.
