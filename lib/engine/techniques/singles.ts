import {
  ALL_DIGITS,
  BOXES,
  CELL_COUNT,
  COLS,
  ROWS,
  UNITS,
  bitDigit,
  digitBit,
  isSingle,
} from '@/lib/engine/grid';
import { cellsWithDigit, isUnsolved } from '@/lib/engine/grid-state';
import type { GridState, Step, Technique } from '@/lib/engine/types';

const HIDDEN_SINGLE_UNITS = [...BOXES, ...ROWS, ...COLS];

function placementStep(technique: Technique, cell: number, digit: number): Step {
  return {
    technique,
    cells: [cell],
    digits: digitBit(digit),
    placement: { cell, digit },
    eliminations: [],
  };
}

export function findFullHouse(state: GridState): Step | null {
  for (const unit of UNITS) {
    const empty = unit.filter((cell) => isUnsolved(state, cell));
    if (empty.length !== 1) continue;

    let used = 0;
    for (const cell of unit) {
      if (!isUnsolved(state, cell)) used |= digitBit(state.values[cell]);
    }
    return placementStep('full-house', empty[0], bitDigit(ALL_DIGITS & ~used));
  }
  return null;
}

export function findHiddenSingle(state: GridState): Step | null {
  for (const unit of HIDDEN_SINGLE_UNITS) {
    let once = 0;
    let twice = 0;
    for (const cell of unit) {
      if (!isUnsolved(state, cell)) continue;
      const mask = state.candidates[cell];
      twice |= once & mask;
      once |= mask;
    }

    const hidden = once & ~twice;
    if (hidden === 0) continue;

    const bit = hidden & -hidden;
    const [cell] = cellsWithDigit(state, unit, bit);
    return placementStep('hidden-single', cell, bitDigit(bit));
  }
  return null;
}

export function findNakedSingle(state: GridState): Step | null {
  for (let cell = 0; cell < CELL_COUNT; cell++) {
    if (isUnsolved(state, cell) && isSingle(state.candidates[cell])) {
      return placementStep('naked-single', cell, bitDigit(state.candidates[cell]));
    }
  }
  return null;
}
