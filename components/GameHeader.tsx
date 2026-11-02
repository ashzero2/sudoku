import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Timer } from '@/components/Timer';
import { useTheme } from '@/hooks/useTheme';
import { DIFFICULTY_LABELS } from '@/lib/game/labels';
import { useGameStore } from '@/stores/gameStore';
import { icon, MAX_FONT_SCALE, MIN_TARGET, opacity, spacing, type, weight } from '@/theme/tokens';

export function GameHeader({ onBack }: { onBack: () => void }) {
  const theme = useTheme();
  const difficulty = useGameStore((state) => state.game?.difficulty);
  const isPaused = useGameStore((state) => state.game?.resumedAt === null);
  const pause = useGameStore((state) => state.pause);

  return (
    <View style={styles.header}>
      <Pressable
        testID="game-back"
        accessibilityRole="button"
        accessibilityLabel="Back to home"
        onPress={onBack}
        style={({ pressed }) => [styles.back, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Ionicons name="chevron-back" size={icon.md} color={theme.text} />
      </Pressable>
      <Text
        testID="difficulty-label"
        numberOfLines={1}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        style={[styles.difficulty, { color: theme.text }]}
      >
        {difficulty ? DIFFICULTY_LABELS[difficulty] : ''}
      </Text>
      <Timer />
      <Pressable
        testID="pause-button"
        accessibilityRole="button"
        accessibilityLabel="Pause"
        accessibilityState={{ disabled: isPaused }}
        disabled={isPaused}
        onPress={pause}
        style={[styles.pause, { opacity: isPaused ? opacity.disabled : 1 }]}
      >
        <Ionicons name="pause-outline" size={icon.md} color={theme.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  back: {
    width: MIN_TARGET,
    height: MIN_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  difficulty: { flex: 1, fontSize: type.body, fontWeight: weight.semibold },
  pause: {
    width: MIN_TARGET,
    height: MIN_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.sm,
  },
});
