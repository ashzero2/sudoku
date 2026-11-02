import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { useGameStore } from '@/stores/gameStore';

/** Stops the clock when the game screen loses focus, so time on Home never counts. */
export function usePauseOnBlur(): void {
  useFocusEffect(
    useCallback(() => {
      return () => useGameStore.getState().pause();
    }, []),
  );
}
