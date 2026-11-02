import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { MAX_FONT_SCALE, spacing, type, weight } from '@/theme/tokens';

interface SectionTitleProps {
  title: string;
  style?: StyleProp<TextStyle>;
}

export function SectionTitle({ title, style }: SectionTitleProps) {
  const theme = useTheme();

  return (
    <Text
      accessibilityRole="header"
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      style={[styles.title, { color: theme.textMuted }, style]}
    >
      {title.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: type.micro,
    fontWeight: weight.bold,
    letterSpacing: 1.2,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
});
