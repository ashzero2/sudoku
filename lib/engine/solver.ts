import {
  ALL_DIGITS,
  CELL_COUNT,
  PEERS,
  UNITS,
  bitDigit,
  digitBit,
  isSingle,
  popCount,
} from '@/lib/engine/grid';
import type { Board } from '@/lib/engine/types';

interface SearchResult {
  count: number;
  solution: Board | null;
}

// Cells waiting to have their single candidate removed from their peers. A cell
// becomes single at most once, so 81 slots suffice. Shared because propagation
// always finishes before the search recurses.
const queue = new Uint8Array(CELL_COUNT);

function initialCandidates(board: Board): Uint16Array {
  const candidates = new Uint16Array(CELL_COUNT);
  for (let cell = 0; cell < CELL_COUNT; cell++) {
    candidates[cell] = board[cell] === 0 ? ALL_DIGITS : digitBit(board[cell]);
  }
  return candidates;
}

function propagate(candidates: Uint16Array, seeded: number): boolean {
  let head = 0;
  let tail = seeded;

  for (;;) {
    while (head < tail) {
      const cell = queue[head++];
      const bit = candidates[cell];
      for (const peer of PEERS[cell]) {
        const before = candidates[peer];
        if ((before & bit) === 0) continue;
        const after = before & ~bit;
        if (after === 0) return false;
        candidates[peer] = after;
        if (isSingle(after)) queue[tail++] = peer;
      }
    }

    let placed = false;
    for (const unit of UNITS) {
      let once = 0;
      let twice = 0;
      for (const cell of unit) {
        const mask = candidates[cell];
        twice |= once & mask;
        once |= mask;
      }
      if (once !== ALL_DIGITS) return false;

      const hidden = once & ~twice;
      if (hidden === 0) continue;
      for (const cell of unit) {
        const forced = candidates[cell] & hidden;
        if (forced === 0 || forced === candidates[cell]) continue;
        if (!isSingle(forced)) return false;
        candidates[cell] = forced;
        queue[tail++] = cell;
        placed = true;
      }
    }

    if (!placed) return true;
  }
}

function search(candidates: Uint16Array, limit: number, result: SearchResult): void {
  let branchCell = -1;
  let fewest = ALL_DIGITS;
  for (let cell = 0; cell < CELL_COUNT; cell++) {
    const count = popCount(candidates[cell]);
    if (count > 1 && count < fewest) {
      branchCell = cell;
      fewest = count;
      if (count === 2) break;
    }
  }

  if (branchCell === -1) {
    result.count++;
    result.solution ??= Array.from(candidates, bitDigit);
    return;
  }

  let remaining = candidates[branchCell];
  while (remaining !== 0 && result.count < limit) {
    const bit = remaining & -remaining;
    remaining ^= bit;

    const next = candidates.slice();
    next[branchCell] = bit;
    queue[0] = branchCell;
    if (propagate(next, 1)) search(next, limit, result);
  }
}

function run(board: Board, limit: number): SearchResult {
  const result: SearchResult = { count: 0, solution: null };
  const candidates = initialCandidates(board);

  let seeded = 0;
  for (let cell = 0; cell < CELL_COUNT; cell++) {
    if (isSingle(candidates[cell])) queue[seeded++] = cell;
  }

  if (propagate(candidates, seeded)) search(candidates, limit, result);
  return result;
}

/** Counts solutions of `board`, stopping as soon as `limit` are found. */
export function countSolutions(board: Board, limit: number): number {
  return run(board, limit).count;
}

export function solve(board: Board): Board | null {
  return run(board, 1).solution;
}
