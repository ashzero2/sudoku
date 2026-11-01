import { BOXES, COLS, ROWS, boxOf, colOf, digitBit, rowOf } from '@/lib/engine/grid';
import { cellsWithDigit } from '@/lib/engine/grid-state';
import type { GridState, Step } from '@/lib/engine/types';
import { eliminationStep, eliminationsFor } from '@/lib/engine/techniques/elimination';

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const LINES = [...ROWS, ...COLS];

function sharedLine(cells: readonly number[]): readonly number[] | null {
  if (cells.every((cell) => rowOf(cell) === rowOf(cells[0]))) return ROWS[rowOf(cells[0])];
  if (cells.every((cell) => colOf(cell) === colOf(cells[0]))) return COLS[colOf(cells[0])];
  return null;
}

export function findPointing(state: GridState): Step | null {
  for (const box of BOXES) {
    for (const digit of DIGITS) {
      const bit = digitBit(digit);
      const cells = cellsWithDigit(state, box, bit);
      if (cells.length < 2) continue;

      const line = sharedLine(cells);
      if (!line) continue;

      const outside = line.filter((cell) => boxOf(cell) !== boxOf(cells[0]));
      const step = eliminationStep('pointing', cells, bit, eliminationsFor(state, outside, bit));
      if (step) return step;
    }
  }
  return null;
}

export function findClaiming(state: GridState): Step | null {
  for (const line of LINES) {
    for (const digit of DIGITS) {
      const bit = digitBit(digit);
      const cells = cellsWithDigit(state, line, bit);
      if (cells.length < 2) continue;
      if (!cells.every((cell) => boxOf(cell) === boxOf(cells[0]))) continue;

      const outside = BOXES[boxOf(cells[0])].filter((cell) => !line.includes(cell));
      const step = eliminationStep('claiming', cells, bit, eliminationsFor(state, outside, bit));
      if (step) return step;
    }
  }
  return null;
}
