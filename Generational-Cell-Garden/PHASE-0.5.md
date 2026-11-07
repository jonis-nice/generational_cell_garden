# Fas 0.5 – Composition Engine

## Syfte
Byta ut oberoende, överlappande cirkel-/ögrupper mot en gemensam planteringsyta med sammanhängande artspecifika drifter.

## Kodförändringar
- Automatgenerering använder ett gemensamt förskjutet hexagonalt planteringsfält över varje planteringspolygon.
- Varje planteringspunkt tilldelas exakt en artgrupp genom ett förvrängt Voronoi-liknande fält.
- Lågfrekvent koordinatförvrängning ger organiska, slingrande gruppgränser i stället för runda öar.
- Artsammansättningen upprepas med en begränsad perenn-/gräspalett för rytm.
- Växtsymbolernas centrum placeras på ett gemensamt gleshetskontrollerat nät, vilket förhindrar att två genererade grupper placerar en planta på samma punkt.
- Genererade grupper ritas utan överlappande fyllda masscirklar; symbolerna bygger själva färg- och texturytan.
- Renderingen använder gruppens seed-center när gruppen saknar separat konturpolygon.

## Begränsningar
- Voronoi-fördelningen är en första algoritmisk approximation, inte en reproduktion av en specifik Oudolf-plan.
- Kompatibilitet mellan arter är ännu inte botaniskt kvalitetssäkrad; arturvalet är fortfarande preliminärt.
- Symbolernas artunika grafiska uttryck behöver byggas ut för hela katalogen.
- Visuell browser-QA och prestandatest med stora tomter återstår.
- Gång- och planteringsrumslogik är ännu inte ombyggd till en fullständig kompositionsmotor.

## Verifiering
- `node --check app.js`
- `node --check catalog.js`
- `node tests/geometry-smoke.test.cjs`
