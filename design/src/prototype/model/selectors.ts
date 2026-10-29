import type { CameraCounts, HostLabel, RecipientStage, TileStatus } from "./types";

const tiles: Record<RecipientStage, TileStatus> = {
  arriving: "arriving",
  stored: "onlyInApp",
  exportPending: "saving",
  saved: "saved",
  exportUncertain: "needsChecking",
  actionRequired: "needsChecking",
  expired: "expired",
  // A canceled photo never arrived either, so it looks like an expired one.
  canceled: "expired",
};

/** How one of Sarah's photos looks in her grid. */
export function tileStatus(stage: RecipientStage): TileStatus {
  return tiles[stage];
}

/** Which of Alex's counts a photo's label adds to. Expired and canceled photos aren't counted. */
export function countKey(label: HostLabel): keyof CameraCounts | null {
  switch (label) {
    case "Preparing":
      return "preparing";
    case "Waiting for internet":
      return "waitingInternet";
    case "Waiting for Wi-Fi":
      return "waitingWifi";
    case "Sending":
      return "sending";
    case "Delivered":
      return "sent";
    case "Expired":
    case "Canceled":
      return null;
    default:
      // "Ready for Sarah": it has left Alex's phone.
      return "sent";
  }
}
