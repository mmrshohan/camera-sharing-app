// What each photo's status says, on both phones (R5, design spec Appendix C). Each holds for every
// photo it's on: a photo that has left Alex's phone isn't on Sarah's yet, and waiting for Wi-Fi is
// never sending.
import { countWords } from "./plural";

export const strings = {
  // Alex's phone, one photo
  preparing: "Preparing",
  waitingInternet: "Waiting for internet",
  waitingWifi: "Waiting for Wi-Fi",
  sending: "Sending",
  readyFor: (name: string) => `Ready for ${name}` as const,
  delivered: "Delivered",
  expired: "Expired",
  canceled: "Canceled",
  needsApproval: "Needs both approvals",
  // Sarah's phone, one photo
  arriving: "Arriving",
  onlyInApp: "Only in this app",
  saving: "Saving to Photos",
  saved: "Saved to Photos",
  needsChecking: "Photos save needs checking",
  neverArrived: "Expired, never arrived",
  canceledBeforeArrival: "Canceled before arrival",
  // After either phone's label, while it will try again
  willRetry: "Will retry",
  // Alex's counts on the camera, the Session panel and the lock
  counts: countWords,
} as const;

/** Every status is a promise about where a photo is (R5). */
export const trust = [
  "preparing",
  "waitingInternet",
  "waitingWifi",
  "sending",
  "readyFor",
  "delivered",
  "expired",
  "canceled",
  "needsApproval",
  "arriving",
  "onlyInApp",
  "saving",
  "saved",
  "needsChecking",
  "neverArrived",
  "canceledBeforeArrival",
  "willRetry",
  "counts",
] as const;
