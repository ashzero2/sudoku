import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useGameStore } from '@/stores/gameStore';
import { border, MAX_FONT_SCALE, radius, spacing, type, weight } from '@/theme/tokens';

/** Stands in for the board while the clock is stopped, so a paused puzzle cannot be studied. */
export function PauseOverlay() {
  const theme = useTheme();
  const resume = useGameStore((state) => state.resume);

  return (
    <View
      testID="pause-overlay"
      style={[styles.overlay, { backgroundColor: theme.surface, borderColor: theme.line }]}
    >
      <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={[styles.title, { color: theme.text }]}>
        Paused
      </Text>
      <Text
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        style={[styles.hint, { color: theme.textMuted }]}
      >
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
    borderWidth: border.hairline,
    borderRadius: radius.md,
  },
  title: { fontSize: type.title, fontWeight: weight.semibold },
  hint: { fontSize: type.body, textAlign: 'center' },
});
