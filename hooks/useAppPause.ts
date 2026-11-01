import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useGameStore } from '@/stores/gameStore';

/** Stops the clock whenever the app leaves the foreground. */
export function useAppPause(): void {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background') useGameStore.getState().pause();
    });
    return () => subscription.remove();
  }, []);
}
