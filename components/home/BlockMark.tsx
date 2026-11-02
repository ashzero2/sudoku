import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { border, radius, spacing, type, weight } from '@/theme/tokens';

type BlockKind = 'fill' | 'outline' | 'soft';

const BLOCKS: readonly { kind: BlockKind; digit: number }[] = [
  { kind: 'fill', digit: 5 },
  { kind: 'outline', digit: 3 },
  { kind: 'soft', digit: 8 },
  { kind: 'soft', digit: 9 },
  { kind: 'fill', digit: 7 },
  { kind: 'outline', digit: 1 },
  { kind: 'outline', digit: 4 },
  { kind: 'soft', digit: 6 },
  { kind: 'fill', digit: 2 },
];

const BLOCK_SIZE = 74;

export function BlockMark() {
  const theme = useTheme();

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.grid}
    >
      {BLOCKS.map((block, index) => {
        const blockStyle =
          block.kind === 'fill'
            ? { backgroundColor: theme.accent }
            : block.kind === 'outline'
              ? { borderWidth: border.control, borderColor: theme.box }
              : { backgroundColor: theme.surface };
        const color = block.kind === 'fill' ? theme.onAccent : theme.text;

        return (
          <View key={index} style={[styles.block, blockStyle]}>
            <Text allowFontScaling={false} style={[styles.digit, { color }]}>
              {block.digit}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: BLOCK_SIZE * 3 + spacing.sm * 2,
    gap: spacing.sm,
    alignSelf: 'center',
  },
  block: {
    width: BLOCK_SIZE,
    height: BLOCK_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  digit: {
    fontSize: type.display,
    fontWeight: weight.heavy,
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },
});
