import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { MIN_TARGET, radius, spacing } from '@/theme/tokens';

interface ButtonProps {
  label: string;
  onPress: () => void;
  testID: string;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onPress, testID, variant = 'secondary' }: ButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary ? theme.accent : theme.surface,
          borderColor: isPrimary ? theme.accent : theme.line,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text
        maxFontSizeMultiplier={1.3}
        style={[styles.label, { color: isPrimary ? theme.onAccent : theme.text }]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TARGET,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 16, fontWeight: '600' },
});
