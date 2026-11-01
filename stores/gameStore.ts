import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { loadLevel, pickPuzzle } from '@/lib/engine/bank';
import { createRng } from '@/lib/engine/rng';
import { solve } from '@/lib/engine/solver';
import type { Board, Difficulty } from '@/lib/engine/types';
import { createHint, type HintState } from '@/lib/game/hints';
import { erase, fillDigit, isSolved, redo, revealDigit, undo } from '@/lib/game/moves';
import { dateKey } from '@/lib/game/streak';
import { checkpoint, elapsedMs, pause, resume } from '@/lib/game/timer';
import type { CompletionSummary, CurrentGame } from '@/lib/game/types';
import { isValidGame } from '@/lib/game/validate';
import { useBankStore } from '@/stores/bankStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useStatsStore } from '@/stores/statsStore';
import { createStorage } from '@/stores/storage';

interface GameState {
  game: CurrentGame | null;
  /** Cleared whenever the board changes. */
  hint: HintState | null;
  /** The result of the game that just ended, until the player dismisses it. */
  completion: CompletionSummary | null;
  startGame: (difficulty: Difficulty) => void;
  /** Starts a specific puzzle instead of one from the bank. */
  startPuzzle: (difficulty: Difficulty, puzzleId: string, givens: Board) => void;
  selectCell: (cell: number) => void;
  toggleNotesMode: () => void;
  fillDigit: (digit: number) => void;
  erase: () => void;
  undo: () => void;
  redo: () => void;
  pause: () => void;
  resume: () => void;
  /** Each call advances the hint: highlight, then explain, then reveal the digit. */
  requestHint: () => void;
  dismissCompletion: () => void;
}

type PersistedGame = Pick<GameState, 'game'>;

function autoEliminateNotes(): boolean {
  return useSettingsStore.getState().settings.autoEliminateNotes;
}

// A game saved while running comes back paused, so time away never counts.
function restoreGame(persisted: unknown): CurrentGame | null {
  const game = (persisted as Partial<PersistedGame> | undefined)?.game;
  return isValidGame(game) ? { ...game, resumedAt: null } : null;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => {
      function finish(game: CurrentGame): void {
        const now = Date.now();
        const { difficulty, mistakes, hintsUsed } = game;
        const elapsed = elapsedMs(game, now);
        const isNewBest = useStatsStore.getState().recordCompletion({
          difficulty,
          elapsedMs: elapsed,
          mistakes,
          hintsUsed,
          date: dateKey(new Date(now)),
        });
        set({
          game: null,
          hint: null,
          completion: { difficulty, elapsedMs: elapsed, mistakes, hintsUsed, isNewBest },
        });
      }

      function edit(transform: (game: CurrentGame) => CurrentGame): void {
        const { game } = get();
        if (!game || game.resumedAt === null) return;

        const current = checkpoint(game, Date.now());
        const next = transform(current);
        if (next === current) return;

        set({ game: next, hint: null });
        if (isSolved(next)) finish(next);
      }

      function begin(
        difficulty: Difficulty,
        puzzleId: string,
        givens: Board,
        now: number,
      ): boolean {
        const solution = solve(givens);
        if (!solution) return false;

        useStatsStore.getState().recordStart(difficulty);
        set({
          game: {
            puzzleId,
            difficulty,
            givens,
            solution,
            board: [...givens],
            notes: givens.map(() => 0),
            history: [],
            redo: [],
            selectedCell: null,
            notesMode: false,
            mistakes: 0,
            hintsUsed: 0,
            accumulatedMs: 0,
            resumedAt: now,
            startedAt: now,
          },
          hint: null,
          completion: null,
        });
        return true;
      }

      function updateGame(transform: (game: CurrentGame) => CurrentGame): void {
        const { game } = get();
        if (game) set({ game: transform(game) });
      }

      return {
        game: null,
        hint: null,
        completion: null,

        startGame: (difficulty) => {
          const now = Date.now();
          const bank = useBankStore.getState();
          const pick = pickPuzzle(
            loadLevel(difficulty),
            bank.played[difficulty] ?? {},
            createRng(now),
          );
          const started = begin(difficulty, pick.id, [...pick.puzzle].map(Number), now);
          if (started) bank.markPlayed(difficulty, pick.id, now);
        },

        startPuzzle: (difficulty, puzzleId, givens) => {
          begin(difficulty, puzzleId, givens, Date.now());
        },

        selectCell: (cell) => updateGame((game) => ({ ...game, selectedCell: cell })),
        toggleNotesMode: () => updateGame((game) => ({ ...game, notesMode: !game.notesMode })),
        fillDigit: (digit) => edit((game) => fillDigit(game, digit, autoEliminateNotes())),
        erase: () => edit(erase),
        undo: () => edit(undo),
        redo: () => edit(redo),
        pause: () => updateGame((game) => pause(game, Date.now())),
        resume: () => updateGame((game) => resume(game, Date.now())),

        requestHint: () => {
          const { game, hint } = get();
          if (!game || game.resumedAt === null) return;

          if (!hint) {
            set({ hint: createHint(game) });
          } else if (hint.kind !== 'mistake' && hint.tier === 1) {
            set({ hint: { ...hint, tier: 2 } });
          } else if (hint.kind !== 'mistake') {
            const { cell, digit } = hint.placement;
            edit((current) => revealDigit(current, cell, digit, autoEliminateNotes()));
          }
        },

        dismissCompletion: () => set({ completion: null }),
      };
    },
    {
      name: 'game',
      version: 1,
      storage: createStorage<PersistedGame>(),
      partialize: ({ game }) => ({ game }),
      merge: (persisted, current) => ({ ...current, game: restoreGame(persisted) }),
    },
  ),
);
