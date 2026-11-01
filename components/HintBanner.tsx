import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { hintMessage } from '@/lib/game/hint-text';
import { useGameStore } from '@/stores/gameStore';
import { radius, spacing } from '@/theme/tokens';

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
      <Text maxFontSizeMultiplier={1.3} style={[styles.text, { color: theme.text }]}>
        {hintMessage(hint)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignSelf: 'stretch',
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderRadius: radius.sm,
  },
  text: { fontSize: 13, lineHeight: 18 },
});
