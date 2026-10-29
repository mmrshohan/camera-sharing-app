// The lock: Alex's phone after he lent it. Only his own unlock returns it (R4).
import { photos } from "./plural";

export const strings = {
  title: (owner: string) => `Phone returned to ${owner}`,
  sending: (count: number, to: string) => `${photos(count)} still sending to ${to}`,
  delivered: "Everything was delivered",
  body: (owner: string) => `Only ${owner} can unlock this phone.`,
  faceId: "Use Face ID",
  touchId: "Use Touch ID",
  unlock: "Unlock",
  canceled: (owner: string) => `Still locked. ${owner}’s photos and account stay private.`,
} as const;

/** Promises about privacy and delivery (spec §11). */
export const trust = ["sending", "delivered", "body", "canceled"] as const;
