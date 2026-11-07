# 2.11 – stabilare flerrabattlayout och varierade växtgrannar

- Ersatt misslyckad slumpmässig placering med en slotbaserad layout som skapar en rabatt per begärd position, i en balanserad rad-/kolumnfördelning.
- Behåller fria gångzoner genom att reservera en gemensam korridor i varje layoutcell.
- Rundat växtmassornas gränser tydligare med bredare hörnövergångar.
- Infört grannskapsanalys för växtceller: samma art får kraftigt avdrag om den redan förekommer i en direkt angränsande cell.
- Färgerna får större visuell separation genom färgfamiljsvariation i artvalet.
- Observera: gridbaserad layout är avsiktligt stabil; den är inte en slumpmässig punktplacering. En separat visuell finjustering behövs för att få mer frihandsritad landskapsarkitektkänsla.

- Färgade växtmassor med artens botaniska blomfärg och dämpade konturer i stället för mörka cellkanter.
- Artvalet väger in färgskillnad mot redan tilldelade grannceller; direkt angränsande celler får kraftigt avdrag för samma art.
- Behållit särskild preferens för matrixrollen och fenologisk ordning i ängsläget.

## Verifiering
- 21/21 automatiska tester passerar.
- Layoutfunktionen provkörd separat: 3/3, 6/6, 8/8 och 10/10 rabatter skapade i fyra representativa tomtstorlekar.
- JavaScript-syntax kontrollerad och arkivet verifieras vid paketering.
- Ingen fullständig visuell webbläsar-QA har genomförts i denna körning.
