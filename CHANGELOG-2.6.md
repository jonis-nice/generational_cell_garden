# Naturalistic Design Studio 2.6 – Naturalistisk komposition och botanisk läsbarhet

## Ändringar
- Utökat växtkatalogen med två källgranskade perenner: *Achillea millefolium* och *Persicaria amplexicaulis*. De är tillagda med RHS-artprofiler som källa. Svensk vinterhärdighetsklass har inte hittats på och lämnats oklassad.
- Växtmassornas färgpalett är dämpad och hämtad från naturliga blad-, fröställnings- och jordtoner i stället för starka kontrastfärger.
- Växtsymbolernas etiketter använder nu de tre första bokstäverna i det latinska släktnamnet, exempelvis `Ger`, `Sal` och `Ach`.
- Symbolernas ritade vektorlinjer har fått en diskret pennstruktur. Den generiska cirkelkonturen runt varje symbol är borttagen.
- Generering av flera rabatter väljer nu bland många giltiga placeringar och försöker hålla närmaste fria avstånd nära 0,85 m. Den tidigare rutnätsbaserade reservplaceringen är borttagen; om tomten inte rymmer alla rabatter visas färre i stället för att skapa ett tärningsmönster.
- Växtgruppernas placering använder mer stokastisk spridning än den tidigare maximin-liknande placeringen, för att minska jämnt utspridda prickmönster.
- De tre gestaltningslägena påverkar nu artfördelningen:
  - Naturalistisk driftplantering: tydligare sammanhängande artgrupper.
  - Matrix med accenter: matrixarten dominerar och accentarter sprids oregelbundet.
  - Ängslik succession: blomningstid används som sorteringsunderlag och arterna blandas mer mellan grupperna.
- Plantantalet beräknas med en förskjuten hexagonal planteringslayout (0,866 × avstånd²), inte kvadratiskt rutnät.

## Viktiga avgränsningar
- De två nya arterna har källgranskade artprofiler men saknar svensk sortspecifik vinterhärdighetsklass.
- `Ängslik succession` är ännu en förenklad designheuristik: blomningsperiod används som ordningssignal, inte som en fullständig fenologisk simulering.
- Avståndet 0,85 m är ett minsta fritt avstånd mellan planteringsytor; algoritmen optimerar närmaste grannavstånd mot målet men kan inte garantera identiskt avstånd i alla riktningar på tomter med oregelbunden form.
- Ingen visuell webbläsar-QA har körts i denna ändring. Automatiska Node-tester och syntaxkontroller kördes.

## Källor för tillagda växter
- *Achillea millefolium*: https://www.rhs.org.uk/plants/311/achillea-millefolium-common-yarrow-devil-s-nettle-hundred-leaved-grass-lace-plant-milfoil-nose-pepper-nosebleed-old-man-s-pepper-sanguinary-savory-tea-soldier-s-woundwort-thousand-weed-thousand-leaf-thousand-seal-milddail/details
- *Persicaria amplexicaulis*: https://www.rhs.org.uk/plants/100515/persicaria-amplexicaulis/details
