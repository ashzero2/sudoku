import type { Difficulty } from '@/lib/engine/types';

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  'very-easy': 'Very easy',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
  extreme: 'Extreme',
};

/** The hardest techniques a level needs, so players can choose with some idea of what to expect. */
export const DIFFICULTY_HINTS: Record<Difficulty, string> = {
  'very-easy': 'Basic singles',
  easy: 'Singles and pointing',
  medium: 'Pairs and locked sets',
  hard: 'Fish and wings',
  expert: 'Chains and rectangles',
  extreme: 'Forcing chains',
};
