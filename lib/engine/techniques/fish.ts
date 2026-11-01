import { COLS, ROWS, colOf, digitBit, rowOf } from '@/lib/engine/grid';
import { cellsWithDigit } from '@/lib/engine/grid-state';
import type { GridState, Step, Technique } from '@/lib/engine/types';
import { combinations } from '@/lib/engine/techniques/combinations';
import { eliminationStep, eliminationsFor } from '@/lib/engine/techniques/elimination';

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const ORIENTATIONS = [
  { bases: ROWS, covers: COLS, baseIndexOf: rowOf, coverIndexOf: colOf },
  { bases: COLS, covers: ROWS, baseIndexOf: colOf, coverIndexOf: rowOf },
];

function findFish(state: GridState, size: number, technique: Technique): Step | null {
  for (const { bases, covers, baseIndexOf, coverIndexOf } of ORIENTATIONS) {
    for (const digit of DIGITS) {
      const bit = digitBit(digit);
      const lines = bases
        .map((line, index) => ({ index, cells: cellsWithDigit(state, line, bit) }))
        .filter(({ cells }) => cells.length >= 2 && cells.length <= size);

      for (const chosen of combinations(lines, size)) {
        const coverIndexes = new Set(
          chosen.flatMap(({ cells }) => cells.map((cell) => coverIndexOf(cell))),
        );
        if (coverIndexes.size !== size) continue;

        const baseIndexes = new Set(chosen.map(({ index }) => index));
        const targets = [...coverIndexes]
          .flatMap((index) => covers[index])
          .filter((cell) => !baseIndexes.has(baseIndexOf(cell)));
        const step = eliminationStep(
          technique,
          chosen.flatMap(({ cells }) => cells),
          bit,
          eliminationsFor(state, targets, bit),
        );
        if (step) return step;
      }
    }
  }
  return null;
}

export const findXWing = (state: GridState): Step | null => findFish(state, 2, 'x-wing');

export const findSwordfish = (state: GridState): Step | null => findFish(state, 3, 'swordfish');
