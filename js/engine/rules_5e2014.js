import { clampInt } from "./util.js";

/**
 * Warlock-only SRD 5e (2014) rules helpers.
 *
 * This module intentionally contains only Warlock progression logic.
 */

export const HIT_DIE_BY_CLASS = {
  Warlock: 8,
};

export function totalCharacterLevel(state){
  const p = clampInt(state?.primary?.classLevel ?? 0, 0, 20);
  return clampInt(Math.max(1, p), 1, 20);
}

export function abilityMod(score){
  const s = Number(score ?? 10);
  return Math.floor((s - 10) / 2);
}

export function averageHpGainPerLevel(hitDie, conMod){
  const die = Number(hitDie);
  const avg = Math.floor(die / 2) + 1;
  return avg + Number(conMod || 0);
}

export function recommendedHpMax(state){
  const conMod = Number(state?.abilities ? abilityMod(state.abilities.CON) : 0);
  const lv = clampInt(state?.primary?.classLevel ?? 0, 0, 20);
  const hd = HIT_DIE_BY_CLASS.Warlock;
  let hp = 0;
  for (let i=1;i<=lv;i++){
    if (i===1) hp += hd + conMod;
    else hp += (Math.floor(hd/2)+1) + conMod;
  }
  return Math.max(0, Math.trunc(hp));
}

/* ---------------------- Spell limits (Warlock tables) ---------------------- */

export const SPELLS_KNOWN_TABLE = [0,2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15];
export const CANTRIPS_KNOWN_TABLE = [0,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4];

export const WARLOCK_PACT_TABLE = {
  slotLevel: [0,1,1,2,2,3,3,4,4,5,5,5,5,5,5,5,5,5,5,5,5],
  slots:     [0,1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4],
  invocationsKnown:[0,0,2,2,2,3,3,4,4,5,5,5,6,6,6,7,7,7,8,8,8],
  cantripsKnown: CANTRIPS_KNOWN_TABLE,
  spellsKnown: SPELLS_KNOWN_TABLE,
};

export const MYSTIC_ARCANUM_BY_LEVEL = {
  11: 6,
  13: 7,
  15: 8,
  17: 9,
};

export function spellsKnownLimit(className, classLevel){
  if ((className||"").trim() !== "Warlock") return null;
  const lv = clampInt(classLevel, 0, 20);
  return SPELLS_KNOWN_TABLE[lv] ?? null;
}

export function cantripsKnownLimit(className, classLevel){
  if ((className||"").trim() !== "Warlock") return null;
  const lv = clampInt(classLevel, 0, 20);
  return CANTRIPS_KNOWN_TABLE[lv] ?? null;
}

export function preparedSpellsLimit(){
  // Warlocks are known casters in 2014.
  return null;
}

/* ---------------------- Spell slots (Pact Magic) ---------------------- */

export function spellSlotsForState(state){
  const wl = clampInt(state?.primary?.classLevel ?? 0, 0, 20);
  const slotLevel = WARLOCK_PACT_TABLE.slotLevel[wl] ?? 0;
  const slots = WARLOCK_PACT_TABLE.slots[wl] ?? 0;

  const arcanum = [];
  for (const [k,v] of Object.entries(MYSTIC_ARCANUM_BY_LEVEL)){
    const need = Number(k);
    if (wl >= need) arcanum.push(v);
  }
  arcanum.sort((a,b)=>a-b);

  return {
    effectiveSpellcasterLevel: 0,
    spellcastingSlots: {},
    pactMagic: (slots > 0) ? { slots, slotLevel, arcanum } : null,
  };
}

export function spellLimitsForState(state){
  const lv = clampInt(state?.primary?.classLevel ?? 0, 0, 20);
  if (lv <= 0) return [];
  return [{
    label: "Primary",
    className: "Warlock",
    classLevel: lv,
    knownSpellsMax: spellsKnownLimit("Warlock", lv),
    cantripsKnownMax: cantripsKnownLimit("Warlock", lv),
    preparedSpellsMax: null,
  }];
}
