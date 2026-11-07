# Naturalistic Design Studio 2.15 – återgång till 2.11:s visuella grund

## Varför
Version 2.14 avvek från referensen: den nya formgeneratorn skapade alltför stora, utdragna och separata former, medan växtmassorna fick för långt rundade och uppblåsta gränser. Resultatet blev sämre än 2.11.

## Åtgärd
- Återställde 2.11:s rabattlayout, rabattgeometri, 25 ursprungliga formprofiler, växtcellsgeometri, färgsättning och symbolstorlek.
- Behöll 2.11:s en-symbol-per-cell-princip.
- Förbättrade endast symbolens position: polygonens centroid används om den ligger inom cellen; annars väljs en inre punkt med störst avstånd till cellgränsen.
- Tog bort 2.14:s överdrivna cellhörnsrundning och kraftiga kantböjning.

## Verifiering
- JavaScript-syntax kontrollerad.
- Befintliga automatiska tester körda.
- Ingen fullständig visuell webbläsar-QA genomförd i denna körning.


## Working update 2.16 – global project-based planting compositions

- Added 25 project references from Oudolf's official global works list and published project documentation.
- Project references span the USA, Netherlands, England, Germany, Denmark, Spain, Japan, South Korea and Sweden.
- Each selectable outer-bed profile is associated with a named project, country, composition type and design-basis note.
- Added soft composition-guided seed placement for internal plant masses: matrix, blocks, groups/clusters, drifts/ribbons, patchwork/layered and islands.
- Retained the 2.11 parametric bed-outline generator and hand-drawn SVG rendering system.
- Retained 2.11 plant-symbol scale and one-symbol-per-cell behavior.
- Strengthened each plant-mass outline to 1.5 px at full opacity.
- All 21 existing automated tests pass; JavaScript syntax checks pass.
- No ZIP/release package created. Full browser visual QA remains outstanding.


## Handritad form- och färgfördjupning
- Utökat formbiblioteket från 25 till 150 profiler: 25 projektinspirerade grundformer och fem geometriska variationer per grundform.
- Samtliga 150 former är tillgängliga i formväljaren och i blandat genereringsläge.
- Varje genererad cell får en kombination av 24 färgpennsfärger, två accentpigment, varierande mönster och kontur.
- Konturvikter varierar avsiktligt mellan tunna, medeltjocka och kraftiga linjer; vissa konturer är prickade eller streckade och får en andra förskjuten pennlinje.
- Formvariationerna är generativa tolkningar av naturalistiska planteringskompositioner, inte verifierade exakta kopior av specifika projektplaner.


## 2.17 – Botanisk färglogik och tydligare formgeometri
- Dämpad färglogik: varje växtmassa förankras i artens blom-/bladton och den grannskapsanpassade massfärgen; slumpmässiga orelaterade kulörer används inte.
- Konturer och accentpigment hålls i botaniskt närliggande, mindre mättade nyanser.
- Växtmassornas cellpolygoner rundas genom två Chaikin-pass och växtsymboler filtreras mot den rundade polygonen.
- Rabattgeneratorn har separata geometriska regler för månskära, konkav form, lobad form, öform, band, asymmetrisk drift, komma, midja, förgrening, solfjäder, mjuk rektangulär form och lång rabatt.
- Tillagt mjuk rektangulär planteringsform med långa rakare sidor samt lång oregelbunden rabatt.
- Formbiblioteket omfattar nu 162 profiler. De 150 projektanknutna profilerna är tolkningar/variationer av 25 dokumenterade projektassociationer; två ytterligare generiska geometrier kompletterar biblioteket.
- Formväljaren exponerar samtliga grundformer och variationer. Ett valt profil-ID skickas direkt till geometrigeneratorn; blandat läge väljer fritt ur biblioteket.
- Formstudierna bygger på publicerade planritningar från bland annat Oudolf Field, Lurie Garden, Vitra Campus, Delaware Botanic Gardens och Calder Gardens. Detta är inte exakta digitala kopior av upphovsrättsskyddade originalritningar.


## 2.18 – Dämpad botanisk färgprincip
- Grundregeln gäller nu hela växtgrafiken: växtmassans kulör utgår från artens blom-/bladton och hålls i låg mättnad.
- Grannmassor använder närliggande analoga nyanser; färgskillnaderna hålls måttliga och får stöd av mönster och kontur i stället för starka komplementkontraster.
- Massfyllningar har låg mättnad och hög ljushet; pennstreck, accent och kontur är också desaturerade.
- Den botaniska grundpaletten och reservfärgerna har dämpats för att undvika att nya växtgrupper får skarpa färger.
- Tillagt automatiskt test som kontrollerar mättnadsgränserna för massfyllning, kontur och mönsterpigment.


