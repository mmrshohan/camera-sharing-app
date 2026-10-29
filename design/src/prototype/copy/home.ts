// Home: the photos you've received, and the two rings.

export const strings = {
  title: "Photos",
  settings: "Settings",
  empty: "Photos you receive will appear here.",
  emptyBody: "Borrow a friend’s camera, and the photos taken with it come here.",
  borrow: "Borrow a camera",
  lend: "Lend my camera",
  sessionRunning: "A session is running",
  liveCaption: "photos",
  liveFrom: (name: string) => `From ${name}’s camera`,
  onTheWay: (count: number) => `${count} on the way`,
  waitingTitle: (name: string) => `Waiting for ${name}’s internet`,
  waitingBody: "Photos send when it’s back, unless they expire first.",
  storageTitle: "This phone is out of space",
  storageBody: "New photos can’t arrive until there’s room.",
  storageAction: "Manage storage",
  accessTitle: "Saving to Photos is off",
  /** With Save to Photos on, only new arrivals save themselves; photos already here never do. */
  accessBody: (autoSave: boolean) =>
    autoSave
      ? "Photos are kept only in this app. Turn it on to save new ones to Photos."
      : "Photos are kept only in this app. Turn it on, then save the ones you want to Photos.",
  accessAction: "Open Settings",
} as const;

/** Promises about delivery and saving (spec §11). */
export const trust = ["emptyBody", "waitingBody", "storageBody", "accessBody"] as const;
