import { applyStep, createState } from '@/lib/engine/grid-state';
import { findXWing, findSwordfish } from '@/lib/engine/techniques/fish';
import { findClaiming, findPointing } from '@/lib/engine/techniques/locked';
import { findFullHouse, findHiddenSingle, findNakedSingle } from '@/lib/engine/techniques/singles';
import {
  findHiddenPair,
  findHiddenTriple,
  findNakedPair,
  findNakedTriple,
} from '@/lib/engine/techniques/subsets';
import { findTurbotFish } from '@/lib/engine/techniques/turbot-fish';
import { findXYWing, findXYZWing } from '@/lib/engine/techniques/wings';
import type { Board, Finder, GridState, Step } from '@/lib/engine/types';

// Ordered like the Sukaku Explainer rating scale, so a hint never uses a harder
// technique than the puzzle's level requires.
const FINDERS: readonly Finder[] = [
  findFullHouse,
  findHiddenSingle,
  findNakedSingle,
  findPointing,
  findClaiming,
  findNakedPair,
  findXWing,
  findHiddenPair,
  findNakedTriple,
  findSwordfish,
  findHiddenTriple,
  findTurbotFish,
  findXYWing,
  findXYZWing,
];

export function findStep(state: GridState): Step | null {
  for (const finder of FINDERS) {
    const step = finder(state);
    if (step) return step;
  }
  return null;
}

/**
 * The steps from `board` up to and including the next placement, or null when
 * the implemented techniques cannot make progress. Assumes `board` has no
 * wrong entries.
 */
export function nextHint(board: Board): Step[] | null {
  const state = createState(board);
  const steps: Step[] = [];

  for (;;) {
    const step = findStep(state);
    if (!step) return null;
    steps.push(step);
    if (step.placement) return steps;
    applyStep(state, step);
  }
}
