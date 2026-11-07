# Fas 2.0 – artanpassad gruppstorlek och renare massritning

## Ändringar
- Tog bort den fasta målytan 0,72 m² per grupp.
- Grupptätheten beräknas nu från katalogens planteringsavstånd och plantans angivna diameter/mogna utbredning. Större växter får färre individer per drift; mindre växter får fler.
- Faktisk polygonarea redovisas och beräknat individantal räknas från polygonarea / planteringsavstånd². Detta är en planeringsuppskattning, inte en biologiskt exakt konstant: gruppens avsedda antal individer är fortfarande ett designbeslut.
- Ersatte den överskjutande Catmull-Rom-liknande konturutjämningen med en avrundad hörnkurva som inte drar kurvan långt utanför cellens hörn.
- Tog bort extra boundarySegments-ritning som kunde skapa ett överritat nät av linjer.
- Minskat botanisk symbol till en diskret gruppsignatur; den färgade ytan och konturen ska bära gruppens yta.
- Artbyte behåller gruppolygonen men räknar om antal individer med det nya artens planteringsavstånd.

## Kvarstående begränsningar
- Voronoi-celler ger sammanhängande täckning men kan fortfarande se geometriskt tessellerade ut; detta är inte samma sak som Oudolf-liknande handkomponerade drifter.
- Grupparea är artanpassad via planteringsavstånd och diameterheuristik, inte en verifierad botanisk norm för varje art. Databasen saknar moget marktäckningsmått för många arter.
- Visuell webbläsarverifiering kunde inte slutföras i denna körmiljö eftersom Chromium inte avslutade headless-sessionen.

## Tester
- Alla 10 testfiler passerar efter uppdatering av renderingstestet.
- JavaScript-syntaxkontroll passerar.
