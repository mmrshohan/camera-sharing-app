// Settings and its pages.

export const strings = {
  title: "Settings",
  back: "Back",
  account: "Account",
  signIn: "Sign-in methods",
  devices: "Devices",
  blocked: "Blocked accounts",
  photosSection: "Photos",
  autoSave: "Save to Photos",
  autoSaveOn: "New photos are saved to Photos after they arrive.",
  autoSaveOff: "Photos stay in this app until you save them.",
  autoSaveUnavailable: "Photos access is off. Turn it on in Settings.",
  wifiOnly: "Send on Wi-Fi only",
  wifiOnlyNote: "When you lend your camera, photos wait for Wi-Fi.",
  notifications: "Notifications",
  notificationsNote: "Know when photos arrive.",
  notificationsOff: "Notifications are off. Turn them on in Settings.",
  more: "More",
  storage: "Storage",
  privacy: "Privacy",
  help: "Help",
  report: "Report a problem",
  signOut: "Sign out",
  deleteAccount: "Delete account",
  // Sign-in methods
  methods: { apple: "Apple", google: "Google", passkey: "Passkey" },
  connected: "Connected",
  lastMethod: "You can’t remove your only way to sign in.",
  // Devices
  thisPhone: "This phone",
  devicesNote: "Photos go only to the phone both people approve in each session.",
  // Blocked
  blockedEmpty: "No blocked accounts. You can block someone when you report a session.",
  unblock: "Unblock",
  // Storage
  onlyHere: "Only in this app",
  alsoSaved: "Also in Photos",
  storageNote:
    "Photos in this app stay on this phone until you delete them or the app. They aren’t backed up.",
  storageFull: "This phone is out of space",
  storageFullBody: "New photos can’t arrive until there’s room.",
  storageEmpty: "No photos in this app",
  // Privacy
  privacyPoints: [
    "Photos go only to the phone you both approved for that session.",
    "This app won’t save photos to the photo library of the phone that takes them.",
    "Photos pass through our servers end-to-end encrypted. Our copy is removed soon after a photo arrives, and it can’t be downloaded after 72 hours.",
  ],
  // Help
  helpTopics: ["Lending your camera", "Borrowing a camera", "Saving to Photos", "When photos wait"],
  contact: "Contact support",
  supportUnavailable: "Support isn’t available right now. Try again later.",
  // Report
  reason: "What’s wrong?",
  delivery: "Delivery problem",
  unwanted: "Unwanted contact",
  details: "What happened?",
  block: "Block this account",
  blockNote: "They won’t be able to send you requests.",
  send: "Send report",
  sent: "Report sent",
  sentBody: "Thank you. We’ll look into it.",
} as const;

/** Promises about privacy, storage and blocking (spec §11). */
export const trust = [
  "autoSaveOn",
  "autoSaveOff",
  "wifiOnlyNote",
  "devicesNote",
  "storageNote",
  "privacyPoints",
  "blockNote",
] as const;
