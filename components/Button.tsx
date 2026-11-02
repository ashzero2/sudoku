import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import {
  border,
  MAX_FONT_SCALE,
  MIN_TARGET,
  opacity,
  radius,
  spacing,
  type,
  weight,
} from '@/theme/tokens';

interface ButtonProps {
  label: string;
  onPress: () => void;
  testID: string;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, testID, variant = 'secondary', style }: ButtonProps) {
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
          opacity: pressed ? opacity.pressed : 1,
        },
        style,
      ]}
    >
      <Text
        maxFontSizeMultiplier={MAX_FONT_SCALE}
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
    borderWidth: border.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: type.body, fontWeight: weight.semibold },
});
