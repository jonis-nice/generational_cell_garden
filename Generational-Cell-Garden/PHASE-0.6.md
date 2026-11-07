# Fas 0.6 – Spatial Composition & Botanical Rendering

## Mål
Ersätta den tidigare enda blob-formen och sinusgången med en rumslig planstruktur som har flera separata planteringsrum och ett sammanhängande gångsystem. Detta är en algoritmisk tolkning av referensritningens kompositionsprinciper, inte en kopia av Piet Oudolfs personliga ritstil.

## Implementerat
- Automatisk tomtgenerering skapar flera separata, organiskt varierade planteringsrum i stället för en enda planteringspolygon.
- Rumsindelningen anpassas efter tomtens proportioner: tre kolumner och två rader på breda tomter, två kolumner och tre rader på smalare tomter.
- En sammanhängande huvudgång och sekundära förbindelser placeras i mellanrummen mellan planteringsrummen.
- Varje planteringsrum genereras separat, vilket ger flera tydliga rum och skilda planteringsytor.
- Växtdrifternas tilldelningsfält har fått riktningsvariation och lågfrekevent gränsdeformation för att minska det tidigare regelbundna Voronoi-/rutnätsintrycket.

## Kvarstår
- Visuell kontroll i webbläsare och finjustering av gångarnas exakta anslutning till planteringsrummen.
- Artspecifika symboler för hela katalogen; nuvarande symbolbibliotek har fortfarande flera generiska kategorisymboler.
- Gemensam kollisionskontroll med symbolernas verkliga visuella utbredning.
- Verifierad botanisk kompatibilitet mellan perenner och säsongs-/vinteranalys.
- Fotobaserad tomtimport, skalkalibrering och måttsättning.

## Verifiering
- `node --check app.js`: godkänd.
- `node --check catalog.js`: godkänd.
- Befintligt geometritest: godkänt (alla testade punkter inom testpolygon).
- Fullständigt webbläsartest: inte utfört.
