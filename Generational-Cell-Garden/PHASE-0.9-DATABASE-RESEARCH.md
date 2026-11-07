# Fas 0.9 – Växtdatabas och källgranskning

Datum: 2026-11-06

## Vad som ändrats

- Åtta artposter har fått en källgranskad basprofil: Salvia nemorosa, Echinacea purpurea, Rudbeckia fulgida, Hylotelephium 'Herbstfreude', Sanguisorba officinalis, Echinops bannaticus, Molinia caerulea och Calamagrostis (genusguide).
- Profilerna innehåller växtsätt, bladkaraktär, blomfärg, fukt/jord, säsongsvärden, vinterstruktur, roll i kompositionen och direkt käll-URL.
- Okända poster lämnas uttryckligen ogranskade.
- Automatgenereringen använder endast källgranskade poster. Övriga arter finns kvar i manuella växtkatalogen men används inte automatiskt innan granskning.
- Höjd/bredd har justerats där RHS-artprofilen ger tydligare underlag. Sortspecifika värden får inte generaliseras till hela arten.

## Källor och avgränsningar

- RHS Salvia nemorosa: https://www.rhs.org.uk/plants/60176/salvia-nemorosa/details
- RHS Echinacea purpurea: https://www.rhs.org.uk/plants/41568/echinacea-purpurea/details
- RHS Rudbeckia fulgida: https://www.rhs.org.uk/plants/112261/rudbeckia-fulgida/details
- RHS Hylotelephium 'Herbstfreude': https://www.rhs.org.uk/plants/522362/hylotelephium-%C3%97-mottramianum-herbstfreude/details
- RHS Sanguisorba officinalis: https://www.rhs.org.uk/plants/16403/sanguisorba-officinalis/details
- RHS Echinops bannaticus: https://www.rhs.org.uk/plants/114273/echinops-bannaticus/details
- RHS Molinia caerulea: https://www.rhs.org.uk/plants/11169/molinia-caerulea/details
- RHS Calamagrostis genus guide: https://www.rhs.org.uk/plants/calamagrostis

RHS-data beskriver huvudsakligen brittiska odlingsförhållanden. Den ska inte ensam användas för att fastställa svensk härdighet, lokala ståndortskrav eller exakt sortstorlek. Därför markeras dessa profiler som källgranskade artprofiler, inte som fullständigt svenskodlingsverifierade.

## Oudolf-principer som påverkar datamodellen

Piet Oudolf beskriver växtval utifrån hur växter samverkar som ett växtsamhälle, deras karaktär efter blomning och deras kvaliteter genom året. Han beskriver också balans, upprepning och skala i grupper som centrala. Databasen har därför separata fält för vår/sommar/höst/vinter och kompositionsroller. Dessa fält är inte ett påstående om att en algoritm kan reproducera hans konstnärliga omdöme.

Källa: Design Museum-intervju https://www.design-museum.de/en/ueber-design/interviews/detailseiten/interview-with-piet-oudolf.html
Källa: House & Garden, Oudolf Field https://www.houseandgarden.co.uk/article/piet-oudolf-planting-scheme
Källa: PIN–UP-intervju https://www.pinupmagazine.org/articles/piet-oudolf-interview

## Begränsningar

- 8 av 150 poster har källgranskade profiler; 142 är fortfarande ogranskade.
- Calamagrostis-posten bygger på genusguide eftersom katalogposten saknar sortnamn; dess exakta mått är därför inte sortverifierade.
- Vinterstruktur är en kvalitativ bedömning från beskrivna stjälkar/fröställningar och odlingsråd, inte en garanti för ståndtid i varje svenskt mikroklimat.
- Automatgenereringens artpool är därför medvetet liten. Det är bättre än att automatiskt kombinera 150 arter med saknade egenskaper.
