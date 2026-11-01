import Constants from 'expo-constants';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionTitle } from '@/components/SectionTitle';
import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore, type Settings } from '@/stores/settingsStore';
import { MIN_TARGET, radius, spacing } from '@/theme/tokens';

const THEME_OPTIONS: { value: Settings['theme']; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

type ToggleKey = 'showMistakes' | 'autoEliminateNotes' | 'haptics';

const TOGGLES: { key: ToggleKey; testID: string; label: string; description: string }[] = [
  {
    key: 'showMistakes',
    testID: 'setting-show-mistakes',
    label: 'Show mistakes',
    description: 'Highlight entries that do not match the solution.',
  },
  {
    key: 'autoEliminateNotes',
    testID: 'setting-auto-notes',
    label: 'Remove notes automatically',
    description: 'Placing a digit clears it from notes in its row, column and box.',
  },
  {
    key: 'haptics',
    testID: 'setting-haptics',
    label: 'Haptic feedback',
    description: 'Vibrate briefly on key actions.',
  },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const settings = useSettingsStore((state) => state.settings);
  const update = useSettingsStore((state) => state.update);

  return (
    <SafeAreaView
      testID="screen-settings"
      edges={['top']}
      style={[styles.screen, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={[styles.title, { color: theme.text }]}>
          Settings
        </Text>

        <SectionTitle title="Appearance" />
        <View style={styles.segments}>
          {THEME_OPTIONS.map(({ value, label }) => {
            const selected = settings.theme === value;
            return (
              <Pressable
                key={value}
                testID={`theme-${value}`}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected }}
                onPress={() => update({ theme: value })}
                style={[
                  styles.segment,
                  {
                    backgroundColor: selected ? theme.selected : theme.surface,
                    borderColor: selected ? theme.accent : theme.line,
                    borderWidth: selected ? 2 : 1,
                  },
                ]}
              >
                <Text
                  maxFontSizeMultiplier={1.3}
                  style={[
                    styles.segmentLabel,
                    { color: theme.text, fontWeight: selected ? '700' : '500' },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SectionTitle title="Gameplay" />
        {TOGGLES.map(({ key, testID, label, description }) => (
          // The whole row toggles, so the target is larger than the switch itself; the switch
          // stays the one control a screen reader announces.
          <Pressable
            key={key}
            accessible={false}
            onPress={() => update({ [key]: !settings[key] })}
            style={[styles.toggleRow, { borderBottomColor: theme.line }]}
          >
            <View style={styles.toggleText}>
              <Text maxFontSizeMultiplier={1.3} style={[styles.toggleLabel, { color: theme.text }]}>
                {label}
              </Text>
              <Text maxFontSizeMultiplier={1.3} style={[styles.hint, { color: theme.textMuted }]}>
                {description}
              </Text>
            </View>
            <Switch
              testID={testID}
              accessibilityLabel={label}
              value={settings[key]}
              onValueChange={(value) => update({ [key]: value })}
              trackColor={{ false: theme.line, true: theme.accent }}
              thumbColor={theme.background}
            />
          </Pressable>
        ))}

        <SectionTitle title="About" />
        <Text testID="about-version" style={[styles.about, { color: theme.text }]}>
          {`Clean Sudoku ${Constants.expoConfig?.version ?? ''}`}
        </Text>
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          Puzzles come from the Sudoku Exchange puzzle bank, which is in the public domain.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.md },
  title: { fontSize: 24, fontWeight: '600' },
  segments: { flexDirection: 'row', gap: spacing.sm },
  segment: {
    flex: 1,
    minHeight: MIN_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  segmentLabel: { fontSize: 16 },
  toggleRow: {
    minHeight: MIN_TARGET + spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  toggleText: { flex: 1, gap: 2 },
  toggleLabel: { fontSize: 16 },
  hint: { fontSize: 13 },
  about: { fontSize: 16, marginBottom: spacing.xs },
});
