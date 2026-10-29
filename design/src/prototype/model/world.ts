import { devices as specs } from "@components/DeviceFrame/devices";
import { people, samples } from "./fixtures";
import {
  canStartNew,
  createSession,
  endsAt,
  isPending,
  restart,
  roleOf,
  usernameProblem,
} from "./session";
import { limits, timing } from "./timing";
import type {
  CloudObject,
  DeviceId,
  DeviceState,
  DeviceUi,
  HostPhoto,
  HostStage,
  PhotoId,
  PromptKind,
  RecipientPhoto,
  Route,
  Session,
  World,
  WorldEvent,
} from "./types";

export { limits, timing } from "./timing";

/** What a phone says when it refuses something. Screens show these as toasts. */
export const toasts = {
  busy: "Camera busy. That tap didn't take a photo.",
  sessionEnded: "This session has ended. That tap didn't take a photo.",
  storageFull: "Storage is full. Free up space to take more photos.",
  queueFull: `${limits.queue} photos are waiting to send. Take more once some have sent.`,
} as const;

// ---- Small helpers ----

const withDevice = (w: World, id: DeviceId, change: (d: DeviceState) => DeviceState): World => ({
  ...w,
  devices: { ...w.devices, [id]: change(w.devices[id]) },
});

const withUi = (w: World, id: DeviceId, patch: Partial<DeviceUi>): World =>
  withDevice(w, id, (d) => ({ ...d, ui: { ...d.ui, ...patch } }));

const withHostPhotos = (w: World, change: (p: HostPhoto) => HostPhoto): World =>
  withDevice(w, "alex", (d) => ({ ...d, hostPhotos: d.hostPhotos.map(change) }));

const withGallery = (w: World, change: (p: RecipientPhoto) => RecipientPhoto): World =>
  withDevice(w, "sarah", (d) => ({ ...d, gallery: d.gallery.map(change) }));

const online = (d: DeviceState) => d.network !== "offline";
/** Wi-Fi only holds photos back on cellular (R9). */
const canUpload = (d: DeviceState) =>
  online(d) && !(d.settings.wifiOnly && d.connection === "cellular");
const pace = (d: DeviceState) => (d.network === "slow" ? limits.slowFactor : 1);
const platformOf = (d: DeviceState) => specs[d.model].platform;
/** Android saves to MediaStore without a permission; iPhone needs add-only access (R8). */
const canSave = (d: DeviceState) =>
  platformOf(d) === "android" || d.permissions.photosAddOnly === "granted";

/** Photos that have not left Alex's phone, or have not reached Sarah's. */
const undelivered: readonly HostStage[] = [
  "preparing",
  "prepared",
  "reserved",
  "uploading",
  "uploaded",
];
const unsent: readonly HostStage[] = ["preparing", "prepared", "reserved", "uploading"];

/** While borrowing, Alex's phone shows only the camera or the lock (R4). */
const borrowingRoutes: readonly Route[] = ["camera", "lock"];

const isActive = (s: Session | null): s is Session => s?.state === "active";

/** A photo may be reserved while its session is active, or once both phones approve its recovery. */
const authorized = (w: World, p: HostPhoto) =>
  p.reserved || (isActive(w.session) && w.session.id === p.sessionId);

// ---- Sessions ----

function activate(w: World, s: Session): World {
  const session: Session = {
    ...s,
    state: "active",
    startedAt: w.clock,
    endsAt: endsAt({ ...s, startedAt: w.clock }, w.clock),
    endedAt: null,
    expiresAt: null,
  };
  const next = withDevice({ ...w, session }, "alex", (d) => ({
    ...d,
    mode: "borrowing",
    ui: { ...d.ui, route: "camera", panel: null, confirm: null, lastShot: null, openPhoto: null },
  }));
  return withUi(next, "sarah", { route: "home", panel: null, confirm: null });
}

/**
 * Ends the active session at `at`: no more captures. Photos already reserved keep going (R6).
 * Unsent photos without a reservation need both phones to approve their recovery (R7).
 */
