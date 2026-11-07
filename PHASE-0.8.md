# Fas 0.8 – Symbol Library & Composition Refinement

## Mål
Minska det regelbundna rutnätsuttrycket, skapa tydligare artskillnader i ritningen och markera verkliga gränser mellan angränsande växtsamhällen.

## Kodändringar
- Ersatt förskjutet hexagonalt plantgitter med slumpmässig Poisson-/dart-throwing-placering.
- Global minimiavståndskontroll mellan alla plantor i samma planteringsyta.
- Begränsat antal symboler per planteringsyta för att hålla renderingskostnaden rimlig.
- Fröområden har anisotrop avståndsberäkning och lågfrekevent domänförvrängning för att skapa varierade drifter, inte cirkulära öar.
- Konturer beräknas från närliggande punkter som tillhör olika artområden.
- Utökat symbolbibliotek med särskilda ritfamiljer för pion, iris, bolltistel, vädd, flox, anemon, kärleksört och två separata grästyper.
- Diagramfärg (artkod/ritfärg) och blomfärg hålls åtskilda.

## Kvalitetsgränser
- Växtpaletten väljs fortfarande heuristiskt. Katalogens `compositionReview`, `winterStructure` och säsongsvärden är inte tillräckligt kvalitetssäkrade för att hävda full botanisk kompatibilitet.
- Symbolfamiljerna är proceduralt ritade och inte individuellt handgranskade för varje art.
- Artgränserna är lokala gränsmarkeringar från grannskap, inte fullständiga exakta Voronoi-polygonskurvor.
- Slutlig visuell kontroll i webbläsare behövs, särskilt på stora planteringsytor och vid export.

## Tester
- `node --check app.js`
- `node --check catalog.js`
- `node tests/geometry-smoke.test.cjs`

Dessa kontroller verifierar syntax och det befintliga geometriska placeringsröret. De ersätter inte webbläsarbaserad visuell kontroll eller botanisk sakkunniggranskning.
