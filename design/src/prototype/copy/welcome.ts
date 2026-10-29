// Welcome, before Sarah has an account on this phone.

export const strings = {
  title: "Camera Sharing",
  body: "Borrow a friend’s better camera. The photos come to your phone.",
  apple: "Continue with Apple",
  google: "Continue with Google",
  failedTitle: "Couldn’t sign in",
  failedBody: "Something went wrong on our side. Try again in a moment.",
  canceledTitle: "Sign-in canceled",
  canceledBody: "Continue whenever you’re ready.",
  offlineTitle: "You’re offline",
  offlineBody: "Connect to the internet to sign in.",
} as const;

/** Promises about where photos go (spec §11). */
export const trust = ["body"] as const;
