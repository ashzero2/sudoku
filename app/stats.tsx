import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { SectionTitle } from '@/components/SectionTitle';
import { StatsCard } from '@/components/StatsCard';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ValueRow } from '@/components/ui/ValueRow';
import { DIFFICULTIES } from '@/lib/engine/types';
import { formatDuration } from '@/lib/game/format';
import { DIFFICULTY_LABELS } from '@/lib/game/labels';
import { dateKey, visibleStreak } from '@/lib/game/streak';
import { useStatsStore } from '@/stores/statsStore';
import { spacing } from '@/theme/tokens';

const NONE = '—';

export default function StatsScreen() {
  const router = useRouter();
  const stats = useStatsStore((state) => state.stats);

  const { gamesStarted, gamesCompleted } = stats;
  const streak = visibleStreak(stats.lastCompletedDate, stats.currentStreak, dateKey(new Date()));
  const cards = [
    { id: 'started', label: 'Started', value: String(gamesStarted) },
    { id: 'completed', label: 'Solved', value: String(gamesCompleted) },
    {
      id: 'completion-rate',
      label: 'Completion rate',
      value: gamesStarted > 0 ? `${Math.round((100 * gamesCompleted) / gamesStarted)}%` : NONE,
    },
    {
      id: 'average-time',
      label: 'Average time',
      value: gamesCompleted > 0 ? formatDuration(stats.totalTimeMs / gamesCompleted) : NONE,
    },
    { id: 'streak', label: 'Current streak', value: String(streak) },
    { id: 'longest-streak', label: 'Longest streak', value: String(stats.longestStreak) },
    { id: 'mistakes', label: 'Mistakes', value: String(stats.totalMistakes) },
    { id: 'hints', label: 'Hints', value: String(stats.totalHints) },
  ];
  const rows = Array.from({ length: cards.length / 2 }, (_, row) =>
    cards.slice(row * 2, row * 2 + 2),
  );

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Screen testID="screen-stats" scroll>
      <ScreenHeader title="Stats" onBack={goBack} />
      <View style={styles.body}>
        <View style={styles.cards}>
          {rows.map((row) => (
            <View key={row[0].id} style={styles.cardRow}>
              {row.map(({ id, label, value }) => (
                <StatsCard key={id} testID={`stat-${id}`} label={label} value={value} />
              ))}
            </View>
          ))}
        </View>
        <View>
          <SectionTitle title="Best times (no hints)" style={styles.section} />
          {DIFFICULTIES.map((difficulty) => {
            const best = stats.bestTimesMs[difficulty];
            const value = best === null ? NONE : formatDuration(best);
            return (
              <ValueRow
                key={difficulty}
                testID={`best-time-${difficulty}`}
                label={DIFFICULTY_LABELS[difficulty]}
                value={value}
                accessibilityLabel={`${DIFFICULTY_LABELS[difficulty]} best time: ${value}`}
              />
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: spacing.lg, gap: spacing.md },
  cards: { gap: spacing.sm },
  cardRow: { flexDirection: 'row', gap: spacing.sm },
  section: { marginTop: 0 },
});