function finish(w: World, at: number, lock: boolean): World {
  const s = w.session;
  if (!isActive(s)) return w;
  const alex = w.devices.alex;
  // Photos still being prepared were taken in the session; with a connection they go on.
  const hostPhotos = alex.hostPhotos.map((p) =>
    p.sessionId === s.id && p.stage === "preparing" && canUpload(alex)
      ? { ...p, reserved: true }
      : p,
  );
  const stuck = hostPhotos.filter(
    (p) =>
      p.sessionId === s.id && !p.reserved && (p.stage === "preparing" || p.stage === "prepared"),
  );
  const recovery =
    stuck.length > 0
      ? {
          sessionId: s.id,
          photoIds: stuck.map((p) => p.id),
          approvals: { host: false, recipient: false },
          state: "needed" as const,
          expiresAt: Math.min(...stuck.map((p) => p.expiresAt)),
        }
      : w.recovery;
  // Photos needing recovery ask both phones at once (R7).
  const panel = stuck.length > 0 ? ("recovery" as const) : null;
  const ended: World = {
    ...w,
    session: { ...s, state: "ended", endedAt: at },
    recovery,
    devices: {
      ...w.devices,
      alex: {
        ...alex,
        hostPhotos,
        // The last shot lives in memory only and goes when the session does (R3).
        ui: {
          ...alex.ui,
          route: lock ? "lock" : alex.ui.route,
          panel,
          confirm: null,
          lastShot: null,
          openPhoto: null,
        },
      },
    },
  };
  return panel ? withUi(ended, "sarah", { panel, confirm: null }) : ended;
}

function startRequest(w: World, state: "requested" | "verifying"): World {
  const session = createSession(w, state);
  const next = withUi({ ...w, session }, "alex", { panel: "connect", confirm: null });
  return withUi(next, "sarah", { panel: "connect", confirm: null });
}

function approve(w: World, by: DeviceId): World {
  const s = w.session;
  if (!isPending(s)) return w;
  // Approvals count only for the attempt they were given in (R2).
  const current =
    s.approvals.attempt === s.attempt
      ? s.approvals
      : { host: false, recipient: false, attempt: s.attempt };
  const approvals = { ...current, [roleOf(by)]: true };
  const next = { ...s, approvals };
  return approvals.host && approvals.recipient ? activate(w, next) : { ...w, session: next };
}

// ---- Photos ----

function capture(w: World): World {
  const alex = w.devices.alex;
  const s = w.session;
  const refuse = (toast: string) => withUi(w, "alex", { toast });
  // Each refusal is immediate and distinct, and never counts as a photo (R10).
  if (!isActive(s) || alex.mode !== "borrowing") return refuse(toasts.sessionEnded);
  if (alex.busy) return refuse(toasts.busy);
  if (alex.storageFull) return refuse(toasts.storageFull);
  if (alex.hostPhotos.filter((p) => unsent.includes(p.stage)).length >= limits.queue) {
    return refuse(toasts.queueFull);
  }
  const n = alex.hostPhotos.filter((p) => p.sessionId === s.id).length + 1;
  const keys = Object.keys(samples);
  const photo: HostPhoto = {
    id: `${s.id}-${n}`,
    sessionId: s.id,
    stage: "preparing",
    reserved: false,
    retry: false,
    capturedAt: w.clock,
    stageAt: w.clock,
    reservedAt: null,
    expiresAt: w.clock + limits.photoMs,
    sample: keys[(n - 1) % keys.length] ?? "coast-01",
  };
  return {
    ...withDevice(w, "alex", (d) => ({
      ...d,
      hostPhotos: [...d.hostPhotos, photo],
      ui: { ...d.ui, lastShot: photo.id, dropKey: d.ui.dropKey + 1, toast: null },
    })),
    session: { ...s, endsAt: endsAt(s, w.clock) },
  };
}

function cancelUnsent(w: World): World {
  const s = w.session;
  if (!s) return w;
  // Only what hasn't reached Sarah: photos she has received can't be recalled (R6).
  const ids = new Set(
    w.devices.alex.hostPhotos
      .filter((p) => p.sessionId === s.id && undelivered.includes(p.stage))
      .map((p) => p.id),
  );
  let next = withHostPhotos(w, (p) =>
    ids.has(p.id) ? { ...p, stage: "canceled", retry: false } : p,
  );
  next = withUi(next, "alex", { confirm: null });
  next = withGallery(next, (p) =>
    ids.has(p.id) && p.stage === "arriving" ? { ...p, stage: "canceled", stageAt: w.clock } : p,
  );
  const cloud = next.cloud.map((o): CloudObject =>
    ids.has(o.photoId) && (o.stage === "verified" || o.stage === "downloading")
      ? { ...o, stage: "canceled" }
      : o,
  );
  const left = w.recovery?.photoIds.filter((id) => !ids.has(id)) ?? [];
  const recovery = w.recovery && left.length > 0 ? { ...w.recovery, photoIds: left } : null;
  return { ...next, cloud, recovery: w.recovery?.state === "needed" ? recovery : w.recovery };
}

