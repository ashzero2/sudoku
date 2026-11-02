import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { border, MAX_FONT_SCALE, spacing, type, weight } from '@/theme/tokens';

interface ValueRowProps {
  label: string;
  value: string;
  spoken?: string;
  accessibilityLabel?: string;
  testID?: string;
}

export function ValueRow({ label, value, spoken, accessibilityLabel, testID }: ValueRowProps) {
  const theme = useTheme();

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel ?? `${label}: ${spoken ?? value}`}
      style={[styles.row, { borderBottomColor: theme.line }]}
    >
      <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={[styles.label, { color: theme.text }]}>
        {label}
      </Text>
      <Text
        testID={testID}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        style={[styles.value, { color: theme.text }]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 40,
    borderBottomWidth: border.hairline,
  },
  label: { fontSize: type.body },
  value: {
    fontSize: type.body,
    fontWeight: weight.semibold,
    fontVariant: ['tabular-nums'],
  },
});
