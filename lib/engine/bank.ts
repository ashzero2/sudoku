import type { Rng } from '@/lib/engine/rng';
import type { BankPuzzle, Difficulty } from '@/lib/engine/types';

type BankRow = [id: string, puzzle: string, se: number];

// Each level is a separate module so only the levels a player opens get parsed.
const LEVEL_LOADERS: Record<Difficulty, () => BankRow[]> = {
  'very-easy': () => require('@/assets/bank/very-easy.json'),
  easy: () => require('@/assets/bank/easy.json'),
  medium: () => require('@/assets/bank/medium.json'),
  hard: () => require('@/assets/bank/hard.json'),
  expert: () => require('@/assets/bank/expert.json'),
  extreme: () => require('@/assets/bank/extreme.json'),
};

const loadedLevels = new Map<Difficulty, readonly BankPuzzle[]>();

export function loadLevel(difficulty: Difficulty): readonly BankPuzzle[] {
  let puzzles = loadedLevels.get(difficulty);
  if (!puzzles) {
    puzzles = LEVEL_LOADERS[difficulty]().map(([id, puzzle, se]) => ({ id, puzzle, se }));
    loadedLevels.set(difficulty, puzzles);
  }
  return puzzles;
}

/**
 * A random unplayed puzzle, or the least recently played one once every puzzle
 * has been played. `played` maps puzzle id to the time it was last played.
 */
export function pickPuzzle(
  puzzles: readonly BankPuzzle[],
  played: Readonly<Record<string, number>>,
  rng: Rng,
): BankPuzzle {
  const unplayed = puzzles.filter((puzzle) => played[puzzle.id] === undefined);
  if (unplayed.length > 0) return unplayed[Math.floor(rng() * unplayed.length)];

  return puzzles.reduce((oldest, puzzle) =>
    played[puzzle.id] < played[oldest.id] ? puzzle : oldest,
  );
}
