import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Difficulty } from '@/lib/engine/types';
import {
  initialStats,
  recordCompletion,
  recordStart,
  type CompletionResult,
  type Stats,
} from '@/lib/game/stats';
import { createStorage } from '@/stores/storage';

interface StatsState {
  stats: Stats;
  recordStart: (difficulty: Difficulty) => void;
  /** Returns whether the completion set a new best time. */
  recordCompletion: (result: CompletionResult) => boolean;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      stats: initialStats(),
      recordStart: (difficulty) =>
        set((state) => ({ stats: recordStart(state.stats, difficulty) })),
      recordCompletion: (result) => {
        const { stats, isNewBest } = recordCompletion(get().stats, result);
        set({ stats });
        return isNewBest;
      },
    }),
    {
      name: 'stats',
      version: 1,
      storage: createStorage<Pick<StatsState, 'stats'>>(),
      partialize: ({ stats }) => ({ stats }),
    },
  ),
);
