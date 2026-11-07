# Fas 2.9 – växtsamhällen, rumslig roll och säsongsförlopp

## Syfte
Utveckla generatorn från arturval till kompositionslogik: varje art får en begriplig roll i växtsamhället och utvärderas över fyra säsonger.

## Växtsamhällen
`aesthetic.js` klassificerar arter i fem funktionella roller:
- matrix: låg, sammanhållande bas eller marktäckande massa
- structure: gräs, vinterståndare och långvarig arkitektur
- accent: tydliga vertikala eller skulpturala former
- weaver: luftigare vävare och blommande textur
- support: kompletterande följeväxt

Rollerna är designheuristik, inte biologiska kategorier. Katalogens `compositionRole`, habit, växtform och vinterstruktur vägs samman.

## Rumslig komposition
Gruppens roll sparas på varje genererad växtmassa. Matrixläget domineras av basväxt; övriga arter får mindre accentandel. Blandad ängsplantering får en mjuk rumslig succession baserad på växternas registrerade blomningsstart och rabattens vertikala position, med lokal anknytning till närmaste artankare. Detta är en förenklad gestaltningsgradient, inte en ekologisk succession.

## Säsongsförlopp
`seasonalProfile` använder katalogens vår-, sommar-, höst- och vinterfält. Saknade fält räknas som okända, aldrig som frånvaro av säsongsvärde. Palettrankningen premierar täckning över flera säsonger och bibehållen vinterstruktur.

## Begränsningar
- Befintliga artprofiler omfattar bara en del av biblioteket; automatpoolen använder fortsatt endast granskade poster.
- Textbaserad fenologiklassning är grov och kan inte ersätta lokala blomningstider, sortdata eller svensk fältkontroll.
- Den rumsliga successionen är en designgradient; den påstår inte att arter koloniserar ytan i faktisk ekologisk tidsordning.
- Ingen automatisk komposition kan garantera estetiskt resultat utan visuell kontroll.

## Verifiering
`tests/composition-seasons.test.cjs` kontrollerar rollklassificering och säsongsprofil.
