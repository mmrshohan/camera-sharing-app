// Recovery: photos taken offline that need both phones to approve sending them (R7).
import { photos } from "./plural";

export const strings = {
  title: "Finish sending offline photos?",
  body: (count: number, to: string, deadline: string) =>
    `${photos(count)} ${count === 1 ? "was" : "were"} taken without internet. Both phones need to approve sending ${count === 1 ? "it" : "them"} to ${to} before ${deadline}.`,
  approve: "Approve on this phone",
  dontSend: "Don’t send",
  waiting: "Approved here. Waiting for the other phone.",
  declined: "Not sent. Other photos are unchanged.",
  expired: "These photos expired before both phones approved.",
  close: "Close",
  /** Where the photos go, said on the phone that receives them. */
  thisPhone: "this phone",
} as const;

/** Every recovery state makes a promise about sending (R7). */
export const trust = ["body", "waiting", "declined", "expired"] as const;