function startSave(w: World, id: PhotoId): World {
  return withGallery(w, (p) =>
    p.id === id ? { ...p, stage: "exportPending", stageAt: w.clock } : p,
  );
}

function savePhoto(w: World, id: PhotoId): World {
  const sarah = w.devices.sarah;
  const photo = sarah.gallery.find((p) => p.id === id);
  if (!photo || !["stored", "exportUncertain", "actionRequired"].includes(photo.stage)) return w;
  if (platformOf(sarah) === "ios") {
    const access = sarah.permissions.photosAddOnly;
    // Denied: the screen explains how to turn access on; the app never asks again (R8).
    if (access === "denied") return w;
    if (access === "notDetermined")
      return withUi(w, "sarah", { prompt: "photosAddOnly", pendingSave: id });
  }
  return startSave(w, id);
}

function deleteFromApp(w: World, id: PhotoId): World {
  return withDevice(w, "sarah", (d) => {
    const viewing = d.ui.openPhoto === id;
    return {
      ...d,
      gallery: d.gallery.filter((p) => p.id !== id),
      ui: {
        ...d.ui,
        confirm: null,
        openPhoto: viewing ? null : d.ui.openPhoto,
        route: viewing && d.ui.route === "photo" ? "home" : d.ui.route,
      },
    };
  });
}

function approveRecovery(w: World, by: DeviceId): World {
  const r = w.recovery;
  if (r?.state !== "needed") return w;
  const approvals = { ...r.approvals, [roleOf(by)]: true };
  if (!(approvals.host && approvals.recipient)) return { ...w, recovery: { ...r, approvals } };
  // Both approved: the photos go to the original recipient, against their original deadline.
  const ids = new Set(r.photoIds);
  const ready = canUpload(w.devices.alex);
  const next = withHostPhotos(w, (p) => {
    if (!ids.has(p.id) || !unsent.includes(p.stage)) return p;
    return p.stage === "prepared" && ready
      ? { ...p, reserved: true, stage: "reserved", reservedAt: w.clock, stageAt: w.clock }
      : { ...p, reserved: true };
  });
  return { ...next, recovery: { ...r, approvals, state: "approved" } };
}

function declineRecovery(w: World): World {
  const r = w.recovery;
  if (r?.state !== "needed") return w;
  const ids = new Set(r.photoIds);
  const next = withHostPhotos(w, (p) =>
    ids.has(p.id) && unsent.includes(p.stage) ? { ...p, stage: "canceled", retry: false } : p,
  );
  return { ...next, recovery: { ...r, state: "declined" } };
}

// ---- Phones ----

function navigate(w: World, id: DeviceId, route: Route): World {
  const d = w.devices[id];
  const shown = d.mode === "borrowing" && !borrowingRoutes.includes(route) ? "lock" : route;
  return withUi(w, id, {
    route: shown,
    panel: null,
    confirm: null,
    notice: null,
    openPhoto: shown === "photo" ? d.ui.openPhoto : null,
  });
}

function openPhoto(w: World, id: DeviceId, photo: PhotoId): World {
  const d = w.devices[id];
  // Alex can look at his last shot only; Sarah at any photo she has (R3).
  if (d.mode === "borrowing")
    return d.ui.lastShot === photo ? withUi(w, id, { openPhoto: photo }) : w;
  if (!d.gallery.some((p) => p.id === photo)) return w;
  return withUi(w, id, { route: "photo", openPhoto: photo, panel: null, confirm: null });
}

function closePhoto(w: World, id: DeviceId): World {
  const d = w.devices[id];
  return withUi(w, id, { openPhoto: null, route: d.ui.route === "photo" ? "home" : d.ui.route });
}

function startRoute(w: World, d: DeviceState): Route {
  if (!d.signedIn) return "welcome";
  if (d.username === null) return "username";
  if (d.mode === "borrowing") return isActive(w.session) ? "camera" : "lock";
  return "home";
}

