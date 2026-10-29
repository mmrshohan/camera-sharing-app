// Signing out and deleting the account (R11).
import { photos } from "./plural";

export const strings = {
  signOutTitle: "Sign out?",
  signOutMessage: (onlyHere: number) =>
    onlyHere === 0
      ? "Photos you saved to Photos aren’t affected."
      : `${photos(onlyHere)} ${onlyHere === 1 ? "is" : "are"} only in this app. ${onlyHere === 1 ? "It stays" : "They stay"} locked on this phone until you sign in again here. Signing in on another phone won’t bring ${onlyHere === 1 ? "it" : "them"} back, and deleting the app loses ${onlyHere === 1 ? "it" : "them"}. Photos you saved to Photos aren’t affected.`,
  signOut: "Sign out",
  cancel: "Cancel",
  deleteTitle: "Delete account?",
  deleteMessage:
    "Your account closes now, and its data is deleted from our servers within 24 hours (backups within 14 days). The photos kept in this app on this phone are deleted. Photos others already received, and copies saved to Photos, aren’t affected.",
  deleteButton: "Delete account…",
  deleteConfirmMessage: (saved: number) =>
    saved === 0
      ? "This can’t be undone."
      : `This can’t be undone. ${photos(saved)} saved to Photos ${saved === 1 ? "stays" : "stay"} there.`,
  deleteConfirm: "Delete account",
} as const;

/** Both make promises about what is deleted and what stays (R11). */
export const trust = ["signOutMessage", "deleteMessage", "deleteConfirmMessage"] as const;
