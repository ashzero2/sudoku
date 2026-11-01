import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/tokens';

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
      <Text maxFontSizeMultiplier={1.3} style={[styles.value, { color: theme.text }]}>
        {value}
      </Text>
      <Text maxFontSizeMultiplier={1.3} style={[styles.label, { color: theme.textMuted }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, padding: spacing.md, borderRadius: radius.md, gap: spacing.xs },
  value: { fontSize: 24, fontWeight: '600', fontVariant: ['tabular-nums'] },
  label: { fontSize: 14 },
});
