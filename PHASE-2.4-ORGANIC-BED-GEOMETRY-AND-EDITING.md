# Fas 2.4 – organisk rabattgeometri och redigeringsläge

## Syfte
Minska det regelbundna cirkel-/cellintrycket och skapa varierade, långsträckta och sammanhängande rabattformer med läsbara gångrum. Separera markering från flyttning och göra frihandsritning synlig under pågående arbete.

## Implementerat
- 18 parametriska rabattfamiljer med varierad aspekt, asymmetri, mjuka lober och kontrollerad formvariation.
- Slumpmässig positionering och rotation med polygonbaserad kollisionskontroll.
- Minsta fria avstånd 0,85 m mellan rabattpolygoner. Om slumpmässig packning fastnar används ett reservläge med slumpad formordning i dimensionerade platser.
- Frihandsritning visar aktuell linje, punkter och startpunkt under ritning; slutförd kontur jämnas försiktigt.
- Växtgrupper flyttas endast i explicit flyttläge via knapp eller M-tangent. Escape stänger läget.
- Artfördelning klustras geografiskt kring artankare för att undvika strikt alternerande mosaik.
- Driftarnas målyta har ökats och baseras fortsatt på planteringsavstånd och mogen diameter.

## Kvalitetskontroller
`tests/naturalistic-bed-forms.test.cjs` testar formbibliotek, geometri, 1–10 rabatter och minsta passageavstånd. `tests/generation-render.test.cjs` testar integrationens kontrollpunkter. Övriga testfiler granskar katalog, kompatibilitet, symboler, växtpool och massgeometri.

## Kända begränsningar
- Det fria avståndet är ett minimiavstånd; det garanterar inte identisk gångbredd över alla kurvsegment.
- Reservläget kan bli mer ordnat än huvudläget.
- Visuell Chromium-verifiering kunde inte genomföras i körmiljön.
- Den befintliga Voronoi-/power-cellbaserade fördelningen används fortfarande för växtmassor inne i varje rabatt. Artankare gör fördelningen mer sammanhängande, men den är ännu inte en fullständig manuell Oudolf-liknande kompositionsmotor.

## Fas 2.5 – silhuettvariation och frihandsritning (2026-11-06)

### Ändringar
- Formbiblioteket utökat från 18 till 25 parametriska silhuetter. Former styrs nu med superellipsbas, lågfrekeventa asymmetrier, kontrollerade konkaviteter, ögon-/njurinslag och böjda band. Högfrekvent vågighet har reducerats för att undvika taggiga/blobblika konturer.
- Konturupplösningen är 64 punkter per form för att hålla kollisionskontrollen snabb nog även vid 1–10 rabatter.
- Slumpplaceraren gör fler försök och har bredare variation i proportioner och storlek innan reservplacering används.
- Frihandsritning fungerar nu genom att dra med musen/pekaren. Klick-för-klick-ritning finns kvar som alternativ. Förhandslinjen använder mjuka kvadratiska kurvsegment och tät frihandsslinga jämnas försiktigt vid slutförande.
- Formbibliotekets samtliga 25 val finns i gränssnittet.
- Nya tester täcker formfamiljernas parametrar och frihandsinteraktionen.

### Kvalitetskontroller
- `node --check app.js` passerar.
- Samtliga 15 testfiler passerar, inklusive kontroller av alla 1–10 rabattantal på två tomtstorlekar och full polygonupplösning i gångavståndstestet.

### Kvarstående begränsningar
- Gångbredden är fortfarande ett verifierat minimiavstånd mellan rabattpolygoner, inte en globalt konstant bredd längs varje krökning.
- Slumpplaceraren kan använda reservplacering när den inte hittar en giltig slumpad packning; den kan då bli mer regelbunden.
- Headless Chromium nådde timeout i denna körning, så ingen ny visuell webbläsarverifiering kan rapporteras.
- Växtmassornas interna tessellering är fortfarande power-cell/Voronoi-baserad. Formförbättringen gäller rabattpolygonerna, inte en fullständig manuell Oudolf-liknande kompositionsmotor.
