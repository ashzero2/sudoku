import { CELL_COUNT, PEERS, commonPeers, popCount } from '@/lib/engine/grid';
import { isUnsolved } from '@/lib/engine/grid-state';
import type { GridState, Step } from '@/lib/engine/types';
import { eliminationStep, eliminationsFor } from '@/lib/engine/techniques/elimination';

function unsolvedPeers(state: GridState, pivot: number, digitCount: number): number[] {
  return PEERS[pivot].filter(
    (cell) => isUnsolved(state, cell) && popCount(state.candidates[cell]) === digitCount,
  );
}

export function findXYWing(state: GridState): Step | null {
  for (let pivot = 0; pivot < CELL_COUNT; pivot++) {
    if (!isUnsolved(state, pivot) || popCount(state.candidates[pivot]) !== 2) continue;
    const pivotMask = state.candidates[pivot];
    const pincers = unsolvedPeers(state, pivot, 2);

    for (const a of pincers) {
      const shared = state.candidates[a] & pivotMask;
      if (popCount(shared) !== 1) continue;

      const common = state.candidates[a] & ~pivotMask;
      const otherPivotDigit = pivotMask & ~shared;
      for (const b of pincers) {
        if (b === a || state.candidates[b] !== (otherPivotDigit | common)) continue;

        const step = eliminationStep(
          'xy-wing',
          [pivot, a, b],
          common,
          eliminationsFor(state, commonPeers([a, b]), common),
        );
        if (step) return step;
      }
    }
  }
  return null;
}

export function findXYZWing(state: GridState): Step | null {
  for (let pivot = 0; pivot < CELL_COUNT; pivot++) {
    if (!isUnsolved(state, pivot) || popCount(state.candidates[pivot]) !== 3) continue;
    const pivotMask = state.candidates[pivot];
    const pincers = unsolvedPeers(state, pivot, 2).filter(
      (cell) => (state.candidates[cell] & ~pivotMask) === 0,
    );

    for (const a of pincers) {
      for (const b of pincers) {
        if (b <= a) continue;
        if ((state.candidates[a] | state.candidates[b]) !== pivotMask) continue;

        const common = state.candidates[a] & state.candidates[b];
        if (popCount(common) !== 1) continue;

        const step = eliminationStep(
          'xyz-wing',
          [pivot, a, b],
          common,
          eliminationsFor(state, commonPeers([pivot, a, b]), common),
        );
        if (step) return step;
      }
    }
  }
  return null;
}