/** Persistent state survives a relaunch; memory-only state does not (design spec §10). */
function relaunch(w: World, id: DeviceId): World {
  return withDevice(w, id, (d) => ({
    ...d,
    hostPhotos: d.hostPhotos.map((p) =>
      p.stage === "preparing" || p.stage === "uploading" ? { ...p, stageAt: w.clock } : p,
    ),
    gallery: d.gallery.map((p) => {
      // A save that was interrupted can't be known to have finished (R5).
      if (p.stage === "exportPending") return { ...p, stage: "exportUncertain", stageAt: w.clock };
      return p.stage === "arriving" ? { ...p, stageAt: w.clock, progress: 0 } : p;
    }),
    ui: {
      ...d.ui,
      route: startRoute(w, d),
      panel: null,
      confirm: null,
      prompt: null,
      lastShot: null,
      openPhoto: null,
      pendingSave: null,
      toast: null,
      field: { value: "", state: "idle", since: w.clock },
    },
  }));
}

function requestPermission(w: World, id: DeviceId, kind: PromptKind): World {
  const d = w.devices[id];
  // Asked once, at the moment of need; Android has no Photos prompt (R8).
  if (d.permissions[kind] !== "notDetermined") return w;
  if (kind === "photosAddOnly" && platformOf(d) === "android") return w;
  return withUi(w, id, { prompt: kind });
}

function answerPermission(w: World, id: DeviceId, kind: PromptKind, allow: boolean): World {
  const pending = w.devices[id].ui.pendingSave;
  const next = withDevice(w, id, (d) => ({
    ...d,
    permissions: { ...d.permissions, [kind]: allow ? "granted" : "denied" },
    ui: {
      ...d.ui,
      prompt: d.ui.prompt === kind ? null : d.ui.prompt,
      pendingSave: kind === "photosAddOnly" ? null : d.ui.pendingSave,
    },
  }));
  return kind === "photosAddOnly" && allow && pending !== null ? startSave(next, pending) : next;
}

function unlock(w: World, success: boolean): World {
  const alex = w.devices.alex;
  if (alex.mode !== "borrowing" || alex.ui.route !== "lock") return w;
  if (!success) return withUi(w, "alex", { notice: "authCanceled" });
  // Unlocking is the one way back to Alex's own phone; it ends any session still running (R4).
  const ended = finish(w, w.clock, false);
  return withDevice(ended, "alex", (d) => ({
    ...d,
    mode: "normal",
    ui: { ...d.ui, route: "home", panel: null, confirm: null, notice: null },
  }));
}

function submitUsername(w: World, id: DeviceId): World {
  const d = w.devices[id];
  const field = d.ui.field;
  if (field.state === "valid") {
    return withDevice(w, id, (x) => ({
      ...x,
      username: field.value,
      ui: { ...x.ui, route: "home", field: { value: "", state: "idle", since: w.clock } },
    }));
  }
  if (field.state === "checking" || !online(d)) return w;
  // The rule is known at once; whether the name is free needs a check.
  const state = usernameProblem(field.value) === "notAllowed" ? "invalid" : "checking";
  return withUi(w, id, { field: { ...field, state, since: w.clock } });
}

function signOut(w: World, id: DeviceId): World {
  // The app's photos stay on the phone, locked until this account signs in again (R11).
  return withDevice(w, id, (d) => ({
    ...d,
    signedIn: false,
    ui: { ...d.ui, route: "welcome", panel: null, confirm: null, openPhoto: null },
  }));
}

function deleteAccount(w: World, id: DeviceId): World {
  // Copies saved to Photos stay there; only the app's own copies go (R11).
  const next = withDevice(w, id, (d) => ({
    ...d,
    signedIn: false,
    username: null,
    gallery: [],
    ui: {
      ...d.ui,
      route: "welcome",
      panel: null,
      confirm: null,
      openPhoto: null,
      notice: "accountDeleted",
    },
  }));
  return { ...next, session: null, recovery: null };
}

// ---- The clock ----

