import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Timer } from '@/components/Timer';
import { useTheme } from '@/hooks/useTheme';
import { dateKey, visibleStreak } from '@/lib/game/streak';
import { DIFFICULTY_LABELS } from '@/lib/game/labels';
import { useGameStore } from '@/stores/gameStore';
import { useStatsStore } from '@/stores/statsStore';
import { MIN_TARGET, spacing } from '@/theme/tokens';

export function GameHeader({ onNewGame }: { onNewGame: () => void }) {
  const theme = useTheme();
  const difficulty = useGameStore((state) => state.game?.difficulty);
  const isPaused = useGameStore((state) => state.game?.resumedAt === null);
  const pause = useGameStore((state) => state.pause);
  const stats = useStatsStore((state) => state.stats);

  const streak = visibleStreak(stats.lastCompletedDate, stats.currentStreak, dateKey(new Date()));

  return (
    <View style={styles.header}>
      <View style={styles.summary}>
        <Text
          testID="difficulty-label"
          maxFontSizeMultiplier={1.3}
          style={[styles.difficulty, { color: theme.text }]}
        >
          {difficulty ? DIFFICULTY_LABELS[difficulty] : ''}
        </Text>
        <Text
          testID="streak-summary"
          maxFontSizeMultiplier={1.3}
          style={[styles.streak, { color: theme.textMuted }]}
        >
          {`Streak ${streak} · ${stats.gamesCompleted} solved`}
        </Text>
      </View>
      <Timer />
      <View style={styles.actions}>
        <Pressable
          testID="pause-button"
          accessibilityRole="button"
          accessibilityLabel="Pause"
          accessibilityState={{ disabled: isPaused }}
          disabled={isPaused}
          onPress={pause}
          style={[styles.pause, { opacity: isPaused ? 0.45 : 1 }]}
        >
          <Ionicons name="pause-outline" size={24} color={theme.text} />
        </Pressable>
        <Button testID="new-game-button" label="New game" onPress={onNewGame} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summary: { gap: spacing.xs },
  difficulty: { fontSize: 18, fontWeight: '600' },
  streak: { fontSize: 13 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  pause: {
    width: MIN_TARGET,
    height: MIN_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
