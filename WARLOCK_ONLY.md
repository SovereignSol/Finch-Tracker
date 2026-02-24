# Warlock-only build notes

This build trims the dynamic 5e character sheet down to a single-class Warlock implementation.

## What was removed (high level)
- All non-Warlock classes from the class registry/data.
- Multiclassing end-to-end (UI controls, state usage, and any secondary-class flows).
- Non-Warlock subclass registry entries.
- Non-Warlock class feature progression entries.

## Where Warlock progression lives
- Pact Magic progression tables and Warlock spell list sources:
  - `data/spellcasting.json` (Warlock progression key: `warlock`)
  - `js/engine/rules_5e2014.js` (Warlock Pact Magic table helpers)
- Warlock class feature grants and choice points:
  - `data/class_features.json` (Warlock-only)
- Warlock subclasses:
  - `data/subclass.json` (Warlock-only, keep/edit to extend)

## Data file names used by this build
- `data/race.json`
- `data/class.json`
- `data/subclass.json`

(These are the files loaded by `js/app.js` in this Warlock-only build.)

## Adding more classes later (high level)
1) Add the class entry back into `data/class.json`.
2) Add the class’s feature progression back into `data/class_features.json`.
3) Add subclass registry entries into `data/subclass.json`.
4) Re-enable the class selector and multiclass UI in `index.html` and the associated handlers in `js/app.js`.
