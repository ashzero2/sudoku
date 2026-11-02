import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme/tokens';

interface ScreenProps {
  children: ReactNode;
  testID: string;
  scroll?: boolean;
}

export function Screen({ children, testID, scroll = false }: ScreenProps) {
  const theme = useTheme();

  return (
    <SafeAreaView
      testID={testID}
      edges={['top', 'bottom']}
      style={[styles.screen, { backgroundColor: theme.background }]}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, padding: spacing.md },
});
