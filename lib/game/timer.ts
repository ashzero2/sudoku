import type { CurrentGame } from '@/lib/game/types';

export function elapsedMs(game: CurrentGame, now: number): number {
  if (game.resumedAt === null) return game.accumulatedMs;
  // The device clock can move backwards; never subtract time.
  return game.accumulatedMs + Math.max(0, now - game.resumedAt);
}

/** Folds the running time into `accumulatedMs`, so a persisted game is never far behind. */
export function checkpoint(game: CurrentGame, now: number): CurrentGame {
  if (game.resumedAt === null) return game;
  return { ...game, accumulatedMs: elapsedMs(game, now), resumedAt: now };
}

export function pause(game: CurrentGame, now: number): CurrentGame {
  if (game.resumedAt === null) return game;
  return { ...game, accumulatedMs: elapsedMs(game, now), resumedAt: null };
}

export function resume(game: CurrentGame, now: number): CurrentGame {
  return game.resumedAt === null ? { ...game, resumedAt: now } : game;
}
