# Fas 1.9 – Växtmassor och automatisk gruppering

## Ändring av modell

Tidigare representerades en växtgrupp som många individuella växtsymboler. Det gav ett prickigt resultat, stora tomrum mellan symbolerna och onödig SVG-komplexitet. Modellen är ändrad: en artdrift är nu en sammanhängande polygon med en enda botanisk gruppsymbol och en treställig artkod.

## Automatisk generering

- Planteringsytan delas med Voronoi-celler utifrån slumpade, jämnt fördelade frön.
- Varje cell blir en växtgrupp. Cellerna delar gränser och täcker planteringsytans polygon utan avsiktliga mellanrum.
- Målyta per grupp är cirka 0,72 m²; faktisk yta varierar med randvillkor och placering.
- Arter väljs ur den granskade perennpoolen. Matrixroll prioriteras; övriga arter fördelas återkommande som primära och spridda accenter.
- Varje grupp visar en enda större växtsymbol. Individuella plantor skapas inte som SVG-objekt.
- Beräknat plantantal är metadata från grupparea och planteringsavstånd, inte antalet ritade symboler.

## Interaktion

- Gruppolygonens fyllda yta är klickbar.
- Gruppetiketten består av de tre första bokstäverna i växtnamnet.
- "Generera om grupp" ändrar konturens variation inom den befintliga gruppens gräns och behåller i stort sett samma yta. Upprepade försök är tillåtna.
- Växtantalet visas som en uppskattning och är inte längre en redigerbar symbolräknare.

## Begränsningar

Voronoi-tessellering ger heltäckande, angränsande artmassor men är inte en fullständig biologisk eller gestaltningsmässig modell av en Oudolf-plan. Artfördelning, rytm, säsong, matrixdominans och visuellt varierade gränser behöver fortsatt utvecklas. För testad rektangulär geometri verifierar separat test att cellernas sammanlagda area är lika med planteringsytans area. Automatisk visuell Chromium-verifiering kunde inte genomföras i denna körmiljö.
