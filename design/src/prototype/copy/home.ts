// Home: the photos you've received, and the two rings.

export const strings = {
  title: "Photos",
  settings: "Settings",
  empty: "Photos you receive will appear here.",
  emptyBody: "Borrow a friend’s camera, and every photo they take comes here.",
  borrow: "Borrow a camera",
  lend: "Lend my camera",
  sessionRunning: "A session is running",
  liveCaption: "photos",
  liveFrom: (name: string) => `From ${name}’s camera`,
  onTheWay: (count: number) => `${count} on the way`,
  waitingTitle: (name: string) => `Waiting for ${name}’s internet`,
  waitingBody: "Photos keep coming once it’s back.",
  storageTitle: "This phone is out of space",
  storageBody: "New photos can’t arrive until there’s room.",
  storageAction: "Manage storage",
  accessTitle: "Saving to Photos is off",
  accessBody: "Photos stay in this app until you turn it on.",
  accessAction: "Open Settings",
} as const;

/** Promises about delivery and saving (spec §11). */
export const trust = ["emptyBody", "waitingBody", "storageBody", "accessBody"] as const;
