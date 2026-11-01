const SECOND_MS = 1000;
const MINUTE = 60;
const HOUR = 60 * MINUTE;

function splitDuration(ms: number): { hours: number; minutes: number; seconds: number } {
  const total = Math.floor(ms / SECOND_MS);
  return {
    hours: Math.floor(total / HOUR),
    minutes: Math.floor((total % HOUR) / MINUTE),
    seconds: total % MINUTE,
  };
}

/** `m:ss`, or `h:mm:ss` from one hour. */
export function formatDuration(ms: number): string {
  const { hours, minutes, seconds } = splitDuration(ms);
  const paddedSeconds = String(seconds).padStart(2, '0');
  if (hours === 0) return `${minutes}:${paddedSeconds}`;
  return `${hours}:${String(minutes).padStart(2, '0')}:${paddedSeconds}`;
}

/** The same duration in words, for screen readers: "3 minutes 36 seconds". */
export function spokenDuration(ms: number): string {
  const { hours, minutes, seconds } = splitDuration(ms);
  const unit = (count: number, name: string) => `${count} ${name}${count === 1 ? '' : 's'}`;
  const parts = [];
  if (hours > 0) parts.push(unit(hours, 'hour'));
  if (minutes > 0) parts.push(unit(minutes, 'minute'));
  if (seconds > 0 || parts.length === 0) parts.push(unit(seconds, 'second'));
  return parts.join(' ');
}
