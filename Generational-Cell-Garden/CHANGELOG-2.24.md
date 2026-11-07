# Naturalistic Design Studio 2.24

## Korrigering av rabattkomposition och växtcells-generering
- Flyttade kompositionsväljaren från sektionen för växtgenerering till sektionen för tomt/rabattgenerering.
- Kompositionsprinciperna påverkar nu placeringen och den övergripande geometriska relationen mellan stora rabattceller: eklöv/nervstruktur, slingrande stråk, förgrenat nätverk, spiral, flätade band, sammanlänkade planteringsrum, radiell komposition och konturterrasser.
- Växtceller genereras separat inom varje rabatt med en tvådimensionell blåbrusliknande fröplacering, viktad Voronoi-indelning och individuellt rundade organiska konturer.
- Återuppbyggde växtgenereringshanteraren efter att tidigare kodändring råkat ta bort rabattloopen och lämnat odefinierade variabler. Definierade rabattens bounds och återställde artval, cellindelning och gruppskapande.
- Växtgenereringens kod refererar inte längre till rabattkompositionsväljaren.
- JavaScript-syntaxkontroll godkänd; 29/29 automatiska tester godkända.
- Visuell kontroll i webbläsare är inte verifierad i denna körning.
