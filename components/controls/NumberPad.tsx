import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { BOARD_SIZE, DIGITS } from '@/lib/engine/grid';
import { useGameStore } from '@/stores/gameStore';
import {
  MAX_CONTENT_WIDTH,
  MAX_FONT_SCALE,
  MIN_TARGET,
  radius,
  spacing,
  type,
  weight,
} from '@/theme/tokens';

const NARROW_COLUMNS = 5;
const BUTTON_HEIGHT = 52;

function countPlaced(board: readonly number[] | undefined): number[] {
  const counts = new Array<number>(BOARD_SIZE + 1).fill(0);
  board?.forEach((value) => counts[value]++);
  return counts;
}

export function NumberPad() {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const board = useGameStore((state) => state.game?.board);
  const fillDigit = useGameStore((state) => state.fillDigit);

  const rowWidth = Math.min(width - 2 * spacing.md, MAX_CONTENT_WIDTH);
  const counts = countPlaced(board);
  const visibleDigits = DIGITS.filter((digit) => counts[digit] < BOARD_SIZE);
  // One row when every visible button can stay at least MIN_TARGET wide, otherwise two.
  const columns =
    visibleDigits.length === 0
      ? 0
      : rowWidth >= MIN_TARGET * visibleDigits.length
        ? visibleDigits.length
        : NARROW_COLUMNS;
  const buttonWidth = columns === 0 ? 0 : Math.floor(rowWidth / columns);
  const rows =
    visibleDigits.length > columns
      ? [visibleDigits.slice(0, columns), visibleDigits.slice(columns)]
      : [visibleDigits];

  return (
    <View style={styles.pad}>
      {rows.map((digits, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {digits.map((digit) => {
            const remaining = BOARD_SIZE - counts[digit];
            return (
              <Pressable
                key={digit}
                testID={`digit-${digit}`}
                accessibilityRole="button"
                accessibilityLabel={`${digit}, ${remaining} remaining`}
                onPress={() => fillDigit(digit)}
                style={({ pressed }) => [
                  styles.button,
                  {
                    width: buttonWidth - spacing.xs,
                    backgroundColor: pressed ? theme.selected : theme.surface,
                  },
                ]}
              >
                <View style={styles.label}>
                  <Text allowFontScaling={false} style={[styles.digit, { color: theme.text }]}>
                    {digit}
                  </Text>
                  <Text
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                    style={[styles.remaining, { color: theme.textMuted }]}
                  >
                    {remaining}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { alignSelf: 'center', gap: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { alignItems: 'center', gap: spacing.xxs },
  digit: {
    fontSize: type.digit,
    fontWeight: weight.medium,
    fontVariant: ['tabular-nums'],
  },
  remaining: { fontSize: type.micro, fontWeight: weight.medium, fontVariant: ['tabular-nums'] },
});
