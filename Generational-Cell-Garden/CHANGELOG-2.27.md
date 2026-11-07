# Version 2.27 – Botanical species identity and portraits

- Removed user-adjustable symbol size and planting-distance controls. Species spacing remains determined by the plant catalogue.
- Added clickable species portraits from the plant library and selected-group heading.
- Portraits show catalogue-backed growth habit, foliage, flowering, height, light, soil and winter-structure information where available.
- Species photographs are looked up by exact botanical taxon through iNaturalist; no unrelated taxon photo is substituted when an exact match is unavailable.
- Replaced abstract species fills with botanical colour grammar: foliage-based outline, lighter inner foliage/flower field, and species-specific fruit/flower marks.
- Rubus idaeus uses green foliage and red berry marks; Eutrochium purpureum uses a pink flower field, green edge and darker pink flower clusters.
- Added distinct top-view symbol motifs for raspberry and Eutrochium.

## Rendering performance optimisation
- Coalesced multiple render requests within one animation frame. Pointer movement and rapid state changes now trigger at most one full redraw per frame instead of one redraw per event.
- Cached polygon SVG path strings by site dimensions and point coordinates, with a bounded cache.
- Cached the plant selector's option markup instead of rebuilding the full catalogue options on every selection.
- Avoided rebuilding the planting schedule unless the group data that determines it changes.
- Avoided rerendering the plant catalogue when the search, category and selected plant are unchanged.
- No changes to planting geometry, species assignment, cell contours, symbol dimensions or visual styling.
- Validation: JavaScript syntax check passed; 31/31 automated regression tests passed. Browser-based visual/performance profiling was not available, so no measured speed-up percentage is claimed.
