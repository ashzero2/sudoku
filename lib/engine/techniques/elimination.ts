import { isUnsolved } from '@/lib/engine/grid-state';
import type { Elimination, GridState, Step, Technique } from '@/lib/engine/types';

export function eliminationsFor(
  state: GridState,
  cells: readonly number[],
  mask: number,
): Elimination[] {
  const result: Elimination[] = [];
  for (const cell of cells) {
    if (!isUnsolved(state, cell)) continue;
    const digits = state.candidates[cell] & mask;
    if (digits !== 0) result.push({ cell, digits });
  }
  return result;
}

export function eliminationStep(
  technique: Technique,
  cells: number[],
  digits: number,
  eliminations: Elimination[],
): Step | null {
  if (eliminations.length === 0) return null;
  return { technique, cells, digits, placement: null, eliminations };
}
