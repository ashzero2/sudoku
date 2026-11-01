import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { DIFFICULTIES, type Difficulty } from '@/lib/engine/types';
import { useGameStore } from '@/stores/gameStore';

const E2E_ENABLED = process.env.EXPO_PUBLIC_E2E === '1';
const PUZZLE_PATTERN = /^[0-9]{81}$/;
const DEFAULT_LEVEL: Difficulty = 'medium';

/**
 * Test-only: `sudoku://e2e/start?puzzle=<81 digits>&difficulty=<level>` starts that puzzle.
 * It does nothing unless the build sets EXPO_PUBLIC_E2E=1 (the `e2e` profile).
 */
export default function E2EStart() {
  const router = useRouter();
  const startPuzzle = useGameStore((state) => state.startPuzzle);
  const { puzzle, difficulty } = useLocalSearchParams<{ puzzle?: string; difficulty?: string }>();

  const isValid = E2E_ENABLED && puzzle !== undefined && PUZZLE_PATTERN.test(puzzle);

  useEffect(() => {
    if (!isValid) return;
    const level = DIFFICULTIES.find((candidate) => candidate === difficulty) ?? DEFAULT_LEVEL;
    startPuzzle(level, 'e2e', [...puzzle].map(Number));
    router.dismissTo('/');
  }, [isValid, puzzle, difficulty, startPuzzle, router]);

  return isValid ? null : <Redirect href="/" />;
}
