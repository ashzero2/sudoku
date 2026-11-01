import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme/tokens';

export function SectionTitle({ title }: { title: string }) {
  const theme = useTheme();

  return (
    <Text
      accessibilityRole="header"
      maxFontSizeMultiplier={1.3}
      style={[styles.title, { color: theme.textMuted }]}
    >
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 14, fontWeight: '600', marginTop: spacing.lg, marginBottom: spacing.sm },
});
