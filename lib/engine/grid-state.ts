import { ALL_DIGITS, CELL_COUNT, PEERS, digitBit } from '@/lib/engine/grid';
import type { Board, GridState, Step } from '@/lib/engine/types';

export function createState(board: Board): GridState {
  const values = [...board];
  const candidates = new Uint16Array(CELL_COUNT).fill(ALL_DIGITS);

  for (let cell = 0; cell < CELL_COUNT; cell++) {
    if (values[cell] === 0) continue;
    const bit = digitBit(values[cell]);
    candidates[cell] = bit;
    for (const peer of PEERS[cell]) {
      if (values[peer] === 0) candidates[peer] &= ~bit;
    }
  }

  return { values, candidates };
}

export function applyStep(state: GridState, step: Step): void {
  if (step.placement) {
    const { cell, digit } = step.placement;
    const bit = digitBit(digit);
    state.values[cell] = digit;
    state.candidates[cell] = bit;
    for (const peer of PEERS[cell]) {
      if (state.values[peer] === 0) state.candidates[peer] &= ~bit;
    }
    return;
  }

  for (const { cell, digits } of step.eliminations) {
    state.candidates[cell] &= ~digits;
  }
}

export function isUnsolved(state: GridState, cell: number): boolean {
  return state.values[cell] === 0;
}

export function cellsWithDigit(state: GridState, unit: readonly number[], bit: number): number[] {
  return unit.filter((cell) => isUnsolved(state, cell) && (state.candidates[cell] & bit) !== 0);
}
