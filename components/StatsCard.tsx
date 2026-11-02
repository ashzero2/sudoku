import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { MAX_FONT_SCALE, radius, spacing, type, weight } from '@/theme/tokens';

interface StatsCardProps {
  label: string;
  value: string;
  testID: string;
}

export function StatsCard({ label, value, testID }: StatsCardProps) {
  const theme = useTheme();

  return (
    <View
      testID={testID}
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={[styles.card, { backgroundColor: theme.surface }]}
    >
      <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={[styles.value, { color: theme.text }]}>
        {value}
      </Text>
      <Text
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        style={[styles.label, { color: theme.textMuted }]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, padding: spacing.md, borderRadius: radius.md, gap: spacing.xs },
  value: {
    fontSize: type.title,
    fontWeight: weight.semibold,
    fontVariant: ['tabular-nums'],
  },
  label: { fontSize: type.label },
});
