# Naturalistic Design Studio 2.23 — irregular leaf-vein planting cells

## What changed
- Replaced the nearly uniform Poisson spacing that made small planting cells read as rows.
- Added a variable leaf-vein structure per bed: one curved midrib and 5–7 alternating lateral veins.
- Vein corridors influence where planting-cell centres can be placed, leaving organic circulation gaps between groups.
- Added variable local exclusion radii, so neighboring cell centres are not evenly spaced.
- Switched the cell partition from ordinary Voronoi to a weighted power diagram. Independent per-cell weights produce a wider range of cell sizes and outlines while preserving a shared partition.
- Each final cell receives an independent low-frequency contour gesture with asymmetric lobes and pinches, then 2–3 rounds of smoothing.
- Added adaptive placement fallback to preserve the requested number of planting cells if vein corridors constrain the first pass too much.
- The larger bed silhouette generator is unchanged; this revision specifically changes the inner planting-cell layout.

## Verification
- JavaScript syntax check passed.
- 29 automated test files passed.
- Full interactive browser visual review remains unavailable in this pass; geometric behavior is covered by regression checks, but final visual similarity must still be judged in the app.


## Multi-grammar planting-cell generation
- Reframed the oak-leaf vein structure as one selectable composition grammar rather than the generator's default model.
- Added eight selectable composition grammars: oak/vein, river/meander, branching, spiral/arcs, braided bands, linked groves, radial fan, and contour terraces.
- The "Automatiskt varierad" mode selects one grammar for the complete generation, preserving a shared compositional language across separate beds.
- Added a dedicated UI selector for composition grammar.
- Existing weighted cell partition, individually varied cell weights, contour sculpting, and rounded smoothing are retained.
- Validation: JavaScript syntax check passed; 29/29 automated tests passed.
- Browser screenshot QA was attempted but blocked by the runtime browser policy; no visual match is claimed.
