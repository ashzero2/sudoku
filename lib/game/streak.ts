const DAY_MS = 24 * 60 * 60 * 1000;

/** Local calendar date as `YYYY-MM-DD`. */
export function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function daysBetween(from: string, to: string): number {
  const [fromYear, fromMonth, fromDay] = from.split('-').map(Number);
  const [toYear, toMonth, toDay] = to.split('-').map(Number);
  const fromUtc = Date.UTC(fromYear, fromMonth - 1, fromDay);
  const toUtc = Date.UTC(toYear, toMonth - 1, toDay);
  return Math.round((toUtc - fromUtc) / DAY_MS);
}

export function streakAfterCompletion(
  lastCompletedDate: string | null,
  currentStreak: number,
  today: string,
): number {
  if (lastCompletedDate === null) return 1;
  const gap = daysBetween(lastCompletedDate, today);
  if (gap <= 0) return currentStreak;
  return gap === 1 ? currentStreak + 1 : 1;
}

/** The streak to show: it lapses once a whole day passes without a completion. */
export function visibleStreak(
  lastCompletedDate: string | null,
  currentStreak: number,
  today: string,
): number {
  if (lastCompletedDate === null) return 0;
  return daysBetween(lastCompletedDate, today) <= 1 ? currentStreak : 0;
}
