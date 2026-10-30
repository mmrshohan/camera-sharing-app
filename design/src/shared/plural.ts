// Count words used across components and the prototype (D16). Numbers are numerals.
import type { CameraCounts } from "./types";

const format = new Intl.NumberFormat("en");

/** "1 photo", "0 photos", "3 photos". */
export function photos(count: number): string {
  return `${format.format(count)} ${count === 1 ? "photo" : "photos"}`;
}

/** The words of Alex's counts. The prototype's copy registers them as promises (R5). */
export const countWords = {
  sent: "sent",
  sending: "sending",
  preparing: "preparing",
  waitingInternet: "waiting for internet",
  waitingWifi: "waiting for Wi-Fi",
  none: "No photos yet",
} as const;

/**
 * What Alex's camera says about the session, leaving out empty parts:
 * "4 sent · 1 sending · 2 waiting for Wi-Fi". Photos waiting for Wi-Fi are never "sending" (D10).
 */
export function cameraStatusText(counts: CameraCounts): string {
  const parts: [number, string][] = [
    [counts.sent, countWords.sent],
    [counts.sending, countWords.sending],
    [counts.preparing, countWords.preparing],
    [counts.waitingInternet, countWords.waitingInternet],
    [counts.waitingWifi, countWords.waitingWifi],
  ];
  const shown = parts.filter(([n]) => n > 0).map(([n, words]) => `${format.format(n)} ${words}`);
  return shown.length > 0 ? shown.join(" · ") : countWords.none;
}
