# Naturalistic Design Studio 2.10 – generösare planteringsrum och rundade massor

## Ändringar
- Ökat grundskalan för automatiskt placerade rabatter från 0,61 till 0,70 av tomtens arealbaserade skalfaktor, med högre övre gräns. Det ger generösare planteringsytor när tomten skalas upp.
- Begränsat flera rabattformer till lugnare, rundare silhuetter: mindre amplitud, mildare inskärningar och färre spetsiga variationer.
- Ökat målavståndet mellan rabattkanter till 0,95 m.
- Placeringspoängen väger nu samman den nya rabattens avstånd till närmaste rabatt och befintliga rabatternas närmaste grannavstånd. Det jämnar ut gångbredden i hela gruppen i stället för att bara optimera den senast placerade rabatten.
- Bytt växtmassornas hörn till rundade kvadratiska kurvövergångar. Delade gränser behåller en gemensam kurvgeometri så att intilliggande växtceller inte får oberoende glipor.

## Kvalitetskontroll
- 20/20 automatiska tester passerar.
- JavaScript-syntax kontrollerad.
- ZIP-arkiv verifierat.
- Visuell webbläsar-QA är ännu inte utförd. 0,95 m är en optimerad målgångbredd, inte en matematisk garanti för identiskt avstånd mellan varje punkt på alla rabattkanter.
