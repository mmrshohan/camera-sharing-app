// Signing out and deleting the account (R11).
import { photos } from "./plural";

export const strings = {
  signOutTitle: "Sign out?",
  signOutMessage: (onlyHere: number) =>
    onlyHere === 0
      ? "Photos you saved to Photos aren’t affected."
      : `${photos(onlyHere)} ${onlyHere === 1 ? "is" : "are"} only in this app. ${onlyHere === 1 ? "It stays" : "They stay"} locked on this phone until you sign in again. Photos you saved to Photos aren’t affected.`,
  signOut: "Sign out",
  cancel: "Cancel",
  deleteTitle: "Delete account?",
  deleteMessage:
    "This deletes your account and the photos kept in this app on this phone. Copies saved to Photos aren’t affected. Phones that are offline are cleaned up when they next connect.",
  deleteButton: "Delete account…",
  deleteConfirmMessage: (saved: number) =>
    saved === 0
      ? "This can’t be undone."
      : `This can’t be undone. ${photos(saved)} saved to Photos ${saved === 1 ? "stays" : "stay"} there.`,
  deleteConfirm: "Delete account",
} as const;

/** Both make promises about what is deleted and what stays (R11). */
export const trust = ["signOutMessage", "deleteMessage", "deleteConfirmMessage"] as const;
