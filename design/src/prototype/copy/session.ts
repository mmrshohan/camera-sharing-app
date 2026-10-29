// Alex's session panel and its two confirmations.
import { photos } from "./plural";

export const strings = {
  title: (to: string) => `Sending to ${to}`,
  endsIn: (time: string) => `Ends in ${time}`,
  photo: (index: number) => `Photo ${index}`,
  photosHeader: "Photos",
  none: "No photos yet",
  endSession: "End session",
  cancelUnsent: "Cancel unsent photos",
  endTitle: "End session?",
  endMessage: (count: number, to: string) =>
    count === 0
      ? "New photos stop. Everything has been delivered."
      : `New photos stop. ${photos(count)} ${count === 1 ? "keeps" : "keep"} sending to ${to}.`,
  keepShooting: "Keep shooting",
  cancelTitle: "Cancel unsent photos?",
  cancelMessage: (count: number, to: string) =>
    `${photos(count)} won’t be sent. Photos already received stay on ${to}’s phone.`,
  cancelConfirm: "Cancel photos",
  keepSending: "Keep sending",
} as const;

/** Promises about what happens to photos when a session ends or is canceled (R6). */
export const trust = ["endMessage", "cancelMessage"] as const;
