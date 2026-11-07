export const UNIT_SKILLS = ['vocabulary', 'grammar', 'reading', 'function', 'writing'] as const;

export type UnitSkill = (typeof UNIT_SKILLS)[number];

export function lessonPath(unitId: number | string, skill: UnitSkill): string[] {
  return ['/2-bac', 'unit', String(unitId), skill, 'lesson'];
}

export function exercisesPath(unitId: number | string, skill: UnitSkill): string[] {
  return ['/2-bac', 'unit', String(unitId), skill, 'exercises'];
}

export function exercisePath(unitId: number | string, skill: UnitSkill, type: string): string[] {
  return [...exercisesPath(unitId, skill), type];
}

export function crosswordPuzzlePath(unitId: number | string): string[] {
  return [...exercisePath(unitId, 'vocabulary', 'crosswords'), 'puzzle'];
}
