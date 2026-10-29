import { people, samples } from "@prototype/model/fixtures";
import { nextSessionId } from "@prototype/model/session";
import type {
  DeviceId,
  DeviceModel,
  DeviceState,
  DeviceUi,
  RecipientPhoto,
  World,
  WorldEvent,
} from "@prototype/model/types";
import { reduce } from "@prototype/model/world";

const day = 24 * 60 * 60_000;

function device(id: DeviceId, model: DeviceModel, clock: number): DeviceState {
  return {
    id,
    model,
    theme: "light",
    textSize: "default",
    signedIn: true,
    username: people[id].handle.slice(1),
    network: "online",
    connection: "wifi",
    permissions: {
      camera: "notDetermined",
      photosAddOnly: "notDetermined",
      notifications: "notDetermined",
    },
    settings: { autoSave: false, wifiOnly: false, notifications: true },
    mode: "normal",
    account: {
      methods: [id === "alex" ? "apple" : "google"],
      devices: [people[id].device],
      blocked: [],
    },
    storageFull: false,
    busy: false,
    ui: {
      route: "home",
      panel: null,
      confirm: null,
      prompt: null,
      lastShot: null,
      openPhoto: null,
      pendingSave: null,
      toast: null,
      notice: null,
      inviteExpiresAt: null,
      camera: { flash: "auto", zoom: 1, facing: "back" },
      system: null,
      dropKey: 0,
      pulseKey: 0,
      field: { value: "", state: "idle", since: clock },
    },
    hostPhotos: [],
    gallery: [],
  };
}

/** Both phones signed in, on Home, with nothing happening yet. */
export function createWorld(
  opts: Partial<{ alexModel: DeviceModel; sarahModel: DeviceModel; clock: number }> = {},
): World {
  const clock = opts.clock ?? 0;
  return {
    clock,
    devices: {
      alex: device("alex", opts.alexModel ?? "iphone16pro", clock),
      sarah: device("sarah", opts.sarahModel ?? "galaxyA15", clock),
    },
    session: null,
    cloud: [],
    recovery: null,
  };
}

// ---- Steps for building scenarios ----

export const run = (w: World, ...events: WorldEvent[]): World => events.reduce(reduce, w);
export const tick = (ms: number): WorldEvent => ({ type: "tick", ms });
/** Long enough for any photo to be prepared, sent, received and saved. */
export const settle = tick(10_000);

export const patchDevice = (w: World, id: DeviceId, patch: Partial<DeviceState>): World => ({
  ...w,
  devices: { ...w.devices, [id]: { ...w.devices[id], ...patch } },
});

export const patchUi = (w: World, id: DeviceId, patch: Partial<DeviceUi>): World =>
  patchDevice(w, id, { ui: { ...w.devices[id].ui, ...patch } });

/** Sarah before she has an account on this phone. */
export const newUser = (w: World = createWorld()): World =>
  patchUi(patchDevice(w, "sarah", { signedIn: false, username: null }), "sarah", {
    route: "welcome",
  });

/** Alex scans Sarah's invitation; both phones show the words. */
export const scanned = (w: World = createWorld()): World =>
  run(
    w,
    { type: "openPanel", device: "sarah", panel: "invitation" },
    { type: "navigate", device: "alex", route: "scanner" },
    { type: "requestPermission", device: "alex", kind: "camera" },
    { type: "permission", device: "alex", kind: "camera", allow: true },
    { type: "scanInvitation" },
  );

/** Both approved: Alex lends his camera and is on the camera screen. */
export const connected = (w: World = createWorld()): World =>
  run(scanned(w), { type: "approve", by: "alex" }, { type: "approve", by: "sarah" });

/** Alex takes `count` photos, `gapMs` apart. */
export function shoot(w: World, count: number, gapMs = 600): World {
  let next = w;
  for (let i = 0; i < count; i += 1) {
    next = run(next, ...(i > 0 ? [tick(gapMs)] : []), { type: "capture" });
  }
  return next;
}

/**
 * Photos Sarah received in an earlier session, `daysAgo` days back (0 is earlier today).
 * The first `saved` of them are saved to Photos; the rest are only in the app.
 */
export function pastSession(
  w: World,
  opts: { daysAgo: number; count: number; saved: number },
): World {
  const sessionId = nextSessionId(w);
  const keys = Object.keys(samples);
  const end = w.clock - opts.daysAgo * day - 10 * 60_000;
  const photos = Array.from({ length: opts.count }, (_, i): RecipientPhoto => {
    const at = end - (opts.count - i) * 60_000;
    return {
      id: `${sessionId}-${i + 1}`,
      sessionId,
      fromName: people.alex.name,
      stage: i < opts.saved ? "saved" : "stored",
      progress: 1,
      retry: false,
      arrivedAt: at,
      stageAt: at,
      sample: keys[(i + opts.daysAgo * 3) % keys.length] ?? "coast-01",
    };
  });
  return patchDevice(w, "sarah", { gallery: [...w.devices.sarah.gallery, ...photos] });
}

/** Sarah's photos from yesterday and earlier today: some saved to Photos, some only in the app. */
export const withPhotos = (w: World = createWorld()): World =>
  pastSession(pastSession(w, { daysAgo: 1, count: 9, saved: 9 }), {
    daysAgo: 0,
    count: 6,
    saved: 2,
  });
