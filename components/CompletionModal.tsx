import { Modal, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ValueRow } from '@/components/ui/ValueRow';
import { useTheme } from '@/hooks/useTheme';
import { formatDuration, spokenDuration } from '@/lib/game/format';
import { DIFFICULTY_LABELS } from '@/lib/game/labels';
import { useGameStore } from '@/stores/gameStore';
import { border, MAX_FONT_SCALE, radius, spacing, type, weight } from '@/theme/tokens';

export function CompletionModal({ onHome }: { onHome: () => void }) {
  const theme = useTheme();
  const completion = useGameStore((state) => state.completion);
  const dismissCompletion = useGameStore((state) => state.dismissCompletion);

  if (!completion) return null;

  const rows = [
    {
      id: 'time',
      label: 'Time',
      value: formatDuration(completion.elapsedMs),
      spoken: spokenDuration(completion.elapsedMs),
    },
    { id: 'mistakes', label: 'Mistakes', value: String(completion.mistakes) },
    { id: 'hints', label: 'Hints', value: String(completion.hintsUsed) },
  ];

  function goHome(): void {
    dismissCompletion();
    onHome();
  }

  return (
    <Modal transparent animationType="fade" visible onRequestClose={goHome}>
      <View style={[styles.backdrop, { backgroundColor: theme.scrim }]}>
        <View
          testID="completion-modal"
          style={[styles.card, { backgroundColor: theme.background, borderColor: theme.line }]}
        >
          <Text
            accessibilityRole="header"
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            style={[styles.title, { color: theme.text }]}
          >
            Solved
          </Text>
          <Text
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            style={[styles.level, { color: theme.textMuted }]}
          >
            {DIFFICULTY_LABELS[completion.difficulty]}
          </Text>
          {completion.isNewBest && (
            <Text
              testID="completion-new-best"
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              style={[styles.best, { color: theme.accent }]}
            >
              New best time
            </Text>
          )}
          {rows.map(({ id, label, value, spoken }) => (
            <ValueRow
              key={id}
              testID={`completion-${id}`}
              label={label}
              value={value}
              spoken={spoken}
            />
          ))}
          <Button
            testID="completion-home"
            label="Back to home"
            variant="primary"
            onPress={goHome}
            style={styles.action}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    alignSelf: 'stretch',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: border.hairline,
  },
  title: { fontSize: type.title, fontWeight: weight.semibold },
  level: { fontSize: type.label },
  best: { fontSize: type.body, fontWeight: weight.bold },
  action: { marginTop: spacing.sm },
});
