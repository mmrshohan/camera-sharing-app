// The lock: Alex's phone after he lent it. Only his own unlock returns it (R4).
import { photos } from "./plural";

// Each line is true of every photo it covers: uploaded is not received (R5).
export const strings = {
  title: (owner: string) => `Phone returned to ${owner}`,
  /** In the camera's own words, such as "1 sending · 2 waiting for Wi-Fi". */
  onPhone: (status: string) => `Still on this phone: ${status}`,
  needApproval: (count: number) =>
    `${photos(count)} ${count === 1 ? "needs" : "need"} both phones to approve`,
  waitingFor: (count: number, to: string) => `${photos(count)} waiting for ${to}’s phone`,
  lost: (count: number, to: string) => `${photos(count)} didn’t reach ${to}`,
  reached: (count: number, to: string) =>
    count === 1 ? `The photo reached ${to}’s phone` : `All ${photos(count)} reached ${to}’s phone`,
  none: "No photos were taken",
  faceId: "Use Face ID",
  touchId: "Use Touch ID",
  unlock: "Unlock",
  canceled: "Still locked.",
} as const;

/** Promises about privacy and delivery (spec §11). */
export const trust = [
  "onPhone",
  "needApproval",
  "waitingFor",
  "lost",
  "reached",
  "canceled",
] as const;
