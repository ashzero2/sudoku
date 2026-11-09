import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useTheme } from '@/hooks/useTheme';
import { MAX_FONT_SCALE, spacing, type, weight } from '@/theme/tokens';

const SECTIONS = [
  {
    title: 'Information stored on your device',
    body: 'Cleandoku stores your game progress, notes, statistics, streaks and settings on your device. The app does not require an account, show ads or use analytics. It does not send your game data to the developer.',
  },
  {
    title: 'Android backups',
    body: 'If Android backup is enabled on your device, Android may include Cleandoku’s local data in your device backup. Android and your device’s backup provider manage backup and restoration. You can manage backup settings on your device.',
  },
  {
    title: 'Deleting your data',
    body: 'You can delete locally stored data through your device’s app settings or by uninstalling the app. A separate backup may remain according to your device and backup settings.',
  },
  {
    title: 'Third-party services',
    body: 'Cleandoku is distributed through Google Play. Google’s services may handle information independently when you use Google Play or Android backup, according to Google’s privacy policy.',
  },
  {
    title: 'Changes to this policy',
    body: 'If Cleandoku’s privacy practices change, this policy will be updated and the effective date revised.',
  },
  {
    title: 'Contact',
    body: 'For privacy questions, contact aswinzero2@gmail.com.',
  },
];

export default function PrivacyScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Screen testID="screen-privacy" scroll>
      <ScreenHeader
        title="Privacy policy"
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />
      <Text
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        style={[styles.body, { color: theme.textMuted }]}
      >
        Effective date: November 8, 2026
      </Text>
      {SECTIONS.map(({ title, body }) => (
        <View key={title} style={styles.section}>
          <Text
            accessibilityRole="header"
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            style={[styles.heading, { color: theme.text }]}
          >
            {title}
          </Text>
          <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={[styles.body, { color: theme.text }]}>
            {body}
          </Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.xs, marginTop: spacing.md },
  heading: { fontSize: type.body, fontWeight: weight.semibold },
  body: { fontSize: type.body },
});
