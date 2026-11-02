import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import type { Difficulty } from '@/lib/engine/types';
import { formatDuration, spokenDuration } from '@/lib/game/format';
import { DIFFICULTY_LABELS } from '@/lib/game/labels';
import { MAX_FONT_SCALE, radius, spacing, type, weight } from '@/theme/tokens';

interface ContinueCardProps {
  difficulty: Difficulty;
  elapsedMs: number;
  filled: number;
  onPress: () => void;
}

export function ContinueCard({ difficulty, elapsedMs, filled, onPress }: ContinueCardProps) {
  const theme = useTheme();
  const label = DIFFICULTY_LABELS[difficulty];

  return (
    <Pressable
      testID="continue-card"
      accessibilityRole="button"
      accessibilityLabel={`Continue ${label}, ${spokenDuration(elapsedMs)} elapsed, ${filled} of 81 cells filled`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: pressed ? theme.selected : theme.surface },
      ]}
    >
      <Text
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        style={[styles.eyebrow, { color: theme.textMuted }]}
      >
        CONTINUE
      </Text>
      <View style={styles.row}>
        <View style={styles.text}>
          <Text
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            style={[styles.title, { color: theme.text }]}
          >
            {label}
          </Text>
          <Text
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            style={[styles.meta, { color: theme.textMuted }]}
          >
            {`${formatDuration(elapsedMs)} elapsed · ${filled} of 81 filled`}
          </Text>
        </View>
        <Text style={[styles.arrow, { color: theme.accent }]}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  eyebrow: { fontSize: type.micro, fontWeight: weight.bold, letterSpacing: 1.6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: spacing.xxs },
  title: { fontSize: type.heading, fontWeight: weight.semibold },
  meta: { fontSize: type.small, fontVariant: ['tabular-nums'] },
  arrow: { fontSize: type.title, fontWeight: weight.medium },
});
