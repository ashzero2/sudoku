import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { formatDuration } from '@/lib/game/format';
import { elapsedMs } from '@/lib/game/timer';
import { useGameStore } from '@/stores/gameStore';

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

  return (
    <Text
      testID="timer"
      accessibilityRole="timer"
      maxFontSizeMultiplier={1.3}
      style={[styles.time, { color: theme.text }]}
    >
      {formatDuration(elapsedMs({ accumulatedMs, resumedAt }, now))}
    </Text>
  );
}

const styles = StyleSheet.create({
  time: { fontSize: 24, fontWeight: '500', fontVariant: ['tabular-nums'] },
});
