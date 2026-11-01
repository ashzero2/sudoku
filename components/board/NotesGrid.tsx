import { StyleSheet, Text, View } from 'react-native';

import { DIGITS, digitBit } from '@/lib/engine/grid';

interface NotesGridProps {
  mask: number;
  size: number;
  color: string;
}

const NOTES_PER_ROW = 3;

export function NotesGrid({ mask, size, color }: NotesGridProps) {
  const noteSize = Math.floor(size / NOTES_PER_ROW);
  const textStyle = { width: noteSize, height: noteSize, fontSize: Math.round(size * 0.24), color };

  return (
    <View style={[styles.grid, { width: noteSize * NOTES_PER_ROW }]} pointerEvents="none">
      {DIGITS.map((digit) => (
        <Text key={digit} allowFontScaling={false} style={[styles.note, textStyle]}>
          {(mask & digitBit(digit)) !== 0 ? digit : ''}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  note: { textAlign: 'center', textAlignVertical: 'center', includeFontPadding: false },
});
