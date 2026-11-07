# Fas 2.2 – rabattform, jämna gångar och symbolklippning

## Genomfört
- Standardtomt ändrad till 10 × 10 meter.
- Automatisk rabattgenerering stöder 1–10 ytor.
- Genererade rabatter placeras i ett regelbundet rutnät med 0,85 m minsta fritt kantavstånd. Layouten beräknas inom tomtens marginaler och avbryts om valt antal inte ryms.
- Silhuettval: oval, äggformad och strömlinjeformad. Egna former ritas med verktyget Planteringsyta innan växtgenerering.
- Symbolernas standardstorlek höjd till 112 (från 72) och symbolerna klipps mot respektive gruppolygon.
- Gruppytornas gemensamma gränser ritas med deterministiska, delade mjuka kantkurvor, så angränsande polygoner använder samma kurva.
- Grupparea härleds från planteringsavstånd, moget växtmått och ett uppskattat individantal. Det är en projekteringsuppskattning, inte en universell biologisk regel.

## Tester
- JavaScript-syntaxkontroll.
- Samtliga befintliga testfiler.
- Nytt `bed-layout.test.cjs`: 1–10 rabatter, tomtgränser och minsta 0,85 m fria avstånd på 10 × 10 m.

## Kvarstående
- Visuell Chromium-kontroll kunde inte slutföras i denna körmiljö (headless-processen time-outade).
- 0,85 m är ett minsta fritt avstånd mellan de genererade silhuetternas omskrivna cirklar. Det garanterar en jämn minsta separationsdistans i layouten, men är inte en exakt konstant normalbredd längs varje punkt på alla organiska konturer.
- Växtkatalogen har inte utökats i denna fas: 150 poster, varav 48 kompletta profiler. Fler arter ska läggas till först när identitet, svensk härdighet och ståndortsdata kan beläggas.
