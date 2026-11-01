import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionTitle } from '@/components/SectionTitle';
import { StatsCard } from '@/components/StatsCard';
import { useTheme } from '@/hooks/useTheme';
import { DIFFICULTIES } from '@/lib/engine/types';
import { formatDuration } from '@/lib/game/format';
import { DIFFICULTY_LABELS } from '@/lib/game/labels';
import { dateKey, visibleStreak } from '@/lib/game/streak';
import { useStatsStore } from '@/stores/statsStore';
import { spacing } from '@/theme/tokens';

const NONE = '—';

export default function StatsScreen() {
  const theme = useTheme();
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

  return (
    <SafeAreaView
      testID="screen-stats"
      edges={['top']}
      style={[styles.screen, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={[styles.title, { color: theme.text }]}>
          Stats
        </Text>
        <View style={styles.cards}>
          {rows.map((row) => (
            <View key={row[0].id} style={styles.cardRow}>
              {row.map(({ id, label, value }) => (
                <StatsCard key={id} testID={`stat-${id}`} label={label} value={value} />
              ))}
            </View>
          ))}
        </View>
        <SectionTitle title="Best times (no hints)" />
        {DIFFICULTIES.map((difficulty) => {
          const best = stats.bestTimesMs[difficulty];
          const value = best === null ? NONE : formatDuration(best);
          return (
            <View
              key={difficulty}
              testID={`best-time-${difficulty}`}
              accessible
              accessibilityLabel={`${DIFFICULTY_LABELS[difficulty]} best time: ${value}`}
              style={[styles.bestRow, { borderBottomColor: theme.line }]}
            >
              <Text style={[styles.bestLabel, { color: theme.text }]}>
                {DIFFICULTY_LABELS[difficulty]}
              </Text>
              <Text style={[styles.bestValue, { color: theme.text }]}>{value}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.md },
  title: { fontSize: 24, fontWeight: '600', marginBottom: spacing.md },
  cards: { gap: spacing.sm },
  cardRow: { flexDirection: 'row', gap: spacing.sm },
  bestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  bestLabel: { fontSize: 16 },
  bestValue: { fontSize: 16, fontVariant: ['tabular-nums'] },
});
