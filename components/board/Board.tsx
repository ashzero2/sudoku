import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { BOX_LINE, Cell } from '@/components/board/Cell';
import { useTheme } from '@/hooks/useTheme';
import { BOARD_SIZE, sees } from '@/lib/engine/grid';
import { hintCells } from '@/lib/game/hints';
import { useGameStore } from '@/stores/gameStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { spacing } from '@/theme/tokens';

const MAX_BOARD_WIDTH = 480;
const ROW_INDEXES = Array.from({ length: BOARD_SIZE }, (_, row) => row);
const COL_INDEXES = ROW_INDEXES;

export function Board() {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const board = useGameStore((state) => state.game?.board);
  const notes = useGameStore((state) => state.game?.notes);
  const givens = useGameStore((state) => state.game?.givens);
  const solution = useGameStore((state) => state.game?.solution);
  const selectedCell = useGameStore((state) => state.game?.selectedCell ?? null);
  const selectCell = useGameStore((state) => state.selectCell);
  const showMistakes = useSettingsStore((state) => state.settings.showMistakes);
  const hint = useGameStore((state) => state.hint);

  if (!board || !notes || !givens || !solution) return null;

  const hintedCells = hint ? hintCells(hint) : [];

  // Whole-pixel cells keep the grid lines crisp; the outer frame takes the remainder.
  const available = Math.min(width - 2 * spacing.md, MAX_BOARD_WIDTH);
  const cellSize = Math.floor((available - 2 * BOX_LINE) / BOARD_SIZE);
  const selectedValue = selectedCell === null ? 0 : board[selectedCell];

  return (
    <View testID="board" style={[styles.frame, { borderColor: theme.box, borderWidth: BOX_LINE }]}>
      {ROW_INDEXES.map((row) => (
        <View key={row} style={styles.row}>
          {COL_INDEXES.map((col) => {
            const index = row * BOARD_SIZE + col;
            const value = board[index];
            const isSelected = index === selectedCell;
            return (
              <Cell
                key={index}
                index={index}
                value={value}
                notes={notes[index]}
                isGiven={givens[index] !== 0}
                isSelected={isSelected}
                isPeer={selectedCell !== null && !isSelected && sees(selectedCell, index)}
                isSameDigit={selectedValue !== 0 && !isSelected && value === selectedValue}
                isConflict={
                  showMistakes && value !== 0 && givens[index] === 0 && value !== solution[index]
                }
                isHinted={hintedCells.includes(index)}
                size={cellSize}
                theme={theme}
                onSelect={selectCell}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { alignSelf: 'center' },
  row: { flexDirection: 'row' },
});
