import { strings as status } from "@prototype/copy/status";
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
      return status.preparing;
    case "prepared":
    case "reserved":
    case "uploading":
      // Until a photo has left the phone, it says what it is waiting for (R5, R9).
      if (net.network === "offline") return status.waitingInternet;
      if (net.wifiOnly && net.connection === "cellular") return status.waitingWifi;
      return status.sending;
    case "uploaded":
      return status.readyFor(recipientName);
    case "delivered":
      return status.delivered;
    case "expired":
      return status.expired;
    case "canceled":
      return status.canceled;
  }
}

const recipientLabels: Record<RecipientStage, RecipientLabel> = {
  arriving: status.arriving,
  stored: status.onlyInApp,
  exportPending: status.saving,
  saved: status.saved,
  exportUncertain: status.needsChecking,
  actionRequired: status.needsChecking,
  expired: status.neverArrived,
  canceled: status.canceledBeforeArrival,
};

/** What Sarah's phone says about one photo (design spec, Appendix C). */
export function recipientLabel(photo: RecipientPhoto): RecipientLabel {
  return recipientLabels[photo.stage];
}

/** A recoverable failure keeps its state and adds a retry marker (R5). */
export function withRetry(label: string, retry: boolean): string {
  return retry ? `${label} · ${status.willRetry}` : label;
}
