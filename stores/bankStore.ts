import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DIFFICULTIES, type Difficulty } from '@/lib/engine/types';
import { createStorage } from '@/stores/storage';

type PlayedByLevel = Record<Difficulty, Record<string, number>>;

interface BankState {
  /** Puzzle id to the time it was last played, per level. */
  played: PlayedByLevel;
  markPlayed: (difficulty: Difficulty, id: string, now: number) => void;
}

function emptyPlayed(): PlayedByLevel {
  return Object.fromEntries(DIFFICULTIES.map((difficulty) => [difficulty, {}])) as PlayedByLevel;
}

export const useBankStore = create<BankState>()(
  persist(
    (set) => ({
      played: emptyPlayed(),
      markPlayed: (difficulty, id, now) =>
        set((state) => ({
          played: { ...state.played, [difficulty]: { ...state.played[difficulty], [id]: now } },
        })),
    }),
    {
      name: 'bank',
      version: 1,
      storage: createStorage<Pick<BankState, 'played'>>(),
      partialize: ({ played }) => ({ played }),
    },
  ),
);
