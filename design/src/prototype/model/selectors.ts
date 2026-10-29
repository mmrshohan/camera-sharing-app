import { photos as plural } from "@shared/plural";
import { hostLabel, recipientLabel, withRetry } from "./photos";
import type {
  CameraCounts,
  DeviceState,
  HostLabel,
  HostPhoto,
  PhotoId,
  RecipientPhoto,
  RecipientStage,
  TileStatus,
  World,
} from "./types";

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

// ---- What each phone shows, read from the world ----

/** How long after arriving a photo still develops on screen. */
const developWindowMs = 2000;
const day = 24 * 60 * 60_000;
/** The clock starts at 9:41 in the morning. */
const startOfDay = (9 * 60 + 41) * 60_000;
const dayOf = (t: number) => Math.floor((t + startOfDay) / day);

function dayLabel(t: number, now: number): string {
  const ago = dayOf(now) - dayOf(t);
  if (ago <= 0) return "Today";
  return ago === 1 ? "Yesterday" : `${ago} days ago`;
}

/** Photos needing recovery are shown by the Recovery panel, not counted as sending (R7). */
function needsRecovery(w: World): Set<PhotoId> {
  return new Set(w.recovery?.state === "needed" ? w.recovery.photoIds : []);
}

function currentHostPhotos(
  w: World,
): { photo: HostPhoto; label: string; key: keyof CameraCounts | null }[] {
  const s = w.session;
  if (!s) return [];
  const alex = w.devices.alex;
  const net = {
    network: alex.network,
    connection: alex.connection,
    wifiOnly: alex.settings.wifiOnly,
  };
  const recovering = needsRecovery(w);
  return alex.hostPhotos
    .filter((p) => p.sessionId === s.id)
    .map((photo) => {
      if (recovering.has(photo.id)) return { photo, label: "Needs both approvals", key: null };
      const label = hostLabel(photo, net, s.recipient.name);
      return { photo, label: withRetry(label, photo.retry), key: countKey(label) };
    });
}

/** Alex's counts for the current session: sent, sending and waiting (CameraStatusLine). */
export function hostSummary(w: World): CameraCounts {
  const counts: CameraCounts = {
    sent: 0,
    sending: 0,
    waitingInternet: 0,
    waitingWifi: 0,
    preparing: 0,
  };
  for (const { key } of currentHostPhotos(w)) if (key) counts[key] += 1;
  return counts;
}

/** The session panel's list: a number and a label per photo, never an image (R3, D7). */
export function hostItems(w: World): { index: number; label: string }[] {
  return currentHostPhotos(w).map(({ label }, i) => ({ index: i + 1, label }));
}

export interface TileView {
  id: PhotoId;
  sample: string;
  status: TileStatus;
  progress: number;
  develop: boolean;
  label: string;
}

/** Sarah's photos: a section per session, newest first. */
export function recipientTiles(
  w: World,
): { sectionId: string; title: string; detail: string; tiles: TileView[] }[] {
  const bySession = new Map<string, RecipientPhoto[]>();
  for (const p of w.devices.sarah.gallery)
    bySession.set(p.sessionId, [...(bySession.get(p.sessionId) ?? []), p]);
  return [...bySession.entries()].reverse().map(([sessionId, photos]) => {
    const first = photos[0];
    return {
      sectionId: sessionId,
      title: dayLabel(first ? first.arrivedAt || first.stageAt : w.clock, w.clock),
      detail: `${plural(photos.length)} from ${first?.fromName ?? "Alex"}`,
      tiles: [...photos].reverse().map((p) => ({
        id: p.id,
        sample: p.sample,
        status: tileStatus(p.stage),
        progress: p.progress,
        develop:
          p.stage !== "arriving" && p.arrivedAt > 0 && w.clock - p.arrivedAt < developWindowMs,
        label: withRetry(recipientLabel(p), p.retry),
      })),
    };
  });
}

/** Photos saved to Photos stay there whatever happens to the app's copies (R11). */
export function remainingInPhotos(device: DeviceState): number {
  return device.gallery.filter((p) => p.stage === "saved").length;
}
