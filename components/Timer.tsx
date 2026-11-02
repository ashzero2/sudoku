import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { formatDuration, spokenDuration } from '@/lib/game/format';
import { elapsedMs } from '@/lib/game/timer';
import { useGameStore } from '@/stores/gameStore';
import { MAX_FONT_SCALE, type, weight } from '@/theme/tokens';

const TICK_MS = 1000;

export function Timer() {
  const theme = useTheme();
  const accumulatedMs = useGameStore((state) => state.game?.accumulatedMs ?? 0);
  const resumedAt = useGameStore((state) => state.game?.resumedAt ?? null);
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    if (resumedAt === null) return;
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, [resumedAt]);

  const elapsed = elapsedMs({ accumulatedMs, resumedAt }, now);

  return (
    <Text
      testID="timer"
      accessibilityRole="timer"
      accessibilityLabel={`Elapsed time ${spokenDuration(elapsed)}`}
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      style={[styles.time, { color: theme.text }]}
    >
      {formatDuration(elapsed)}
    </Text>
  );
}

const styles = StyleSheet.create({
  time: {
    fontSize: type.title,
    fontWeight: weight.medium,
    fontVariant: ['tabular-nums'],
  },
});
