const SECOND_MS = 1000;
const MINUTE = 60;
const HOUR = 60 * MINUTE;

/** `m:ss`, or `h:mm:ss` from one hour. */
export function formatDuration(ms: number): string {
  const total = Math.floor(ms / SECOND_MS);
  const hours = Math.floor(total / HOUR);
  const minutes = Math.floor((total % HOUR) / MINUTE);
  const seconds = String(total % MINUTE).padStart(2, '0');
  if (hours === 0) return `${minutes}:${seconds}`;
  return `${hours}:${String(minutes).padStart(2, '0')}:${seconds}`;
}
