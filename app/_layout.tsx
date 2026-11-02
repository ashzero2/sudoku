import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useApplyThemeSetting } from '@/hooks/useApplyThemeSetting';
import { useAppPause } from '@/hooks/useAppPause';
import { useGameHaptics } from '@/hooks/useGameHaptics';
import { useTheme } from '@/hooks/useTheme';
import { useWarmBank } from '@/hooks/useWarmBank';

export default function RootLayout() {
  useApplyThemeSetting();
  useAppPause();
  useGameHaptics();
  useWarmBank();
  const theme = useTheme();

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
    </>
  );
}
