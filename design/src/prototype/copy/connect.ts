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
    `Photos go only to ${to}’s phone. This app won’t save them to your photo library. Whoever holds this phone can see the preview and take screenshots.`,
  recipientFinePrint: (from: string) => `Photos from ${from}’s camera come only to this phone.`,
  waiting: (other: string, time: string) => `Waiting for ${other} · expires in ${time}`,
  title: "Connect",
  declinedTitle: "Not connected",
  declinedHost: (to: string) => `${to} chose not to connect this time.`,
  declinedRecipient: "Nothing was shared.",
  expiredTitle: "This request expired",
  expiredBody: "Start again when you’re both ready.",
  mismatchTitle: "Words didn’t match",
  mismatch: "Nothing was shared. Both phones get new words when you start again.",
  deviceChanged: (to: string) => `${to}’s receiving phone changed. Start again.`,
  startAgain: "Start again",
  close: "Close",
} as const;

/** Promises about who receives and what is saved (spec §11). */
export const trust = [
  "words",
  "hostFinePrint",
  "recipientFinePrint",
  "declinedRecipient",
  "mismatch",
  "deviceChanged",
] as const;
