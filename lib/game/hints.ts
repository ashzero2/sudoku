import { popCount } from '@/lib/engine/grid';
import { createState } from '@/lib/engine/grid-state';
import { nextHint } from '@/lib/engine/logic-solver';
import type { Placement, Step } from '@/lib/engine/types';
import type { CurrentGame } from '@/lib/game/types';

export type HintTier = 1 | 2;

export type HintState =
  | { kind: 'mistake'; cell: number }
  | { kind: 'technique'; steps: Step[]; placement: Placement; tier: HintTier }
  | { kind: 'fallback'; placement: Placement; tier: HintTier };

function fewestCandidatesCell(game: CurrentGame): number {
  const { values, candidates } = createState(game.board);
  let best = -1;
  values.forEach((value, cell) => {
    if (value !== 0) return;
    if (best === -1 || popCount(candidates[cell]) < popCount(candidates[best])) best = cell;
  });
  return best;
}

/**
 * A wrong entry is flagged before anything else. Otherwise the steps of the
 * next logical placement, or, when the implemented techniques stall, the
 * easiest cell with the known solution digit.
 */
export function createHint(game: CurrentGame): HintState | null {
  const wrong = game.board.findIndex((value, cell) => value !== 0 && value !== game.solution[cell]);
  if (wrong !== -1) return { kind: 'mistake', cell: wrong };

  const steps = nextHint(game.board);
  const placement = steps?.[steps.length - 1].placement;
  if (steps && placement) return { kind: 'technique', steps, placement, tier: 1 };

  const cell = fewestCandidatesCell(game);
  if (cell === -1) return null;
  return { kind: 'fallback', placement: { cell, digit: game.solution[cell] }, tier: 1 };
}
