import { PEERS, digitBit } from '@/lib/engine/grid';
import type { Board, Notes } from '@/lib/engine/types';
import type { CellChange, CurrentGame, Move } from '@/lib/game/types';

function snapshot(game: CurrentGame, cell: number): CellChange {
  return { cell, prevValue: game.board[cell], prevNotes: game.notes[cell] };
}

function commit(game: CurrentGame, board: Board, notes: Notes, move: Move): CurrentGame {
  return { ...game, board, notes, history: [...game.history, move], redo: [] };
}

function editableCell(game: CurrentGame): number | null {
  const cell = game.selectedCell;
  return cell !== null && game.givens[cell] === 0 ? cell : null;
}

function place(
  game: CurrentGame,
  cell: number,
  digit: number,
  autoEliminate: boolean,
): CurrentGame {
  const bit = digitBit(digit);
  const board = [...game.board];
  const notes = [...game.notes];
  const move: Move = [snapshot(game, cell)];

  board[cell] = digit;
  notes[cell] = 0;
  if (autoEliminate) {
    for (const peer of PEERS[cell]) {
      if ((notes[peer] & bit) === 0) continue;
      move.push(snapshot(game, peer));
      notes[peer] &= ~bit;
    }
  }
  return commit(game, board, notes, move);
}

function restore(game: CurrentGame, move: Move): { board: Board; notes: Notes; inverse: Move } {
  const board = [...game.board];
  const notes = [...game.notes];
  const inverse = move.map(({ cell }) => snapshot(game, cell));
  for (const { cell, prevValue, prevNotes } of move) {
    board[cell] = prevValue;
    notes[cell] = prevNotes;
  }
  return { board, notes, inverse };
}

export function isSolved(game: CurrentGame): boolean {
  return game.board.every((value, cell) => value === game.solution[cell]);
}

export function fillDigit(game: CurrentGame, digit: number, autoEliminate: boolean): CurrentGame {
  const cell = editableCell(game);
  if (cell === null) return game;

  if (game.notesMode) {
    if (game.board[cell] !== 0) return game;
    const notes = [...game.notes];
    notes[cell] ^= digitBit(digit);
    return commit(game, game.board, notes, [snapshot(game, cell)]);
  }

  if (game.board[cell] === digit) return game;
  const placed = place(game, cell, digit, autoEliminate);
  return digit === game.solution[cell] ? placed : { ...placed, mistakes: placed.mistakes + 1 };
}

export function erase(game: CurrentGame): CurrentGame {
  const cell = editableCell(game);
  if (cell === null || (game.board[cell] === 0 && game.notes[cell] === 0)) return game;

  const board = [...game.board];
  const notes = [...game.notes];
  board[cell] = 0;
  notes[cell] = 0;
  return commit(game, board, notes, [snapshot(game, cell)]);
}

export function revealDigit(
  game: CurrentGame,
  cell: number,
  digit: number,
  autoEliminate: boolean,
): CurrentGame {
  return {
    ...place(game, cell, digit, autoEliminate),
    selectedCell: cell,
    hintsUsed: game.hintsUsed + 1,
  };
}

export function undo(game: CurrentGame): CurrentGame {
  const move = game.history[game.history.length - 1];
  if (!move) return game;

  const { board, notes, inverse } = restore(game, move);
  return {
    ...game,
    board,
    notes,
    history: game.history.slice(0, -1),
    redo: [...game.redo, inverse],
    selectedCell: move[0].cell,
  };
}

export function redo(game: CurrentGame): CurrentGame {
  const move = game.redo[game.redo.length - 1];
  if (!move) return game;

  const { board, notes, inverse } = restore(game, move);
  return {
    ...game,
    board,
    notes,
    history: [...game.history, inverse],
    redo: game.redo.slice(0, -1),
    selectedCell: move[0].cell,
  };
}
