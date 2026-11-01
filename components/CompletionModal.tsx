import { Modal, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { formatDuration } from '@/lib/game/format';
import { DIFFICULTY_LABELS } from '@/lib/game/labels';
import { useGameStore } from '@/stores/gameStore';
import { radius, spacing } from '@/theme/tokens';

export function CompletionModal({ onNewGame }: { onNewGame: () => void }) {
  const theme = useTheme();
  const completion = useGameStore((state) => state.completion);
  const dismissCompletion = useGameStore((state) => state.dismissCompletion);

  if (!completion) return null;

  const rows = [
    { id: 'time', label: 'Time', value: formatDuration(completion.elapsedMs) },
    { id: 'mistakes', label: 'Mistakes', value: String(completion.mistakes) },
    { id: 'hints', label: 'Hints', value: String(completion.hintsUsed) },
  ];

  function startAnother(): void {
    dismissCompletion();
    onNewGame();
  }

  return (
    <Modal transparent animationType="fade" visible onRequestClose={dismissCompletion}>
      <View style={[styles.backdrop, { backgroundColor: theme.scrim }]}>
        <View
          testID="completion-modal"
          style={[styles.card, { backgroundColor: theme.background, borderColor: theme.line }]}
        >
          <Text accessibilityRole="header" style={[styles.title, { color: theme.text }]}>
            Solved
          </Text>
          <Text style={[styles.level, { color: theme.textMuted }]}>
            {DIFFICULTY_LABELS[completion.difficulty]}
          </Text>
          {completion.isNewBest && (
            <Text testID="completion-new-best" style={[styles.best, { color: theme.accent }]}>
              New best time
            </Text>
          )}
          {rows.map(({ id, label, value }) => (
            <View key={id} style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
              <Text style={[styles.rowLabel, { color: theme.textMuted }]}>{label}</Text>
              <Text testID={`completion-${id}`} style={[styles.rowValue, { color: theme.text }]}>
                {value}
              </Text>
            </View>
          ))}
          <View style={styles.actions}>
            <Button testID="completion-close" label="Close" onPress={dismissCompletion} />
            <Button
              testID="completion-new-game"
              label="New game"
              variant="primary"
              onPress={startAnother}
            />
          </View>
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
    borderWidth: 1,
  },
  title: { fontSize: 24, fontWeight: '600' },
  level: { fontSize: 14 },
  best: { fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { fontSize: 16 },
  rowValue: { fontSize: 16, fontWeight: '600', fontVariant: ['tabular-nums'] },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
