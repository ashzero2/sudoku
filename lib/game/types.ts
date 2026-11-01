import type { Board, Difficulty, Notes } from '@/lib/engine/types';

export interface CellChange {
  cell: number;
  prevValue: number;
  prevNotes: number;
}

/** One user action: every cell it changed, target cell first. */
export type Move = CellChange[];

export interface CurrentGame {
  puzzleId: string;
  difficulty: Difficulty;
  givens: Board;
  solution: Board;
  board: Board;
  notes: Notes;
  history: Move[];
  redo: Move[];
  selectedCell: number | null;
  notesMode: boolean;
  mistakes: number;
  hintsUsed: number;
  accumulatedMs: number;
  /** When the clock last started running; null while paused. */
  resumedAt: number | null;
  startedAt: number;
}

export interface CompletionSummary {
  difficulty: Difficulty;
  elapsedMs: number;
  mistakes: number;
  hintsUsed: number;
  isNewBest: boolean;
}
