import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Board } from '@/components/board/Board';
import { Button } from '@/components/Button';
import { CompletionModal } from '@/components/CompletionModal';
import { NumberPad } from '@/components/controls/NumberPad';
import { ToolsRow } from '@/components/controls/ToolsRow';
import { GameHeader } from '@/components/GameHeader';
import { NewGameSheet } from '@/components/NewGameSheet';
import { PauseOverlay } from '@/components/PauseOverlay';
import { useTheme } from '@/hooks/useTheme';
import { useGameStore } from '@/stores/gameStore';
import { spacing } from '@/theme/tokens';

export default function GameScreen() {
  const theme = useTheme();
  const puzzleId = useGameStore((state) => state.game?.puzzleId ?? null);
  const isPaused = useGameStore((state) => state.game?.resumedAt === null);
  const isFull = useGameStore((state) => state.game?.board.every((value) => value !== 0) ?? false);

  // The sheet belongs to the game it was opened for: whenever the game changes, however it
  // changed, the sheet closes and stays closed until it is asked for again.
  const [sheet, setSheet] = useState({ open: puzzleId === null, forGame: puzzleId });
  if (sheet.forGame !== puzzleId) setSheet({ open: false, forGame: puzzleId });
  const sheetOpen = sheet.open && sheet.forGame === puzzleId;
  const openSheet = () => setSheet({ open: true, forGame: puzzleId });
  const closeSheet = () => setSheet({ open: false, forGame: puzzleId });

  return (
    <SafeAreaView
      testID="screen-game"
      edges={['top']}
      style={[styles.screen, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {puzzleId === null ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>No game in progress</Text>
            <Button
              testID="new-game-button"
              label="New game"
              variant="primary"
              onPress={openSheet}
            />
          </View>
        ) : (
          <>
            <GameHeader onNewGame={openSheet} />
            {isPaused ? (
              <PauseOverlay />
            ) : (
              <>
                <Board />
                {isFull && (
                  <Text
                    testID="board-incorrect-notice"
                    accessibilityLiveRegion="polite"
                    style={[styles.notice, { color: theme.error }]}
                  >
                    Something isn&apos;t right. Check your entries.
                  </Text>
                )}
                <ToolsRow />
                <NumberPad />
              </>
            )}
          </>
        )}
      </ScrollView>
      <NewGameSheet visible={sheetOpen} onClose={closeSheet} />
      <CompletionModal onNewGame={openSheet} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, gap: spacing.md, padding: spacing.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { fontSize: 16 },
  notice: { fontSize: 14, textAlign: 'center' },
});
