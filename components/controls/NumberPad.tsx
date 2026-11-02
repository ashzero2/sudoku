import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { BOARD_SIZE, DIGITS } from '@/lib/engine/grid';
import { useGameStore } from '@/stores/gameStore';
import { MAX_CONTENT_WIDTH, MIN_TARGET, radius, spacing, type, weight } from '@/theme/tokens';

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
  // One row when every button can stay at least MIN_TARGET wide, otherwise two.
  const columns = rowWidth >= MIN_TARGET * DIGITS.length ? DIGITS.length : NARROW_COLUMNS;
  const buttonWidth = Math.floor(rowWidth / columns);
  const counts = countPlaced(board);
  const rows =
    DIGITS.length > columns ? [DIGITS.slice(0, columns), DIGITS.slice(columns)] : [DIGITS];

  return (
    <View style={styles.pad}>
      {rows.map((digits, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {digits.map((digit) => {
            const isComplete = counts[digit] >= BOARD_SIZE;
            return (
              <Pressable
                key={digit}
                testID={`digit-${digit}`}
                accessibilityRole="button"
                accessibilityLabel={isComplete ? `${digit}, all placed` : `${digit}`}
                onPress={() => fillDigit(digit)}
                style={({ pressed }) => [
                  styles.button,
                  {
                    width: buttonWidth - spacing.xs,
                    backgroundColor: pressed ? theme.selected : theme.surface,
                  },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[styles.digit, { color: isComplete ? theme.textMuted : theme.text }]}
                >
                  {digit}
                </Text>
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
  digit: {
    fontSize: type.digit,
    fontWeight: weight.medium,
    fontVariant: ['tabular-nums'],
  },
});
