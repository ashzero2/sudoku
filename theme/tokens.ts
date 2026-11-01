export interface ThemeTokens {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
}

export const lightTokens: ThemeTokens = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#212121',
  textMuted: '#616161',
  border: '#BDBDBD',
  accent: '#1976D2',
};

export const darkTokens: ThemeTokens = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#E0E0E0',
  textMuted: '#9E9E9E',
  border: '#424242',
  accent: '#64B5F6',
};
