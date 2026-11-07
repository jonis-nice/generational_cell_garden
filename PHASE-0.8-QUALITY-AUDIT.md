# Fas 0.8 – kvalitetsarbete och begränsningar

## Genomförda kodändringar

- Automatgenereringens artpalett filtreras nu på överlappande dokumenterade ljuskrav. Det minskar uppenbara kombinationer av sol- och skuggväxter.
- Paletten är mindre och väljs med viss variation i höjd och diameter i stället för helt likformigt slumpurval.
- Växtsymbolerna har mindre maximal ritdiameter (0,25 m ritdiameter i planens koordinater) för att hålla symbolernas visuella utbredning under placeringsmotorns minimiavstånd (minst 0,29 m).
- Gränssegment mellan närliggande artområden har förlängts så att de läses tydligare som konturer.
- Symbolernas pennbredd och små skissmarkeringar varierar individuellt.
- Artspecifik mappning har kompletterats för iris, fingerborgsblomma, nejlikor, fjäderborstgräs och Melica.
- Genererade grupper märks internt som preliminära; vinterstruktur markeras bara verifierad om katalogen faktiskt innehåller uppgift.

## Viktig datakvalitetsrevision

Katalogen innehåller 150 växtposter. De 76 arter som får användas i automatgenerering har nu samtliga en uttrycklig symbolfamilj; ingen av dessa faller längre tillbaka på standardsymbolen. Totalt används 35 symbolfamiljer i katalogen. Vid kontroll hade samtliga 150:

- `compositionReview: "ej_granskad"`
- `winterStructure: null`
- `springValue: null`
- `summerValue: null`
- `autumnValue: null`
- `siteCompatibility: null`

Det betyder att det ännu inte går att hävda att automatiskt valda växtsamhällen är botaniskt kvalitetssäkrade över året. Ljuskrav, höjd, diameter och blomningsperiod finns i katalogen och kan användas som preliminära filter, men de ersätter inte individuell artgranskning av jordmån, fukt, konkurrens, vinterståndare och säsongsstruktur.

## Vad som inte ska döljas

- Symbolfamiljer är fortfarande handkodade abstraheringar, inte verifierade botaniska ritningar för alla 150 arter.
- Konturerna är segmentbaserade gränsmarkeringar och inte ännu en fullständig, slät topologisk vektorgräns för varje artmassa.
- Automatisk växtkomposition är preliminär tills artdata har granskats.
- Visuell webbläsargranskning krävs innan denna fas kan godkännas visuellt.

## Tester

- `node --check app.js`
- `node --check catalog.js`
- `node tests/geometry-smoke.test.cjs`
- `node tests/catalog-quality-audit.cjs` – 76/76 automatarter har uttrycklig symbolmappning; Iris, Digitalis och Rudbeckia kontrolleras särskilt.
- Katalogrevision: 150 poster; vinter- och säsongsfält saknas på samtliga.
