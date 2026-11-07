# Fas 1.1 – växtdatabas, svensk övervintring och kompatibilitet

## Svensk härdighet
Perennagruppens A/A*/B/B*/C/C*/D-system beskriver sannolikheten för lyckad övervintring under rätt ståndort. Det är inte en geografisk zonkarta. A = pålitligt; B = vanligtvis; C = ibland; D = övervintrar inte; asterisk anger särskilt krav på väldränerat läge.

Källa: Perennagruppen, 200-listan 2021, s. 4–5 och artsidorna.
https://perenner.se/wp-content/uploads/2023/02/200-listan-2021.pdf

## Viktig datamodellering
- Övervintringsbokstav sparas i `winteringRating`.
- `winteringRatingScope` anger om källan gäller exakt sort, art eller endast grupp.
- Betyg för en sort får inte automatiskt kopieras till en annan sort.
- Dekorativ vinterstruktur (`winterStructure`) är separat från biologisk övervintring (`winteringRating`).

## Kompatibilitetsmotor
`compatibility.js` ger en försiktig preliminär jämförelse av ljus, tillgängligt vinterbetyg, höjd och fukttext. Konflikter markeras `avoid`; otillräckliga data ger `insufficient_data`. Den får inte presentera sig som fullständig botanisk samplanteringsgaranti.

## Begränsning
Perennagruppens 200-lista är från 2021 och dess poster är ofta sortspecifika. Flera poster i appen är artnamn utan sort. Dessa får endast en tydligt avgränsad referensnotering, inte ett säkert sortbetyg.

## Framtida profilvy
Se `PROFILE-VIEW-ROADMAP.md`. Profilvy kräver skalenlig platsgeometri, nivådata och växthöjder; den ska vara synkroniserad med planvyn och visa uppskattningar separat från mätdata.
