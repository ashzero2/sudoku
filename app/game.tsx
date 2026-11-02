import { Redirect, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Board } from '@/components/board/Board';
import { CompletionModal } from '@/components/CompletionModal';
import { NumberPad } from '@/components/controls/NumberPad';
import { ToolsRow } from '@/components/controls/ToolsRow';
import { GameHeader } from '@/components/GameHeader';
import { HintBanner } from '@/components/HintBanner';
import { PauseOverlay } from '@/components/PauseOverlay';
import { Screen } from '@/components/ui/Screen';
import { usePauseOnBlur } from '@/hooks/usePauseOnBlur';
import { useTheme } from '@/hooks/useTheme';
import { useGameStore } from '@/stores/gameStore';
import { MAX_FONT_SCALE, MESSAGE_SLOT_HEIGHT, spacing, type } from '@/theme/tokens';

export default function GameScreen() {
  const theme = useTheme();
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const completion = useGameStore((state) => state.completion);
  const isPaused = useGameStore((state) => state.game?.resumedAt === null);
  const isFull = useGameStore((state) => state.game?.board.every((value) => value !== 0) ?? false);
  const hasHint = useGameStore((state) => state.hint !== null);

  usePauseOnBlur();

  if (!game && !completion) return <Redirect href="/" />;

  const goHome = () => router.dismissTo('/');

  return (
    <Screen testID="screen-game" scroll>
      <View style={styles.content}>
        <GameHeader onBack={goHome} />
        {game ? (
          isPaused ? (
            <PauseOverlay />
          ) : (
            <>
              <Board />
              <View style={styles.message}>
                {hasHint ? (
                  <HintBanner />
                ) : (
                  isFull && (
                    <Text
                      testID="board-incorrect-notice"
                      accessibilityLiveRegion="polite"
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                      style={[styles.notice, { color: theme.error }]}
                    >
                      Something isn&apos;t right. Check your entries.
                    </Text>
                  )
                )}
              </View>
              <ToolsRow />
              <NumberPad />
            </>
          )
        ) : null}
        <CompletionModal onHome={goHome} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, gap: spacing.md },
  // A fixed slot, so the controls below never jump when a message appears.
  message: { minHeight: MESSAGE_SLOT_HEIGHT, justifyContent: 'center' },
  notice: { fontSize: type.small, textAlign: 'center' },
});
