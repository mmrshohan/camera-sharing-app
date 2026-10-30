export interface Size {
  width: number;
  height: number;
}

/** Space around and between the phones, and the header above each one, in CSS pixels. */
export const stage = { padding: 24, gap: 32, header: 44 } as const;

/** The largest scale at which the phones fit side by side; never larger than true size. */
export function fitScale(available: Size, phones: readonly Size[], gap: number): number {
  const gaps = gap * Math.max(0, phones.length - 1);
  const width = phones.reduce((sum, p) => sum + p.width, 0);
  const height = Math.max(1, ...phones.map((p) => p.height));
  const scale = Math.min(
    (available.width - gaps) / Math.max(1, width),
    available.height / height,
    1,
  );
  return Math.max(0.1, scale);
}

const minute = 60_000;
const day = 24 * 60;
/** The story starts at 9:41 in the morning. */
const start = 9 * 60 + 41;

/** "Today 9:41", "Tomorrow 0:41", "In 3 days 9:41". */
export function clockLabel(clock: number): string {
  const total = start + Math.floor(clock / minute);
  const days = Math.floor(total / day);
  const minutes = ((total % day) + day) % day;
  const time = `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;
  const when =
    days === 0
      ? "Today"
      : days === 1
        ? "Tomorrow"
        : days === -1
          ? "Yesterday"
          : days > 0
            ? `In ${days} days`
            : `${-days} days ago`;
  return `${when} ${time}`;
}
