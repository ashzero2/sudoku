import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { icon, MAX_FONT_SCALE, MIN_TARGET, spacing, type, weight } from '@/theme/tokens';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  backTestID?: string;
  action?: ReactNode;
}

export function ScreenHeader({
  title,
  onBack,
  backTestID = 'header-back',
  action,
}: ScreenHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          testID={backTestID}
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          style={({ pressed }) => [styles.back, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="chevron-back" size={icon.md} color={theme.text} />
        </Pressable>
      ) : null}
      <Text
        accessibilityRole="header"
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        style={[styles.title, { color: theme.text }]}
      >
        {title}
      </Text>
      <View style={styles.action}>{action}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  back: {
    width: MIN_TARGET,
    height: MIN_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  title: { fontSize: type.title, fontWeight: weight.semibold, flex: 1 },
  action: { minWidth: MIN_TARGET, alignItems: 'flex-end' },
});
