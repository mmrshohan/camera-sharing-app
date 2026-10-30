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
  endMessage: (keepGoing: number, needApproval: number, to: string) =>
    [
      "New photos stop.",
      keepGoing > 0 &&
        `${photos(keepGoing)} ${keepGoing === 1 ? "keeps" : "keep"} sending to ${to}.`,
      needApproval > 0 &&
        `${photos(needApproval)} taken without internet will need both phones to approve.`,
      keepGoing === 0 && needApproval === 0 && "Nothing is left to send from this phone.",
    ]
      .filter(Boolean)
      .join(" "),
  keepShooting: "Keep shooting",
  cancelTitle: "Cancel unsent photos?",
  cancelMessage: (count: number, to: string) =>
    `${photos(count)} won’t be sent. Photos already received stay on ${to}’s phone.`,
  cancelConfirm: "Cancel photos",
  keepSending: "Keep sending",
} as const;

/** Promises about what happens to photos when a session ends or is canceled (R6). */
export const trust = ["endMessage", "cancelMessage"] as const;
