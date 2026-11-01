import { DIFFICULTIES, type Difficulty } from '@/lib/engine/types';
import { streakAfterCompletion } from '@/lib/game/streak';

export interface Stats {
  gamesStarted: number;
  gamesCompleted: number;
  totalMistakes: number;
  totalHints: number;
  totalTimeMs: number;
  /** Hint-free completions only. */
  bestTimesMs: Record<Difficulty, number | null>;
  perDifficulty: Record<Difficulty, { started: number; completed: number }>;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
}

export interface CompletionResult {
  difficulty: Difficulty;
  elapsedMs: number;
  mistakes: number;
  hintsUsed: number;
  date: string;
}

function perDifficulty<T>(value: () => T): Record<Difficulty, T> {
  return Object.fromEntries(DIFFICULTIES.map((difficulty) => [difficulty, value()])) as Record<
    Difficulty,
    T
  >;
}

export function initialStats(): Stats {
  return {
    gamesStarted: 0,
    gamesCompleted: 0,
    totalMistakes: 0,
    totalHints: 0,
    totalTimeMs: 0,
    bestTimesMs: perDifficulty(() => null),
    perDifficulty: perDifficulty(() => ({ started: 0, completed: 0 })),
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
  };
}

export function recordStart(stats: Stats, difficulty: Difficulty): Stats {
  const level = stats.perDifficulty[difficulty];
  return {
    ...stats,
    gamesStarted: stats.gamesStarted + 1,
    perDifficulty: {
      ...stats.perDifficulty,
      [difficulty]: { ...level, started: level.started + 1 },
    },
  };
}

export function recordCompletion(
  stats: Stats,
  result: CompletionResult,
): { stats: Stats; isNewBest: boolean } {
  const { difficulty, elapsedMs, mistakes, hintsUsed, date } = result;
  const level = stats.perDifficulty[difficulty];
  const best = stats.bestTimesMs[difficulty];
  const isNewBest = hintsUsed === 0 && (best === null || elapsedMs < best);
  const currentStreak = streakAfterCompletion(stats.lastCompletedDate, stats.currentStreak, date);

  return {
    isNewBest,
    stats: {
      ...stats,
      gamesCompleted: stats.gamesCompleted + 1,
      totalMistakes: stats.totalMistakes + mistakes,
      totalHints: stats.totalHints + hintsUsed,
      totalTimeMs: stats.totalTimeMs + elapsedMs,
      bestTimesMs: isNewBest
        ? { ...stats.bestTimesMs, [difficulty]: elapsedMs }
        : stats.bestTimesMs,
      perDifficulty: {
        ...stats.perDifficulty,
        [difficulty]: { ...level, completed: level.completed + 1 },
      },
      currentStreak,
      longestStreak: Math.max(stats.longestStreak, currentStreak),
      lastCompletedDate: date,
    },
  };
}
