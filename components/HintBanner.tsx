import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { hintMessage } from '@/lib/game/hint-text';
import { useGameStore } from '@/stores/gameStore';
import { border, lineHeight, MAX_FONT_SCALE, radius, spacing, type } from '@/theme/tokens';

export function HintBanner() {
  const theme = useTheme();
  const hint = useGameStore((state) => state.hint);

  if (!hint) return null;

  return (
    <View
      testID="hint-banner"
      accessibilityLiveRegion="polite"
      style={[styles.banner, { backgroundColor: theme.surface, borderColor: theme.accent }]}
    >
      <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={[styles.text, { color: theme.text }]}>
        {hintMessage(hint)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignSelf: 'stretch',
    padding: spacing.sm,
    borderLeftWidth: border.control,
    borderRadius: radius.sm,
  },
  text: { fontSize: type.small, lineHeight: lineHeight.small },
});
