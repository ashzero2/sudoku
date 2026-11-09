import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { DIFFICULTIES, type Difficulty } from '@/lib/engine/types';
import { formatDuration, spokenDuration } from '@/lib/game/format';
import { DIFFICULTY_HINTS, DIFFICULTY_LABELS } from '@/lib/game/labels';
import { useGameStore } from '@/stores/gameStore';
import { useStatsStore } from '@/stores/statsStore';
import { MAX_FONT_SCALE, MIN_TARGET, radius, spacing, type, weight } from '@/theme/tokens';

interface NewGameSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (difficulty: Difficulty) => void;
}

export function NewGameSheet({ visible, onClose, onSelect }: NewGameSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const hasProgress = useGameStore(
    (state) => (state.game?.history.length ?? 0) > 0 || (state.game?.redo.length ?? 0) > 0,
  );
  const bestTimes = useStatsStore((state) => state.stats.bestTimesMs);

  function choose(difficulty: Difficulty): void {
    if (!hasProgress) {
      onSelect(difficulty);
      return;
    }

    Alert.alert('Start a new game?', 'Your current game will be abandoned.', [
      { text: 'Keep playing', style: 'cancel', onPress: onClose },
      { text: 'Start new game', onPress: () => onSelect(difficulty) },
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
        <View style={[styles.grabber, { backgroundColor: theme.line }]} />
        <Text
          accessibilityRole="header"
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          style={[styles.title, { color: theme.text }]}
        >
          New game
        </Text>

        {DIFFICULTIES.map((difficulty) => {
          const best = bestTimes[difficulty];
          const bestLabel =
            best === null ? 'No best time yet' : `Best time ${spokenDuration(best)}`;

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
                <Text
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                  style={[styles.label, { color: theme.text }]}
                >
                  {DIFFICULTY_LABELS[difficulty]}
                </Text>
                <Text
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                  style={[styles.hint, { color: theme.textMuted }]}
                >
                  {DIFFICULTY_HINTS[difficulty]}
                </Text>
              </View>
              <Text
                maxFontSizeMultiplier={MAX_FONT_SCALE}
                style={[styles.best, { color: theme.textMuted }]}
              >
                {best === null ? '' : formatDuration(best)}
              </Text>
            </Pressable>
          );
        })}

        <Button testID="new-game-cancel" label="Cancel" onPress={onClose} style={styles.cancel} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1 },
  sheet: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
  },
  title: { fontSize: type.heading, fontWeight: weight.semibold, marginBottom: spacing.xs },
  row: {
    minHeight: MIN_TARGET + spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  rowText: { flex: 1, gap: spacing.xxs },
  label: { fontSize: type.body, fontWeight: weight.semibold },
  hint: { fontSize: type.small },
  best: {
    fontSize: type.label,
    fontVariant: ['tabular-nums'],
  },
  cancel: { marginTop: spacing.xs },
});
