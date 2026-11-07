# Fas 1.7 – ombyggd växtgenerering

## Fel som identifierades
- Manuell placering skapade först en slumpmässig gruppgeometri och ersatte därefter bara plantpositionen. Därför hamnade markerad yta och symbol på olika koordinater.
- Automatgenereringen tilldelade plantpositioner över hela rabatten och använde konvexa höljen av punkterna som gruppkonturer. De höljen kunde överlappa kraftigt och saknade samband med en avsiktlig driftform.

## Ändringar
- Manuell placering bygger nu driftpolygonen direkt runt klickpunkten och använder samma klickpunkt som växtsymbolens centrum.
- Automatgenereringen skapar separata, organiska driftpolygoner per vald art.
- Plantpositioner genereras endast inuti respektive driftpolygon och planteringsyta.
- Driftcentrum kontrolleras mot driftarnas utsträckning för att minska överlappande konturer.
- Varje växtsymbol får en egen synlig cirkulär kontur.
- Användaren kan välja 1–4 rabattytor vid tomtgenerering.
- Statusraden redovisar faktiskt antal driftar och plantpositioner.

## Verifiering
- `node --check app.js`, `catalog.js`, `compatibility.js`: godkända.
- Samtliga 9 testfiler: godkända.
- Försök till Chromium headless-körning fastnade i miljön och räknas inte som visuell eller funktionell webbläsarverifiering.

## Kvarstående
- De organiska driftarna är procedurgenererade ellipser med lobvariation, inte handritade referensformer eller en fullständig Oudolf-kompositionsmotor.
- Visuell bedömning i användarens webbläsare krävs fortfarande.
