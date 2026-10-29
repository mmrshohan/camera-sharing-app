// Why the app asks, shown under the iOS prompt's title (design spec §9). Android shows none.

export const strings = {
  camera: "Take photos for the person you’re lending to, and scan invitations.",
  photosAddOnly: "Save photos you receive to your library. The app can’t see your other photos.",
  notifications: "Know when photos arrive.",
} as const;

/** Promises about what the app can see or does (spec §11). */
export const trust = ["camera", "photosAddOnly"] as const;
