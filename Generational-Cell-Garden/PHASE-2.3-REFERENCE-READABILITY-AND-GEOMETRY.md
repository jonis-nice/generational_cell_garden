# Fas 2.3 – tydligare artmassor och gemensam geometri

## Utgångspunkt
Skärmbilden från fas 2.2 visade bleka artfält, svaga konturer och en regelbunden Voronoi-känsla. Referensbilderna har tätare färgkodade växtytor, tydliga handritade artgränser och en mer varierad men sammanhängande komposition.

## Ändringar
- Gemensamma kanter mellan Voronoi-/power-celler använder en kanoniskt beräknad kvadratisk Bézier-kontrollpunkt. Samma kant får samma kurva oavsett polygonens vindning.
- Växtmassornas konturer har högre kontrast och tjocklek.
- Artmassor får en tydligare separat färgpalett i stället för att många poster ärvde samma dämpade gröna katalogfärg.
- Botaniska gruppsymboler har större standardstorlek (138) och större symbolradie.
- Rabattgeneratorns ägg-, oval-, strömlinje- och egenritade val är borttagna. Den genererar nu en enda rundad, nära-cirkulär naturalistisk silhuett med mycket låg amplitud i konturen.
- Rabatterna placeras i ett förskjutet hexagonalt mönster. Närmaste grannars centrumavstånd motsvarar diameter + 0,85 m, vilket ger minst 0,85 m fritt avstånd även diagonalt.
- Katalogen utökades från 150 till 156 poster. Sex nya källgranskade perennprofiler lades till: Nepeta faassenii 'Walkers Low', Achillea millefolium 'Red Velvet', Anaphalis triplinervis, Achillea 'Coronation Gold' och Geranium pratense och Agastache 'Blue Fortune'. Säsongsbeskrivningar är uttryckligen markerade som designmässig tolkning; härdighetsklassning är separat källförd.

## Källor för nya växtposter
- Perenner.se, Nepeta faassenii 'Walkers Low': https://perenner.se/vaxt/nepeta-faassenii-walkers-low-kantnepeta/
- Perenner.se, Achillea millefolium 'Red Velvet': https://perenner.se/vaxt/achillea-millefolium-red-velvet-rollika/
- Perenner.se, Anaphalis triplinervis: https://perenner.se/vaxt/anaphalis-triplinervis-ulleternell/
- Perenner.se, Agastache 'Blue Fortune': https://perenner.se/vaxt/agastache-blue-fortune-anisort/
- Perennagruppen, 200-listan 2021: https://perenner.se/wp-content/uploads/2023/02/200-listan-2021.pdf
- Länsstyrelsen Västerbotten, alternativ till invasiva trädgårdsväxter: https://www.lansstyrelsen.se/vasterbotten/djur/invasiva-frammande-arter/alternativ-till-populara-invasiva-tradgardsvaxter.html

## Kvalitetsstatus
- Katalog: 156 poster; 54 kompletta och källgranskade profiler; 7 delvis granskade; 92 ogranskade; 2 alias; 1 exkluderad felkategori.
- Automatiskt växturval: 54 källgranskade perenner, gräs, lökväxter och marktäckare.
- Geometri: tester för 1–10 rabatter, hexagonalt minimiavstånd och reverserade gemensamma kurvor.
- Begränsning: låg-amplitudkurvan mellan grupperna är fortfarande en kontrollerad geometrisk tessellering, inte en fullständig biologiskt informerad naturalistisk driftsimulator. Visuell Chromium-verifiering kunde inte slutföras i den här körmiljön.
