

## Ongoing generator rebuild – coherent site composition
- Replaced independent lane-based bed placement with a coordinated, site-level composition made of one or two related curved planting strands.
- Each bed receives its position and rotation from its strand's shared spline; all forms share the same landscape direction and composition identity.
- The strands are staggered and gently meandering, with deliberate clearances between planting rooms; this is not a rectangular row/grid layout.
- Replaced the former eight generic form profiles with eight new neutral geometry studies: asymmetric panel, long room, soft-corner strip, swept panel, tapered room, paired room, curved wedge and softened stepped field.
- Replaced regular hexagonal plant-mass seed placement with stochastic blue-noise distribution.
- Voronoi boundaries are now only a layout scaffold. Individual planting masses are inset and smoothed to create distinct rounded groups and visible negative space.
- No export or ZIP package created. Visual browser QA remains pending.

## Connected multi-line composition network
- Replaced the single-spine/parallel-strand logic with a connected network of two primary compositional paths that share explicit junctions; a third inner path is introduced for larger planting layouts.
- Paths are sampled as smooth cubic curves. Beds are distributed along each path and oriented to its local tangent, with varied proportions and rotations rather than a single elongated bed type.
- Each path is explicitly connected to the others at shared junctions; beds remain separate planting polygons.
- Bed placement uses a conservative convex-hull collision test, so accepted beds cannot overlap. A compact fallback is used where space is constrained.
- No Oudolf project names are assigned to these generated forms; they are neutral geometry profiles informed by the supplied reference drawings.
- No ZIP or delivery package created. Visual browser QA remains pending.


## Variable connected composition network
- Added a user-selectable composition-line count from 1 to 8, independent of the number of beds.
- Replaced fixed two/three-path logic with one continuous backbone and up to seven curved connecting branches.
- Each additional line attaches to two points on the backbone, so lines form a related network of loops/branches rather than unrelated parallel strokes.
- Beds are distributed across available paths in proportion to path length; a composition can contain more guide lines than beds.
- Added the line-count selector to the site controls and passed the selected value into the generator.
- Updated regression test for the variable 1–8 line network.
- No package or ZIP created.

## Authored planting-cell silhouette library
- Replaced the eight-profile generic form set with 28 named, fixed geometric silhouettes: Hallonbåt, Halvmåne, Njurform, Bladform, Lansett, Båtform, Mjuk trapets, Rundad triangel, Droppform, Sadel, Svept bandform, Oval, Mjuk rektangel, Rundad kil, Snäckform, Boomerang, Njurbåt, Asymmetrisk oval, Rundad sköld, Halvcirkel, Bönform, Slingrande fält, Rundad panel, Mjuk spets and four additional architectural/naturalistic room profiles.
- Every family has an authored contour rule in `makeBedShape`; the silhouettes are stable and reproducible rather than random Voronoi blobs.
- The form selector exposes all 28 forms individually plus a mixed composition mode.
- Mixed mode varies silhouette families across the field. The generator arranges cells in a two-dimensional, gently staggered composition, not along a single line of centers.
- Composition guides remain independently configurable from 1 to 8 and modulate the overall field rhythm rather than passing through bed centers.
- Cell dimensions are fitted to their allocated planting rooms with a narrow consistent gap and a small scale hierarchy.
- Default site dimensions are 24 × 16 m.
- No form is presented as a literal copy or falsely attributed to a named Piet Oudolf project; labels describe geometry only.
- Added authored silhouette runtime tests covering 28 forms, 1–10 cells, and 1–8 guide lines.
