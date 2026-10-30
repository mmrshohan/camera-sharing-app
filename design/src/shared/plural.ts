// Count words used across components and the prototype (D16). Numbers are numerals.
import type { CameraCounts } from "./types";

const format = new Intl.NumberFormat("en");

/** "1 photo", "0 photos", "3 photos". */
export function photos(count: number): string {
  return `${format.format(count)} ${count === 1 ? "photo" : "photos"}`;
}

/**
 * What Alex's camera says about the session, leaving out empty parts:
 * "4 sent · 1 sending · 2 waiting for Wi-Fi". Photos waiting for Wi-Fi are never "sending" (D10).
 */
export function cameraStatusText(counts: CameraCounts): string {
  const parts: [number, string][] = [
    [counts.sent, "sent"],
    [counts.sending, "sending"],
    [counts.preparing, "preparing"],
    [counts.waitingInternet, "waiting for internet"],
    [counts.waitingWifi, "waiting for Wi-Fi"],
  ];
  const shown = parts.filter(([n]) => n > 0).map(([n, words]) => `${format.format(n)} ${words}`);
  return shown.length > 0 ? shown.join(" · ") : "No photos yet";
}
