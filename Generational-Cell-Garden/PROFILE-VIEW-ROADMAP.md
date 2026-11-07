# Profile / section view – roadmap

A future generated-site profile should be a separate synchronized view, not a replacement for the strict 90-degree plan view.

## Views
- Plan: orthographic 90-degree top view; dimensions, areas, paths, symbols and plant codes.
- Section/profile: selectable section line across the generated site; ground level, path levels, bed mounds, plant mature height envelopes and sightline/height relationships.
- Optional elevation preview: schematic side elevation of selected planting room, never used as a source for plan geometry.

## Data required
- calibrated site geometry and elevation points (or explicitly assumed flat datum);
- plant mature height range, spread, habit and seasonal height;
- bed/path levels and any retaining edges;
- section-line location and direction.

## Rules
- Never infer exact terrain elevation from a flat photo without calibration/survey.
- Display assumed values separately from measured values.
- Plant heights are ranges, not single exact values; cultivar-specific data required.
- Keep profile view linked to the same plant objects and site coordinate system as plan view.

## Acceptance criteria
- User can draw a section line in plan and see a corresponding profile.
- Selecting a plant in profile highlights the same plant/group in plan.
- Measured and estimated heights are visually distinguished.
- Export plan and profile together with scale, datum and assumptions.
