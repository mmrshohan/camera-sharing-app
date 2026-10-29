// Deadlines as a phone says them. The story starts on Thursday 29 October 2026 at 9:41.
const start = new Date(2026, 9, 29, 9, 41).getTime();

const format = new Intl.DateTimeFormat("en", {
  weekday: "long",
  hour: "numeric",
  minute: "2-digit",
});

/** "Sunday 9:41 AM" for a moment on the world's clock. */
export function deadline(clock: number): string {
  return format.format(new Date(start + clock)).replace(" at ", " ");
}

const dateFormat = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

/** "Thursday, October 29": the date a Lock Screen shows. */
export function dateLine(clock: number): string {
  return dateFormat.format(new Date(start + clock));
}
