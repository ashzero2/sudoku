import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { DIFFICULTIES, type Difficulty } from '@/lib/engine/types';
import { formatDuration } from '@/lib/game/format';
import { DIFFICULTY_HINTS, DIFFICULTY_LABELS } from '@/lib/game/labels';
import { useGameStore } from '@/stores/gameStore';
import { useStatsStore } from '@/stores/statsStore';
import { MIN_TARGET, radius, spacing } from '@/theme/tokens';

interface NewGameSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function NewGameSheet({ visible, onClose }: NewGameSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const hasProgress = useGameStore((state) => (state.game?.history.length ?? 0) > 0);
  const startGame = useGameStore((state) => state.startGame);
  const bestTimes = useStatsStore((state) => state.stats.bestTimesMs);

  function start(difficulty: Difficulty): void {
    startGame(difficulty);
    onClose();
  }

  function choose(difficulty: Difficulty): void {
    if (!hasProgress) {
      start(difficulty);
      return;
    }
    Alert.alert('Start a new game?', 'Your current game will be abandoned.', [
      { text: 'Keep playing', style: 'cancel' },
      { text: 'Start new game', onPress: () => start(difficulty) },
    ]);
  }

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <Pressable
        testID="new-game-backdrop"
        accessibilityLabel="Close"
        onPress={onClose}
        style={[styles.backdrop, { backgroundColor: theme.scrim }]}
      />
      <View
        testID="new-game-sheet"
        style={[
          styles.sheet,
          { backgroundColor: theme.background, paddingBottom: spacing.md + insets.bottom },
        ]}
      >
        <Text accessibilityRole="header" style={[styles.title, { color: theme.text }]}>
          New game
        </Text>
        {DIFFICULTIES.map((difficulty) => {
          const best = bestTimes[difficulty];
          const bestLabel = best === null ? 'No best time yet' : `Best ${formatDuration(best)}`;
          return (
            <Pressable
              key={difficulty}
              testID={`difficulty-${difficulty}`}
              accessibilityRole="button"
              accessibilityLabel={`${DIFFICULTY_LABELS[difficulty]}. ${DIFFICULTY_HINTS[difficulty]}. ${bestLabel}`}
              onPress={() => choose(difficulty)}
              style={({ pressed }) => [
                styles.row,
                { backgroundColor: pressed ? theme.selected : theme.surface },
              ]}
            >
              <View style={styles.rowText}>
                <Text maxFontSizeMultiplier={1.3} style={[styles.label, { color: theme.text }]}>
                  {DIFFICULTY_LABELS[difficulty]}
                </Text>
                <Text maxFontSizeMultiplier={1.3} style={[styles.hint, { color: theme.textMuted }]}>
                  {DIFFICULTY_HINTS[difficulty]}
                </Text>
              </View>
              <Text maxFontSizeMultiplier={1.3} style={[styles.best, { color: theme.textMuted }]}>
                {best === null ? '' : formatDuration(best)}
              </Text>
            </Pressable>
          );
        })}
        <Button testID="new-game-cancel" label="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1 },
  sheet: {
    gap: spacing.sm,
    padding: spacing.md,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  title: { fontSize: 20, fontWeight: '600', marginBottom: spacing.xs },
  row: {
    minHeight: MIN_TARGET + spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  rowText: { gap: 2 },
  label: { fontSize: 16, fontWeight: '600' },
  hint: { fontSize: 13 },
  best: { fontSize: 14, fontVariant: ['tabular-nums'] },
});
