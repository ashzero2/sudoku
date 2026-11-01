import { AndroidHaptics, performAndroidHapticsAsync } from 'expo-haptics';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useGameStore } from '@/stores/gameStore';
import { useSettingsStore } from '@/stores/settingsStore';

function play(type: AndroidHaptics): void {
  void performAndroidHapticsAsync(type);
}

/** Feedback for what happened in the game, driven by the store so no component has to ask for it. */
export function useGameHaptics(): void {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    return useGameStore.subscribe((state, previous) => {
      if (!useSettingsStore.getState().settings.haptics) return;

      if (state.completion && !previous.completion) {
        play(AndroidHaptics.Confirm);
        return;
      }
      if (state.hint && state.hint !== previous.hint) {
        play(AndroidHaptics.Segment_Tick);
        return;
      }

      const { game } = state;
      const before = previous.game;
      if (!game || !before || game.puzzleId !== before.puzzleId) return;

      if (game.mistakes > before.mistakes) {
        play(AndroidHaptics.Reject);
      } else if (
        game.history.length !== before.history.length ||
        game.redo.length !== before.redo.length
      ) {
        play(AndroidHaptics.Keyboard_Tap);
      }
    });
  }, []);
}