## 2.19 – Splinebaserad landskapsgeometri
- Infört en separat splinebaserad geometri för långa planteringsband, meandrar, svepande drifter, vikar och förgrenade fält.
- Fyra skilda flödesfamiljer har egna centrumlinjer, kurvatur och breddvariation i stället för att modifiera en radiell ovalprofil.
- De befintliga formvalen `long-drift`, `sweeping-drift`, `sinuous`, `meander`, `forked` och `bay` kopplas till den nya splinegeneratorn.
- Övriga formfamiljer behåller sin egen geometri; de går inte genom samma bandgenerator.
- Tillagt automatiskt geometriprov som kontrollerar att flödesfamiljerna ger olika koordinatgeometrier och långsträckta former.
- Denna version är ett första steg mot referensens långa sammanhängande planteringsband. Den skapar ännu inte automatiskt ett fullständigt gångnät med flera sammanlänkade planteringsrum.


## 2.20 – Strömlinjeformade fält och rundade växtceller
- Ny geometri för långa, mjukt rektangulära planteringsfält med längre rakare sidpartier och rundade hörn.
- Nya särskilda former: Vandalorum-inspirerat långfält, svepande band, rätlinjig meander, bred meander och förgrenat planteringsfält.
- Flödesgeneratorn har nu separata centrumlinjeprofiler och breddförlopp för lång drift, meander, förgrening, vik och breda svep.
- Blandat läge väljer nu unika grundfamiljer utan återläggning i stället för att slumpa bland hundratals nästan likadana profilvarianter.
- Växtmassornas konturer använder nu genomgående organiska Bezier-kurvor i både fyllning och klippmask; detta rundar Voronoi-cellernas raka hörn.
- Konturerna har stärkts till 2.1–4.1 px med varierande färg, prickning och streckning.
- Färgpaletten har fått tydligare botaniska pigment och mer synlig färg i mönster/kanter, men behåller växtens kulörfamilj.
- Anpassat placeringsmarginaler för flera långsträckta former på mindre tomtytor.
- Testsvit utökad med separata kontroller av familjegeometri, rundade cellkurvor, unika former i blandat läge och Vandalorum-inspirerade fält.

## 2.21 – Nytt geometribibliotek och rundare cellindelning
- Tog bort det tidigare biblioteket med 25 namngivna former, de 150 automatiska varianterna och samtliga felaktiga kopplingar mellan en form och ett namngivet Oudolf-projekt.
- Ersatte biblioteket med åtta generiska geometriska studier: rundat fält med raka långsidor, långsträckt fält, mjuk trapets, avsmalnande fält, svept fält, sammanhängande dubbelrum, fält med rundat hörn och lång böjd rabattremsa.
- Ersatte slumpmässig placering av separata öar med en sammanhållen komposition av parallella, långsträckta planteringsfält. För en vald form används samma formfamilj för samtliga fält, med kontrollerad variation i mått och rotation. Blandat läge väljer olika formfamiljer.
- Bytte växtcellernas slumpmässiga dart-throwing-fröplacering mot ett förskjutet hexagonalt punktfält. Detta ger jämnare cellstorlekar och minskar långa kilformade Voronoi-celler.
- Tog bort ojämna power-diagramvikter. Cellerna delar nu planteringsytan med lika viktade Voronoi-gränser.
- Ökade kurvningen längs delade cellgränser och rundningen i hörn; samma kanoniska gränskurva används på båda sidor av en cellgräns.
- Uppdaterade formväljaren och texter så att generiska geometriska studier inte presenteras som kopior eller verifierade former från specifika projekt.
- Uppdaterade automatiska tester för de nya åtta formerna, den nya platskompositionen, cellernas hexagonala fröplacering och frånvaron av felaktiga projektattributioner.
- Kvarstående begränsning: detta är en algoritmisk tolkning av de tre användaruppladdade referenserna, inte en exakt digital avritning av hela Vandalorum-planritningen. Automatisk generering av sammanhängande gångnät med flera sammanlänkade planteringsrum ingår ännu inte.
