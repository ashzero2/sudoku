import { useEffect } from 'react';
import { Appearance } from 'react-native';

import { useSettingsStore } from '@/stores/settingsStore';

/** Makes the whole app, including native chrome, follow the theme setting. */
export function useApplyThemeSetting(): void {
  const theme = useSettingsStore((state) => state.settings.theme);

  useEffect(() => {
    Appearance.setColorScheme(theme === 'system' ? 'auto' : theme);
  }, [theme]);
}
