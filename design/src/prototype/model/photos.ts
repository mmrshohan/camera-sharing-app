import type {
  Connection,
  HostLabel,
  HostPhoto,
  Network,
  RecipientLabel,
  RecipientPhoto,
  RecipientStage,
} from "./types";

/** What Alex's phone knows about its connection when it labels a photo. */
export interface HostNetwork {
  network: Network;
  connection: Connection;
  wifiOnly: boolean;
}

/** What Alex's phone says about one photo (design spec, Appendix C). */
export function hostLabel(photo: HostPhoto, net: HostNetwork, recipientName: string): HostLabel {
  switch (photo.stage) {
    case "preparing":
      return "Preparing";
    case "prepared":
    case "reserved":
    case "uploading":
      // Until a photo has left the phone, it says what it is waiting for (R5, R9).
      if (net.network === "offline") return "Waiting for internet";
      if (net.wifiOnly && net.connection === "cellular") return "Waiting for Wi-Fi";
      return "Sending";
    case "uploaded":
      return `Ready for ${recipientName}`;
    case "delivered":
      return "Delivered";
    case "expired":
      return "Expired";
    case "canceled":
      return "Canceled";
  }
}

const recipientLabels: Record<RecipientStage, RecipientLabel> = {
  arriving: "Arriving",
  stored: "Only in this app",
  exportPending: "Saving to Photos",
  saved: "Saved to Photos",
  exportUncertain: "Photos save needs checking",
  actionRequired: "Photos save needs checking",
  expired: "Expired, never arrived",
  canceled: "Canceled before arrival",
};

/** What Sarah's phone says about one photo (design spec, Appendix C). */
export function recipientLabel(photo: RecipientPhoto): RecipientLabel {
  return recipientLabels[photo.stage];
}

/** A recoverable failure keeps its state and adds a retry marker (R5). */
export function withRetry(label: string, retry: boolean): string {
  return retry ? `${label} · Will retry` : label;
}
