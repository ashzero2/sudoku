import { ALL_DIGITS, UNITS, digitBit, popCount } from '@/lib/engine/grid';
import { cellsWithDigit, isUnsolved } from '@/lib/engine/grid-state';
import type { GridState, Step, Technique } from '@/lib/engine/types';
import { combinations } from '@/lib/engine/techniques/combinations';
import { eliminationStep, eliminationsFor } from '@/lib/engine/techniques/elimination';

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function findNakedSubset(state: GridState, size: number, technique: Technique): Step | null {
  for (const unit of UNITS) {
    const pool = unit.filter(
      (cell) =>
        isUnsolved(state, cell) &&
        popCount(state.candidates[cell]) >= 2 &&
        popCount(state.candidates[cell]) <= size,
    );

    for (const subset of combinations(pool, size)) {
      const digits = subset.reduce((mask, cell) => mask | state.candidates[cell], 0);
      if (popCount(digits) !== size) continue;

      const others = unit.filter((cell) => !subset.includes(cell));
      const step = eliminationStep(
        technique,
        subset,
        digits,
        eliminationsFor(state, others, digits),
      );
      if (step) return step;
    }
  }
  return null;
}

function findHiddenSubset(state: GridState, size: number, technique: Technique): Step | null {
  for (const unit of UNITS) {
    const pool = DIGITS.map((digit) => ({
      bit: digitBit(digit),
      cells: cellsWithDigit(state, unit, digitBit(digit)),
    })).filter(({ cells }) => cells.length >= 2 && cells.length <= size);

    for (const subset of combinations(pool, size)) {
      const cells = [...new Set(subset.flatMap((entry) => entry.cells))];
      if (cells.length !== size) continue;

      const digits = subset.reduce((mask, entry) => mask | entry.bit, 0);
      const step = eliminationStep(
        technique,
        cells,
        digits,
        eliminationsFor(state, cells, ALL_DIGITS & ~digits),
      );
      if (step) return step;
    }
  }
  return null;
}

export const findNakedPair = (state: GridState): Step | null =>
  findNakedSubset(state, 2, 'naked-pair');

export const findNakedTriple = (state: GridState): Step | null =>
  findNakedSubset(state, 3, 'naked-triple');

export const findHiddenPair = (state: GridState): Step | null =>
  findHiddenSubset(state, 2, 'hidden-pair');

export const findHiddenTriple = (state: GridState): Step | null =>
  findHiddenSubset(state, 3, 'hidden-triple');
