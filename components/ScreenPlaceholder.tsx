import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

interface ScreenPlaceholderProps {
  title: string;
  testID: string;
}

export function ScreenPlaceholder({ title, testID }: ScreenPlaceholderProps) {
  const theme = useTheme();

  return (
    <View testID={testID} style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600' },
});
