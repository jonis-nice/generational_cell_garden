# Fas 1.6 – Större rabattytor och läsbara växtdrifter

## Problem från användartest
Skärmbilden visade fem–sex små, kantiga planteringsöar och separata, automatiskt ritade gångpolygoner. Växtgruppernas geometri var tom (`poly: []`) och därför saknades tydliga masskonturer. Symbolerna var dessutom små i förhållande till ritningsytan.

## Ändringar
- Tomtgeneratorn skapar nu två eller tre större, rundade och oregelbundna rabattytor beroende på tomtens proportioner.
- Den automatiska gånggenereringen är borttagen. Öppna mellanrum mellan rabatterna är avsiktligt negativt utrymme; användaren kan senare rita eller förfina gångar där.
- Växtgrupper får nu en polygon från sina placerade växtpunkters konvexa hölje. Konturen visas med en svag artspecifik fyllning och en tunn linje.
- Växtpunkternas diameter och symbolernas visningsskala har ökats för bättre läsbarhet.
- Antalet fröcentrum per yta har ökats för fler sammanhängande artdrifter och mindre känsla av några få slumpmässiga klumpar.
- Hjälptexten i gränssnittet är uppdaterad så att den inte längre säger att gångar genereras automatiskt eller att marktäckare är uteslutna.

## Begränsningar
- Konturerna är konvexa höljen runt gruppens placerade punkter, inte en fullständig organisk Voronoi-/cellkontur. De kan därför bli för breda eller överlappa när två drifter ligger nära varandra.
- Tomtformsgeneratorn skapar ännu inte en intelligent sammanhängande nätverksgeometri för gångar; den lämnar medvetet gångutrymmet tomt.
- Visuell verifiering i interaktiv webbläsare är ännu inte genomförd. Ändringarna är syntax- och regressionstestade.

## Tester
- `node --check app.js` – PASS
- Samtliga åtta `tests/*.cjs` – PASS