/** Steps that happen at once whenever their conditions hold. */
function settle(w: World): World {
  const alex = w.devices.alex;
  const ready = canUpload(alex);
  const receipted = new Set(w.cloud.filter((o) => o.stage === "receipted").map((o) => o.photoId));
  let next = withHostPhotos(w, (p) => {
    let photo = p;
    if (photo.stage === "prepared" && ready && authorized(w, photo)) {
      photo = {
        ...photo,
        stage: "reserved",
        reserved: true,
        reservedAt: w.clock,
        stageAt: w.clock,
      };
    }
    if (photo.stage === "reserved" && ready) {
      photo = { ...photo, stage: "uploading", stageAt: w.clock, retry: false };
    }
    if (photo.stage === "uploading") {
      // A lost connection keeps the stage and adds a retry marker; it starts again when back (R5).
      if (!ready && !photo.retry) photo = { ...photo, retry: true };
      else if (ready && photo.retry) photo = { ...photo, retry: false, stageAt: w.clock };
    }
    if (photo.stage === "uploaded" && receipted.has(photo.id) && online(alex)) {
      photo = { ...photo, stage: "delivered", stageAt: w.clock };
    }
    return photo;
  });

  const sarah = next.devices.sarah;
  if (sarah.signedIn && online(sarah)) {
    const have = new Set(sarah.gallery.map((p) => p.id));
    const arriving = next.cloud.filter((o) => o.stage === "verified" && !have.has(o.photoId));
    if (arriving.length > 0) {
      const ids = new Set(arriving.map((o) => o.photoId));
      const newPhotos = arriving.map((o): RecipientPhoto => ({
        id: o.photoId,
        sessionId: o.sessionId,
        fromName: people.alex.name,
        stage: "arriving",
        progress: 0,
        retry: false,
        arrivedAt: 0,
        stageAt: w.clock,
        sample: alex.hostPhotos.find((p) => p.id === o.photoId)?.sample ?? "coast-01",
      }));
      next = withDevice(next, "sarah", (d) => ({ ...d, gallery: [...d.gallery, ...newPhotos] }));
      next = {
        ...next,
        cloud: next.cloud.map((o): CloudObject =>
          ids.has(o.photoId) ? { ...o, stage: "downloading" } : o,
        ),
      };
    }
  }
  const reachable = online(next.devices.sarah);
  return withGallery(next, (p) => {
    if (p.stage !== "arriving") return p;
    if (!reachable && !p.retry) return { ...p, retry: true };
    if (reachable && p.retry) return { ...p, retry: false, stageAt: w.clock, progress: 0 };
    return p;
  });
}

/** The next moment something is due, or null. */
function nextDue(w: World): number | null {
  const { alex, sarah } = w.devices;
  const times: number[] = [];
  for (const p of alex.hostPhotos) {
    if (p.stage === "preparing") times.push(p.stageAt + timing.prepareMs);
    if (p.stage === "uploading" && !p.retry && canUpload(alex)) {
      times.push(p.stageAt + timing.uploadMs * pace(alex));
    }
    if (unsent.includes(p.stage)) times.push(p.expiresAt);
  }
  for (const o of w.cloud)
    if (o.stage === "verified" || o.stage === "downloading") times.push(o.expiresAt);
  for (const p of sarah.gallery) {
    if (p.stage === "arriving" && !p.retry && online(sarah)) {
      times.push(p.stageAt + timing.downloadMs * pace(sarah));
    }
    if (p.stage === "exportPending") times.push(p.stageAt + timing.saveMs);
  }
  const s = w.session;
  if (isActive(s) && s.endsAt !== null) times.push(s.endsAt);
  if (isPending(s) && s.expiresAt !== null) times.push(s.expiresAt);
  if (w.recovery?.state === "needed") times.push(w.recovery.expiresAt);
  for (const d of [alex, sarah]) {
    if (d.ui.field.state === "checking") times.push(d.ui.field.since + timing.checkUsernameMs);
  }
  return times.length > 0 ? Math.min(...times) : null;
}

