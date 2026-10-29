// Connect: both phones approve the same people, phone and words before anything is shared.

export const strings = {
  hostTitle: (to: string) => `Lend your camera to ${to}?`,
  hostAction: "Lend camera",
  recipientTitle: (from: string) => `Use ${from}’s camera?`,
  recipientAction: "Receive on this phone",
  notNow: "Not now",
  fromTitle: "Camera",
  toTitle: "Photos go to",
  words: (other: string) => `${other} should see the same six words`,
  hostFinePrint: (to: string) =>
    `Photos go only to ${to}’s phone. Nothing is saved to your Photos. Whoever holds this phone can see the preview.`,
  recipientFinePrint: (from: string) => `Photos from ${from}’s camera come only to this phone.`,
  waiting: (other: string, time: string) => `Waiting for ${other} · expires in ${time}`,
  title: "Connect",
  declinedTitle: "Not connected",
  declinedHost: (to: string) => `${to} chose not to connect this time.`,
  declinedRecipient: "Nothing was shared.",
  expiredTitle: "This request expired",
  expiredBody: "Start again when you’re both ready.",
  mismatch: "These phones don’t match. Start again.",
  deviceChanged: (to: string) => `${to}’s receiving phone changed. Start again.`,
  startAgain: "Start again",
  close: "Close",
} as const;

/** Promises about who receives and what is saved (spec §11). */
export const trust = [
  "hostFinePrint",
  "recipientFinePrint",
  "declinedRecipient",
  "mismatch",
  "deviceChanged",
] as const;
