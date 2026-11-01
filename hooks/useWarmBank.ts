import { useEffect } from 'react';

import { loadLevel } from '@/lib/engine/bank';
import { useGameStore } from '@/stores/gameStore';

const DEFAULT_LEVEL = 'medium';

/** Parses the level the player is most likely to open next, so the first New Game does not pause. */
export function useWarmBank(): void {
  useEffect(() => {
    const handle = requestIdleCallback(() => {
      loadLevel(useGameStore.getState().game?.difficulty ?? DEFAULT_LEVEL);
    });
    return () => cancelIdleCallback(handle);
  }, []);
}
