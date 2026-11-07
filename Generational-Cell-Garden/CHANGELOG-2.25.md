# Naturalistic Design Studio 2.25

## RC/VC separation and VC generation recovery
- RC = rabattceller; VC = växtceller.
- The composition selector is placed in the site/RC setup section and controls only the large RC composition.
- VC generation is a separate routine inside each existing RC. It independently places species-mass seeds, partitions the RC with clipped weighted Voronoi cells, assigns compatible species, and creates individual rounded organic VC outlines.
- Removed all RC-composition references from the VC generation handler.
- Rebuilt the VC generation handler to restore its per-bed scope and required local state after the prior regression.
- Added a dedicated regression test to prevent RC composition controls from breaking VC generation.
- Validation: JavaScript syntax check passed; all 30 automated tests passed.
- Browser interaction test could not be completed because the runtime blocked local browser navigation; visual runtime behavior is not claimed as verified.
