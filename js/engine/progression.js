export const ASI_LEVELS_BY_CLASS = {
  Warlock: [4,8,12,16,19],
};

export function countAsiSlots(className, classLevel) {
  const levels = ASI_LEVELS_BY_CLASS[className] || [];
  let n = 0;
  for (const lv of levels) if (classLevel >= lv) n++;
  return n;
}

export function hasAsiAtLevel(className, classLevel){
  const levels = ASI_LEVELS_BY_CLASS[className] || [];
  return levels.includes(Number(classLevel||0));
}

export function earnedPickSlots({ multiclass, primary, secondary }) {
  // Warlock-only build: ASI/Feat choices come only from Warlock class levels.
  const pLvl = Number(primary?.classLevel || 0);
  return countAsiSlots("Warlock", pLvl);
}
