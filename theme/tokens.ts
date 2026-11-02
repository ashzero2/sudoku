export interface ThemeTokens {
  background: string;
  /** Resting cell and button fill. */
  surface: string;
  /** Row, column and box of the selected cell. */
  peer: string;
  selected: string;
  /** Cells holding the selected cell's digit. */
  sameDigit: string;
  /** Text drawn on `sameDigit`. */
  onHighlight: string;
  text: string;
  textMuted: string;
  given: string;
  user: string;
  error: string;
  notes: string;
  line: string;
  box: string;
  accent: string;
  /** Text drawn on `accent`. */
  onAccent: string;
  /** Dims the screen behind a sheet or dialog. */
  scrim: string;
}

// Every text-on-fill pair a cell can show is at least 4.5:1, and the accent ring at least 3:1.
export const lightTokens: ThemeTokens = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  peer: '#E8EEF3',
  selected: '#D4E7FA',
  sameDigit: '#FFF3B0',
  onHighlight: '#212121',
  text: '#212121',
  textMuted: '#616161',
  given: '#0D5DB8',
  user: '#37474F',
  error: '#B71C1C',
  notes: '#55606A',
  line: '#C5CBD0',
  box: '#212121',
  accent: '#0D5DB8',
  onAccent: '#FFFFFF',
  scrim: '#00000066',
};

export const darkTokens: ThemeTokens = {
  background: '#121212',
  surface: '#1E1E1E',
  peer: '#262B31',
  selected: '#1F3F66',
  sameDigit: '#F2C94C',
  onHighlight: '#121212',
  text: '#E0E0E0',
  textMuted: '#9E9E9E',
  given: '#7DBBF5',
  user: '#E3E6E8',
  error: '#FF8A80',
  notes: '#AAB2B8',
  line: '#3A4046',
  box: '#8A9298',
  accent: '#7DBBF5',
  onAccent: '#121212',
  scrim: '#000000B3',
};

export const type = {
  mark: 42,
  display: 32,
  title: 24,
  heading: 20,
  body: 16,
  label: 14,
  small: 13,
  micro: 11,
  digit: 26,
} as const;

export const weight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const;

export const lineHeight = { micro: 14, small: 18, body: 22, title: 28 } as const;

export const border = { hairline: 1, control: 2 } as const;

export const icon = { sm: 18, md: 24 } as const;

export const opacity = { pressed: 0.8, disabled: 0.45 } as const;

export const spacing = { xxs: 2, xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const radius = { sm: 4, md: 8, lg: 12 } as const;

export const MIN_TARGET = 44;

export const MAX_CONTENT_WIDTH = 480;

export const MAX_FONT_SCALE = 1.3;

export const MESSAGE_SLOT_HEIGHT = 64;
