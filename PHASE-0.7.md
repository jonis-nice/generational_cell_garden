# Fas 0.7 – Planting notation, species boundaries & variable composition

## Research basis

This phase corrects the assumptions in earlier prototypes. Public interviews and project documentation describe these relevant working principles:

- Oudolf first considers the site and how people move through it; the path/masterplan is developed before the plant list and planting composition (Design Museum interview, 2021).
- He selects plants suited to the location, then composes from that list. He describes starting with a plant chosen more or less at random and placing it at considered intervals before adding the next plant; each design is similar in process but not identical (Design Museum interview).
- Plant character, shape, sculptural structure and how plants form a community take precedence over bloom colour. Seasonal skeletons and seedheads are structural components (Design Museum interview; Hauser & Wirth Oudolf Field).
- His drawings use layers on tracing paper; planting schemes can use drifts or clumps depending on the project (Hauser & Wirth).
- Oudolf has described colour in his diagrams as a way to track plant identity, sequence, distribution, repetition and balance, while form, texture and shape are primary (PIN–UP interview).
- His gardens are intentionally composed rather than wild/random; group scale, balance and repetition matter (PIN–UP; Interior Design interview).

## Code changes

- Automatic site generation now varies room count and room proportions per generation, introduces asymmetry and varies the circulation route and branches.
- Planting generation now selects a wider species palette instead of cycling only three species.
- Plant identity ink colours are separated from bloom colours. Diagram colour is used as a plant-code channel; bloom colour remains separate botanical data.
- Sampling positions are jittered to reduce the visible regular dot grid.
- Plant points are checked globally for minimum spacing, rather than independently per species patch.
- Species boundaries are drawn from actual neighbouring cells with different species assignments, instead of decorative overlapping circular blobs.
- Additional botanical symbol families added for Eryngium, Sanguisorba, Liatris, Monarda, Amsonia and Digitalis; Nepeta no longer shares the Salvia symbol routine.

## Verification

- `node --check app.js`: passed.
- `node --check catalog.js`: passed.
- Existing geometry smoke test: passed (all sampled placements inside test polygons).
- Browser visual test: not completed; headless Chromium did not finish within the available runtime.

## Known limitations

- This is a research-informed procedural approximation, not a reproduction of Oudolf's private design method or an expert-authored planting plan.
- Site rooms are still generated from a coarse spatial layout; they are more variable but not yet derived from actual topography, entrances, views, desire lines or fixed site objects.
- Species selection is not yet botanically compatibility-scored for soil, moisture, competition, longevity, flowering succession or winter persistence. The wider palette must not be interpreted as a validated plant community.
- Species boundary linework follows the current sampled cell adjacency. It is a useful graphic separation, but not yet a full vector region/alpha-shape geometry editor.
- Several taxa still share broad symbol families; the botanical symbol library needs species-by-species QA and more distinctive hand-drawn marks.
- No claim of exact visual match to any individual Oudolf drawing is made.
