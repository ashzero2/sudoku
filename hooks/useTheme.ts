import { useColorScheme } from 'react-native';

import { darkTokens, lightTokens, type ThemeTokens } from '@/theme/tokens';

export function useTheme(): ThemeTokens {
  return useColorScheme() === 'dark' ? darkTokens : lightTokens;
}
