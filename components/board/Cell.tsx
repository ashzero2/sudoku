import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { NotesGrid } from '@/components/board/NotesGrid';
import { useCellMotion } from '@/components/board/useCellMotion';
import { BOARD_SIZE, BOX_SIZE, DIGITS, colOf, digitBit, rowOf } from '@/lib/engine/grid';
import type { ThemeTokens } from '@/theme/tokens';

export const CELL_LINE = 1;
export const BOX_LINE = 2;
const SELECTED_RING = 2;
const SAME_DIGIT_RING = 1;
const HINT_RING = 2;
const HINT_INSET = 3;

interface CellProps {
  index: number;
  value: number;
  notes: number;
  isGiven: boolean;
  isSelected: boolean;
  isPeer: boolean;
  isSameDigit: boolean;
  isConflict: boolean;
  isHinted: boolean;
  size: number;
  theme: ThemeTokens;
  onSelect: (cell: number) => void;
}

function lineAfter(position: number): { width: number; isBox: boolean } {
  if (position === BOARD_SIZE - 1) return { width: 0, isBox: false };
  const isBox = position % BOX_SIZE === BOX_SIZE - 1;
  return { width: isBox ? BOX_LINE : CELL_LINE, isBox };
}

function describe({ index, value, notes, isGiven, isConflict, isHinted }: CellProps): string {
  const position = `Row ${rowOf(index) + 1}, column ${colOf(index) + 1}`;
  const hint = isHinted ? ', hinted' : '';
  if (value !== 0) {
    return `${position}, ${isGiven ? 'given' : isConflict ? 'incorrect' : 'entered'} ${value}${hint}`;
  }
  const noted = DIGITS.filter((digit) => (notes & digitBit(digit)) !== 0);
  const content = noted.length === 0 ? 'empty' : `notes ${noted.join(', ')}`;
  return `${position}, ${content}${hint}`;
}

function CellView(props: CellProps) {
  const { index, value, notes, isGiven, isSelected, isPeer, isSameDigit, isConflict } = props;
  const { isHinted, size, theme, onSelect } = props;
  const motionStyle = useCellMotion({ isSelected, isGiven, value, isConflict });

  const right = lineAfter(colOf(index));
  const bottom = lineAfter(rowOf(index));
  const fill = isSelected
    ? theme.selected
    : isSameDigit
      ? theme.sameDigit
      : isPeer
        ? theme.peer
        : theme.surface;
  const digitColor = isSameDigit
    ? theme.onHighlight
    : isConflict
      ? theme.error
      : isGiven
        ? theme.given
        : theme.user;
  const ring = isSelected
    ? { width: SELECTED_RING, color: theme.accent }
    : isSameDigit
      ? { width: SAME_DIGIT_RING, color: theme.onHighlight }
      : null;

  return (
    <Pressable
      testID={`cell-${index}`}
      accessibilityRole="button"
      accessibilityLabel={describe(props)}
      accessibilityState={{ selected: isSelected }}
      onPress={() => onSelect(index)}
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: fill,
          borderRightWidth: right.width,
          borderRightColor: right.isBox ? theme.box : theme.line,
          borderBottomWidth: bottom.width,
          borderBottomColor: bottom.isBox ? theme.box : theme.line,
        },
      ]}
    >
      <Animated.View pointerEvents="none" style={[styles.content, motionStyle]}>
        {ring && (
          <View
            style={[StyleSheet.absoluteFill, { borderWidth: ring.width, borderColor: ring.color }]}
          />
        )}
        {isHinted && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                margin: HINT_INSET,
                borderWidth: HINT_RING,
                borderStyle: 'dashed',
                borderColor: theme.accent,
              },
            ]}
          />
        )}
        {value !== 0 ? (
          <Text
            allowFontScaling={false}
            style={[
              styles.digit,
              {
                color: digitColor,
                fontSize: Math.round(size * 0.58),
                fontWeight: isGiven ? '700' : '500',
                textDecorationLine: isConflict ? 'underline' : 'none',
              },
            ]}
          >
            {value}
          </Text>
        ) : notes !== 0 ? (
          <NotesGrid mask={notes} size={size} color={theme.notes} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

export const Cell = memo(CellView);

const styles = StyleSheet.create({
  cell: { alignItems: 'center', justifyContent: 'center' },
  content: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: { includeFontPadding: false, fontVariant: ['tabular-nums'] },
});
