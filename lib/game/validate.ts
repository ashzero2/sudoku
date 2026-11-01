import { BOARD_SIZE, CELL_COUNT } from '@/lib/engine/grid';
import { DIFFICULTIES } from '@/lib/engine/types';
import type { CurrentGame } from '@/lib/game/types';

const ALL_NOTES = (1 << BOARD_SIZE) - 1;

function isIntegerIn(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function isGrid(value: unknown, max: number): boolean {
  return (
    Array.isArray(value) &&
    value.length === CELL_COUNT &&
    value.every((entry) => isIntegerIn(entry, 0, max))
  );
}

function isMoveList(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (move) =>
        Array.isArray(move) &&
        move.length > 0 &&
        move.every(
          (change) =>
            typeof change === 'object' &&
            change !== null &&
            isIntegerIn(change.cell, 0, CELL_COUNT - 1) &&
            isIntegerIn(change.prevValue, 0, BOARD_SIZE) &&
            isIntegerIn(change.prevNotes, 0, ALL_NOTES),
        ),
    )
  );
}

/** Guards against a corrupt or foreign saved game before it reaches the app. */
export function isValidGame(value: unknown): value is CurrentGame {
  if (typeof value !== 'object' || value === null) return false;
  const game = value as Record<string, unknown>;

  return (
    typeof game.puzzleId === 'string' &&
    DIFFICULTIES.some((difficulty) => difficulty === game.difficulty) &&
    isGrid(game.givens, BOARD_SIZE) &&
    isGrid(game.solution, BOARD_SIZE) &&
    isGrid(game.board, BOARD_SIZE) &&
    isGrid(game.notes, ALL_NOTES) &&
    isMoveList(game.history) &&
    isMoveList(game.redo) &&
    (game.selectedCell === null || isIntegerIn(game.selectedCell, 0, CELL_COUNT - 1)) &&
    typeof game.notesMode === 'boolean' &&
    isIntegerIn(game.mistakes, 0, Number.MAX_SAFE_INTEGER) &&
    isIntegerIn(game.hintsUsed, 0, Number.MAX_SAFE_INTEGER) &&
    isIntegerIn(game.accumulatedMs, 0, Number.MAX_SAFE_INTEGER) &&
    (game.resumedAt === null || typeof game.resumedAt === 'number') &&
    typeof game.startedAt === 'number'
  );
}
