import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useApplyThemeSetting } from '@/hooks/useApplyThemeSetting';

export default function RootLayout() {
  useApplyThemeSetting();

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
