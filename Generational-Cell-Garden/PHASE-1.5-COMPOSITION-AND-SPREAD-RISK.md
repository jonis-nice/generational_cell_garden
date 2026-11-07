# Fas 1.5 – integrering av marktäckare och spridningsrisk

Datum: 2026-11-06

## Ändringar
- Granskade marktäckande perenner ingår nu i generatorns urval och kan bidra som matrix eller låg marktäckande komponent.
- Växter med `spreadRisk: high` filtreras bort från automatpoolen.
- Kompatibilitetsmotorn returnerar konflikt för hög spridningsrisk och lämnar en tydlig varning för måttlig risk.
- `Phalaris arundinacea` och `Iris pseudacorus` har dokumenterad hög spridningsrisk och är inte automatiskt valbara.
- `Vinca minor` har måttlig spridningsrisk och kräver kontroll; den är ännu inte källgranskad för automatpoolen.
- Äldre test som låste poolen till 17 eller 44 poster har uppdaterats så att de testar aktuella kvalitetskrav i stället för historiska siffror.

## Databasstatus
- 150 poster totalt.
- 48 kompletta källgranskade profiler.
- 7 delvis granskade.
- 92 ogranskade.
- 2 aliasposter.
- 1 exkluderad vedartad halvbuske.
- 48 automatiskt valbara profiler före eventuell kompatibilitetsfiltrering för en specifik tomt.

## Tester
Samtliga åtta CJS-testfiler passerar, liksom `node --check` för `app.js`, `catalog.js` och `compatibility.js`.

## Begränsningar
- Spridningsrisk är ännu en enkel kategorisering (low/medium/high), inte en dynamisk modell av jordmån, konkurrens, bevattning och skötsel.
- Kompatibilitetsmotorn är en försiktig screening, inte en bevisad samplanteringsmatris.
- Automatpoolens 48 poster är inte likvärdigt svenska i härdighetssäkerhet; där svensk A–D/*-klass saknas måste gränssnittet visa detta.
- Ingen lyckad headless webbläsargranskning kunde genomföras i denna körmiljö; Chromium fastnade vid uppstart. Funktionell visuell QA återstår.
