import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useGameStore } from '@/stores/gameStore';
import { radius, spacing } from '@/theme/tokens';

/** Stands in for the board while the clock is stopped, so a paused puzzle cannot be studied. */
export function PauseOverlay() {
  const theme = useTheme();
  const resume = useGameStore((state) => state.resume);

  return (
    <View
      testID="pause-overlay"
      style={[styles.overlay, { backgroundColor: theme.surface, borderColor: theme.line }]}
    >
      <Text maxFontSizeMultiplier={1.3} style={[styles.title, { color: theme.text }]}>
        Paused
      </Text>
      <Text maxFontSizeMultiplier={1.3} style={[styles.hint, { color: theme.textMuted }]}>
        The board is hidden while the clock is stopped.
      </Text>
      <Button testID="resume-button" label="Resume" variant="primary" onPress={resume} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  title: { fontSize: 24, fontWeight: '600' },
  hint: { fontSize: 16, textAlign: 'center' },
});