/** Everything due at or before the world's clock. */
function fire(w: World): World {
  const now = w.clock;
  const alex = w.devices.alex;
  let pulses = 0;
  const uploaded: HostPhoto[] = [];
  let next = withHostPhotos(w, (p) => {
    if (unsent.includes(p.stage) && p.expiresAt <= now)
      return { ...p, stage: "expired", retry: false };
    if (p.stage === "preparing" && p.stageAt + timing.prepareMs <= now) {
      return { ...p, stage: "prepared", stageAt: now };
    }
    if (
      p.stage === "uploading" &&
      !p.retry &&
      canUpload(alex) &&
      p.stageAt + timing.uploadMs * pace(alex) <= now
    ) {
      pulses += 1;
      const done = { ...p, stage: "uploaded" as const, stageAt: now };
      uploaded.push(done);
      return done;
    }
    return p;
  });
  if (pulses > 0) next = withUi(next, "alex", { pulseKey: next.devices.alex.ui.pulseKey + pulses });

  // The relay's copy expires 72 hours after reservation; what hasn't arrived by then never will.
  const expiring = new Set(
    next.cloud
      .filter((o) => (o.stage === "verified" || o.stage === "downloading") && o.expiresAt <= now)
      .map((o) => o.photoId),
  );
  const cloud: CloudObject[] = [
    ...next.cloud.map((o): CloudObject =>
      expiring.has(o.photoId) ? { ...o, stage: "expired" } : o,
    ),
    ...uploaded.map((p): CloudObject => ({
      photoId: p.id,
      sessionId: p.sessionId,
      stage: "verified",
      expiresAt: (p.reservedAt ?? now) + limits.photoMs,
    })),
  ];
  next = { ...next, cloud };
  if (expiring.size > 0) {
    next = withHostPhotos(next, (p) =>
      expiring.has(p.id) && p.stage === "uploaded" ? { ...p, stage: "expired" } : p,
    );
  }

  const sarah = next.devices.sarah;
  const received = new Set<PhotoId>();
  next = withGallery(next, (p) => {
    if (p.stage === "arriving" && expiring.has(p.id))
      return { ...p, stage: "expired", retry: false };
    if (
      p.stage === "arriving" &&
      !p.retry &&
      online(sarah) &&
      p.stageAt + timing.downloadMs * pace(sarah) <= now
    ) {
      received.add(p.id);
      // New arrivals save themselves when auto-save is on and saving is allowed.
      const stage = sarah.settings.autoSave && canSave(sarah) ? "exportPending" : "stored";
      return { ...p, stage, progress: 1, arrivedAt: now, stageAt: now };
    }
    if (p.stage === "exportPending" && p.stageAt + timing.saveMs <= now) {
      return { ...p, stage: "saved", stageAt: now };
    }
    return p;
  });
  if (received.size > 0) {
    next = {
      ...next,
      cloud: next.cloud.map((o): CloudObject =>
        received.has(o.photoId) ? { ...o, stage: "receipted" } : o,
      ),
    };
  }

  const s = next.session;
  if (isActive(s) && s.endsAt !== null && s.endsAt <= now) next = finish(next, s.endsAt, false);
  if (isPending(s) && s.expiresAt !== null && s.expiresAt <= now) {
    next = { ...next, session: { ...s, state: "expired", expiresAt: null } };
  }
  const r = next.recovery;
  if (r?.state === "needed" && r.expiresAt <= now)
    next = { ...next, recovery: { ...r, state: "expired" } };

  for (const id of ["alex", "sarah"] as const) {
    const field = next.devices[id].ui.field;
    if (field.state === "checking" && field.since + timing.checkUsernameMs <= now) {
      const state = usernameProblem(field.value) === null ? "valid" : "invalid";
      next = withUi(next, id, { field: { ...field, state, since: now } });
    }
  }
  return next;
}

/** Download progress at the world's clock. */
function progress(w: World): World {
  const sarah = w.devices.sarah;
  return withGallery(w, (p) => {
    if (p.stage !== "arriving" || p.retry || !online(sarah)) return p;
    const fraction = (w.clock - p.stageAt) / (timing.downloadMs * pace(sarah));
    return { ...p, progress: Math.min(1, Math.max(0, fraction)) };
  });
}

function tick(w: World, ms: number): World {
  const target = w.clock + Math.max(0, ms);
  let next = settle(w);
  for (let step = 0; ; step += 1) {
    if (step > 10_000) throw new Error("The clock did not settle");
    const due = nextDue(next);
    if (due === null || due > target) break;
    next = settle(fire({ ...next, clock: Math.max(next.clock, due) }));
  }
  return progress({ ...next, clock: target });
}

// ---- The reducer ----

