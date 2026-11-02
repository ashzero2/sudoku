import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { BlockMark } from '@/components/home/BlockMark';
import { ContinueCard } from '@/components/home/ContinueCard';
import { NewGameSheet } from '@/components/NewGameSheet';
import { Screen } from '@/components/ui/Screen';
import { useTheme } from '@/hooks/useTheme';
import type { Difficulty } from '@/lib/engine/types';
import { dateKey, visibleStreak } from '@/lib/game/streak';
import { useGameStore } from '@/stores/gameStore';
import { useStatsStore } from '@/stores/statsStore';
import { MAX_FONT_SCALE, spacing, type, weight } from '@/theme/tokens';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const resume = useGameStore((state) => state.resume);
  const startGame = useGameStore((state) => state.startGame);
  const stats = useStatsStore((state) => state.stats);
  const [sheetOpen, setSheetOpen] = useState(false);

  const streak = visibleStreak(stats.lastCompletedDate, stats.currentStreak, dateKey(new Date()));
  // Home only ever sees a paused game: restored games come back paused and leaving the board
  // pauses it, so the banked time is the elapsed time.
  const elapsed = game?.accumulatedMs ?? 0;
  const filled = game ? game.board.filter((value) => value !== 0).length : 0;

  function continueGame(): void {
    resume();
    router.push('/game');
  }

  function selectLevel(difficulty: Difficulty): void {
    setSheetOpen(false);
    startGame(difficulty);
    router.push('/game');
  }

  return (
    <>
      <Screen testID="screen-home" scroll>
        <View style={styles.page}>
          <View style={styles.top}>
            <Text
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              style={[styles.brand, { color: theme.text }]}
            >
              CLEAN SUDOKU
            </Text>
            <Text
              testID="home-streak"
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              style={[styles.micro, { color: theme.textMuted }]}
            >
              {`STREAK ${streak}`}
            </Text>
          </View>

          <View style={styles.hero}>
            <BlockMark />
            <Text
              accessibilityRole="header"
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              style={[styles.mark, { color: theme.text }]}
            >
              SUDOKU
            </Text>
          </View>

          {game ? (
            <ContinueCard
              difficulty={game.difficulty}
              elapsedMs={elapsed}
              filled={filled}
              onPress={continueGame}
            />
          ) : (
            <Text
              testID="home-empty"
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              style={[styles.empty, { color: theme.textMuted }]}
            >
              Pick a level to begin.
            </Text>
          )}

          <View style={styles.actions}>
            <Button
              testID="new-game-button"
              label="New game"
              variant="primary"
              onPress={() => setSheetOpen(true)}
              style={styles.actionButton}
            />
            <Button
              testID="home-stats"
              label="Stats"
              onPress={() => router.push('/stats')}
              style={styles.actionButton}
            />
            <Button
              testID="home-settings"
              label="Settings"
              onPress={() => router.push('/settings')}
              style={styles.actionButton}
            />
          </View>
        </View>
      </Screen>
      <NewGameSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={selectLevel}
      />
    </>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, gap: spacing.lg },
  top: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  brand: { fontSize: type.micro, fontWeight: weight.bold, letterSpacing: 1.6 },
  micro: {
    fontSize: type.micro,
    fontWeight: weight.medium,
    letterSpacing: 0.6,
    fontVariant: ['tabular-nums'],
  },
  hero: { alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  mark: {
    fontSize: type.mark,
    fontWeight: weight.heavy,
    letterSpacing: 1,
    lineHeight: type.mark,
  },
  empty: { fontSize: type.small, textAlign: 'center' },
  actions: { gap: spacing.sm },
  actionButton: { alignSelf: 'stretch' },
});
