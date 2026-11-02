import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { SectionTitle } from '@/components/SectionTitle';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore, type Settings } from '@/stores/settingsStore';
import { border, MAX_FONT_SCALE, MIN_TARGET, radius, spacing, type, weight } from '@/theme/tokens';

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
  const router = useRouter();
  const settings = useSettingsStore((state) => state.settings);
  const update = useSettingsStore((state) => state.update);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Screen testID="screen-settings" scroll>
      <ScreenHeader title="Settings" onBack={goBack} />

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
                  borderWidth: selected ? border.control : border.hairline,
                },
              ]}
            >
              <Text
                maxFontSizeMultiplier={MAX_FONT_SCALE}
                style={[
                  styles.segmentLabel,
                  {
                    color: theme.text,
                    fontWeight: selected ? weight.bold : weight.medium,
                  },
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
            <Text
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              style={[styles.toggleLabel, { color: theme.text }]}
            >
              {label}
            </Text>
            <Text
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              style={[styles.hint, { color: theme.textMuted }]}
            >
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
      <Text
        testID="about-version"
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        style={[styles.about, { color: theme.text }]}
      >
        {`Clean Sudoku ${Constants.expoConfig?.version ?? ''}`}
      </Text>
      <Text
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        style={[styles.hint, { color: theme.textMuted }]}
      >
        Puzzles come from the Sudoku Exchange puzzle bank, which is in the public domain.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  segments: { flexDirection: 'row', gap: spacing.sm },
  segment: {
    flex: 1,
    minHeight: MIN_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  segmentLabel: { fontSize: type.body },
  toggleRow: {
    minHeight: MIN_TARGET + spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: border.hairline,
  },
  toggleText: { flex: 1, gap: spacing.xxs },
  toggleLabel: { fontSize: type.body },
  hint: { fontSize: type.small },
  about: { fontSize: type.body, marginBottom: spacing.xs },
});