/** Applies one event to the world. Pure: it never mutates its input. */
export function reduce(w: World, event: WorldEvent): World {
  switch (event.type) {
    case "tick":
      return tick(w, event.ms);
    case "relaunch":
      return relaunch(w, event.device);
    case "setNetwork":
      return withDevice(w, event.device, (d) => ({
        ...d,
        network: event.network,
        connection: event.connection ?? d.connection,
      }));
    case "navigate":
      return navigate(w, event.device, event.route);
    case "openPanel":
      return withUi(w, event.device, {
        panel: event.panel,
        confirm: null,
        // An invitation shows a code only with a connection, valid for a few minutes.
        ...(event.panel === "invitation" && {
          inviteExpiresAt: online(w.devices[event.device]) ? w.clock + limits.requestMs : null,
        }),
      });
    case "closePanel":
      return withUi(w, event.device, { panel: null, inviteExpiresAt: null });
    case "openConfirm":
      return withUi(w, event.device, { confirm: event.confirm });
    case "closeConfirm":
      return withUi(w, event.device, { confirm: null });
    case "openPhoto":
      return openPhoto(w, event.device, event.id);
    case "closePhoto":
      return closePhoto(w, event.device);
    case "requestPermission":
      return requestPermission(w, event.device, event.kind);
    case "permission":
      return answerPermission(w, event.device, event.kind, event.allow);
    case "scanInvitation": {
      const { alex, sarah } = w.devices;
      if (!canStartNew(w.session) || alex.permissions.camera !== "granted") return w;
      if (sarah.ui.panel !== "invitation" || sarah.ui.inviteExpiresAt === null) return w;
      // An expired code is no longer an invitation.
      if (w.clock >= sarah.ui.inviteExpiresAt) {
        return withUi(w, "alex", { notice: "notAnInvitation" });
      }
      return withUi(startRequest(w, "verifying"), "alex", { notice: null });
    }
    case "requestByUsername": {
      if (!canStartNew(w.session)) return w;
      if (event.username.replace(/^@/, "").toLowerCase() === people.sarah.handle.slice(1)) {
        return startRequest(w, "requested");
      }
      // Someone the app knows who can't take a request, or nobody by that name.
      const known = Object.values(people).some((p) => p.handle === `@${event.username}`);
      const field = { value: event.username, state: "invalid" as const, since: w.clock };
      return withUi(w, "alex", { field, notice: known ? "notAvailable" : "noMatch" });
    }
    case "approve":
      return approve(w, event.by);
    case "decline":
      return isPending(w.session)
        ? { ...w, session: { ...w.session, state: "declined", expiresAt: null } }
        : w;
    case "wordsMismatch":
      return isPending(w.session)
        ? { ...w, session: { ...w.session, state: "mismatch", expiresAt: null } }
        : w;
    case "deviceChanged":
      return isPending(w.session)
        ? { ...w, session: { ...w.session, state: "deviceChanged", expiresAt: null } }
        : w;
    case "startAgain": {
      const s = w.session;
      if (!s || !["mismatch", "deviceChanged", "declined", "expired"].includes(s.state)) return w;
      const next = withUi({ ...w, session: restart(s, w.clock) }, "alex", { panel: "connect" });
      return withUi(next, "sarah", { panel: "connect" });
    }
    case "capture":
      return capture(w);
    case "endSession":
      return finish(w, w.clock, true);
    case "cancelUnsent":
      return cancelUnsent(w);
    case "unlock":
      return unlock(w, event.success);
    case "retryNetwork":
      // Try again resumes paused transfers now; it never sends photos that need recovery (R7).
      return settle(w);
    case "approveRecovery":
      return approveRecovery(w, event.by);
    case "declineRecovery":
      return declineRecovery(w);
    case "savePhoto":
      return savePhoto(w, event.id);
    case "deleteFromApp":
      return deleteFromApp(w, event.id);
    case "setSetting":
      return withDevice(w, event.device, (d) => ({
        ...d,
        settings: { ...d.settings, [event.key]: event.value },
      }));
    case "typeField":
      return withUi(w, event.device, {
        field: { value: event.value, state: "idle", since: w.clock },
      });
    case "submitUsername":
      return submitUsername(w, event.device);
    case "signOut":
      return signOut(w, event.device);
    case "deleteAccount":
      return deleteAccount(w, event.device);
    case "setAppearance":
      return withDevice(w, event.device, (d) => ({
        ...d,
        model: event.model ?? d.model,
        theme: event.theme ?? d.theme,
        textSize: event.textSize ?? d.textSize,
      }));
    case "showSystem":
      return withUi(w, event.device, { system: event.surface });
  }
}
