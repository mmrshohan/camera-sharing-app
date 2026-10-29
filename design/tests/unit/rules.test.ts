import { describe, expect, test } from "vitest";
import { people } from "@prototype/model/fixtures";
import {
  hostItems,
  hostSummary,
  recipientTiles,
  remainingInPhotos,
} from "@prototype/model/selectors";
import type { HostStage, PhotoId, Route, World, WorldEvent } from "@prototype/model/types";
import { limits, reduce, timing, toasts } from "@prototype/model/world";
import { createWorld } from "@prototype/scenarios/build";

const run = (world: World, ...events: WorldEvent[]): World => events.reduce(reduce, world);
const tick = (ms: number): WorldEvent => ({ type: "tick", ms });
const capture: WorldEvent = { type: "capture" };
/** Long enough for any photo to be prepared, sent, received and saved. */
const settle = tick(10_000);

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error("expected a value");
  return value;
}

/** Alex scans Sarah's invitation; both phones show the words. */
function scanned(world: World = createWorld()): World {
  return run(
    world,
    { type: "openPanel", device: "sarah", panel: "invitation" },
    { type: "navigate", device: "alex", route: "scanner" },
    { type: "requestPermission", device: "alex", kind: "camera" },
    { type: "permission", device: "alex", kind: "camera", allow: true },
    { type: "scanInvitation" },
  );
}

/** Both approved: Alex lends his camera and is on the camera screen. */
const connected = (world: World = createWorld()): World =>
  run(scanned(world), { type: "approve", by: "alex" }, { type: "approve", by: "sarah" });

const hostIds = (w: World) => w.devices.alex.hostPhotos.map((p) => p.id);
const hostStages = (w: World) => w.devices.alex.hostPhotos.map((p) => p.stage);
const gallery = (w: World) => w.devices.sarah.gallery;
const stageOf = (w: World, id: PhotoId) => gallery(w).find((p) => p.id === id)?.stage;

/** Puts one of Alex's photos in a stage directly, for states the clock passes through at once. */
function withHostStage(w: World, id: PhotoId, stage: HostStage): World {
  const alex = w.devices.alex;
  const hostPhotos = alex.hostPhotos.map((p) =>
    p.id === id ? { ...p, stage, reserved: true, reservedAt: w.clock, stageAt: w.clock } : p,
  );
  return { ...w, devices: { ...w.devices, alex: { ...alex, hostPhotos } } };
}

describe("R1: the camera always shows where photos go", () => {
  test("every capture goes to the session's one recipient", () => {
    const w = run(
      connected(),
      capture,
      tick(timing.captureMs),
      capture,
      tick(timing.captureMs),
      capture,
    );
    const session = must(w.session);
    expect(session.recipient).toEqual(people.sarah);
    expect(w.devices.alex.hostPhotos).toHaveLength(3);
    for (const photo of w.devices.alex.hostPhotos) expect(photo.sessionId).toBe(session.id);
  });

  test("asking someone else while a session is active changes nothing", () => {
    const w = connected();
    expect(reduce(w, { type: "requestByUsername", username: "maya" })).toBe(w);
    expect(reduce(w, { type: "scanInvitation" })).toBe(w);
  });
});

describe("R2: both people approve the same attempt", () => {
  test("approvals from both phones for the same attempt start the session", () => {
    const w = connected();
    expect(must(w.session).state).toBe("active");
    expect(w.devices.alex.mode).toBe("borrowing");
    expect(w.devices.alex.ui.route).toBe("camera");
    expect(w.devices.sarah.ui.route).toBe("home");
  });

  test("one approval waits for the other phone", () => {
    const w = run(scanned(), { type: "approve", by: "sarah" });
    expect(must(w.session)).toMatchObject({
      state: "verifying",
      approvals: { host: false, recipient: true },
    });
  });

  test("after start again, earlier approvals no longer count", () => {
    let w = run(
      scanned(),
      { type: "approve", by: "alex" },
      { type: "wordsMismatch" },
      { type: "startAgain" },
    );
    expect(must(w.session).attempt).toBe(2);
    expect(must(w.session).words).not.toEqual(must(scanned().session).words);
    w = run(w, { type: "approve", by: "sarah" });
    expect(must(w.session).state).toBe("verifying");
    w = run(w, { type: "approve", by: "alex" });
    expect(must(w.session).state).toBe("active");
  });

  test.each(["wordsMismatch", "deviceChanged"] as const)(
    "after %s, nothing but start again leads on",
    (type) => {
      const others: WorldEvent[] = [
        { type: "approve", by: "alex" },
        { type: "approve", by: "sarah" },
        { type: "scanInvitation" },
        { type: "requestByUsername", username: "sarah" },
        { type: "retryNetwork", device: "alex" },
        { type: "relaunch", device: "alex" },
        { type: "relaunch", device: "sarah" },
        tick(limits.requestMs * 2),
        capture,
        { type: "approve", by: "alex" },
        { type: "approve", by: "sarah" },
      ];
      let w = run(scanned(), { type: "approve", by: "alex" }, { type });
      for (const event of others) {
        w = reduce(w, event);
        expect(must(w.session).state).toBe(type === "wordsMismatch" ? "mismatch" : "deviceChanged");
      }
      w = run(
        w,
        { type: "startAgain" },
        { type: "approve", by: "alex" },
        { type: "approve", by: "sarah" },
      );
      expect(must(w.session).state).toBe("active");
    },
  );

  test("a request nobody answers expires", () => {
    const w = run(scanned(), tick(limits.requestMs));
    expect(must(w.session).state).toBe("expired");
  });

  test("a decline from either phone ends the request", () => {
    expect(must(run(scanned(), { type: "decline", by: "sarah" }).session).state).toBe("declined");
    expect(must(run(scanned(), { type: "decline", by: "alex" }).session).state).toBe("declined");
  });
});

describe("R3: no gallery on Alex's phone", () => {
  test("the last shot is the newest photo of this session, cleared by relaunch, ending and a new session", () => {
    const w = run(connected(), capture, tick(timing.captureMs), capture);
    expect(w.devices.alex.ui.lastShot).toBe(hostIds(w)[1]);
    expect(run(w, { type: "relaunch", device: "alex" }).devices.alex.ui.lastShot).toBeNull();
    const ended = run(w, { type: "endSession" });
    expect(ended.devices.alex.ui.lastShot).toBeNull();
    const again = connected(run(ended, settle, { type: "unlock", success: true }));
    expect(must(again.session).id).not.toBe(must(w.session).id);
    expect(again.devices.alex.ui.lastShot).toBeNull();
  });

  test("the session's list shows labels only: no images, nothing about Sarah's saving", () => {
    const sent = run(connected(), capture, tick(timing.captureMs), capture, settle);
    const w = run(sent, { type: "savePhoto", id: must(hostIds(sent)[0]) }, settle);
    const items = hostItems(w);
    for (const item of items) expect(Object.keys(item).sort()).toEqual(["index", "label"]);
    expect(items).toEqual([
      { index: 1, label: "Delivered" },
      { index: 2, label: "Delivered" },
    ]);
  });

  test("Alex's gallery stays empty when he lends his camera", () => {
    const w = run(connected(), capture, tick(timing.captureMs), capture, settle);
    expect(gallery(w)).toHaveLength(2);
    expect(w.devices.alex.gallery).toEqual([]);
  });
});

describe("R4: borrowing survives everything but Alex's own unlock", () => {
  test("relaunching during a session returns to the camera, still borrowing, without the last shot", () => {
    const w = run(connected(), capture, { type: "relaunch", device: "alex" });
    expect(w.devices.alex.mode).toBe("borrowing");
    expect(w.devices.alex.ui).toMatchObject({ route: "camera", lastShot: null });
  });

  test("ending the session locks; relaunching after it is still locked", () => {
    const ended = run(connected(), capture, { type: "endSession" });
    expect(ended.devices.alex.ui.route).toBe("lock");
    const w = run(
      ended,
      { type: "navigate", device: "alex", route: "camera" },
      { type: "relaunch", device: "alex" },
    );
    expect(w.devices.alex).toMatchObject({ mode: "borrowing", ui: { route: "lock" } });
  });

  test.each<Route>(["home", "photo", "settings", "settings/privacy", "scanner", "welcome"])(
    "going to %s while borrowing shows the lock instead",
    (route) => {
      const w = run(connected(), { type: "navigate", device: "alex", route });
      expect(w.devices.alex.ui.route).toBe("lock");
    },
  );

  test("a failed unlock stays locked; a successful one gives Alex his phone back", () => {
    const locked = run(connected(), { type: "endSession" });
    const failed = run(locked, { type: "unlock", success: false });
    expect(failed.devices.alex).toMatchObject({ mode: "borrowing", ui: { route: "lock" } });
    const unlocked = run(locked, { type: "unlock", success: true });
    expect(unlocked.devices.alex).toMatchObject({ mode: "normal", ui: { route: "home" } });
  });

  test("a capture outside an active session is refused with a toast, and takes no photo", () => {
    const w = run(connected(), { type: "endSession" }, capture);
    expect(w.devices.alex.hostPhotos).toEqual([]);
    expect(w.devices.alex.ui.toast).toBe(toasts.sessionEnded);
  });
});

describe("R5: honest states", () => {
  test("saving photo A, then opening photo B, saves only A", () => {
    const sent = run(connected(), capture, tick(timing.captureMs), capture, settle);
    const [a, b] = hostIds(sent).map(must);
    const w = run(
      sent,
      { type: "openPhoto", device: "sarah", id: must(a) },
      { type: "savePhoto", id: must(a) },
      { type: "openPhoto", device: "sarah", id: must(b) },
      tick(timing.saveMs),
    );
    expect(stageOf(w, must(a))).toBe("saved");
    expect(stageOf(w, must(b))).toBe("stored");
  });

  test("an interrupted save is remembered on the photo, through navigation", () => {
    const sent = run(connected(), capture, settle);
    const a = must(hostIds(sent)[0]);
    let w = run(sent, { type: "savePhoto", id: a }, tick(timing.saveMs / 2), {
      type: "relaunch",
      device: "sarah",
    });
    expect(stageOf(w, a)).toBe("exportUncertain");
    w = run(
      w,
      { type: "openPhoto", device: "sarah", id: a },
      { type: "navigate", device: "sarah", route: "settings" },
      { type: "navigate", device: "sarah", route: "home" },
      settle,
    );
    expect(stageOf(w, a)).toBe("exportUncertain");
  });

  test("an upload finishing never stores the photo on Sarah's phone by itself", () => {
    const offline = run(
      connected(),
      { type: "setNetwork", device: "sarah", network: "offline" },
      capture,
      settle,
    );
    expect(hostStages(offline)).toEqual(["uploaded"]);
    expect(gallery(offline)).toEqual([]);
    const justSent = run(connected(), capture, tick(timing.prepareMs + timing.uploadMs));
    expect(hostStages(justSent)).toEqual(["uploaded"]);
    expect(gallery(justSent).map((p) => p.stage)).toEqual(["arriving"]);
  });

  test("a lost connection keeps the photo's stage and adds a retry marker", () => {
    const w = run(
      connected(),
      capture,
      tick(timing.prepareMs + 100),
      { type: "setNetwork", device: "alex", network: "offline" },
      tick(100),
    );
    expect(w.devices.alex.hostPhotos[0]).toMatchObject({ stage: "uploading", retry: true });
    expect(hostItems(w)).toEqual([{ index: 1, label: "Waiting for internet · Will retry" }]);
    const back = run(w, { type: "setNetwork", device: "alex", network: "online" }, settle);
    expect(back.devices.alex.hostPhotos[0]).toMatchObject({ stage: "delivered", retry: false });
  });
});

describe("R6: ending a session never cancels photos already on their way", () => {
  test("reserved, uploading and uploaded photos keep moving after the session ends", () => {
    const sarahOff = run(
      connected(),
      { type: "setNetwork", device: "sarah", network: "offline" },
      capture,
      tick(timing.prepareMs + timing.uploadMs + 1),
      capture,
      tick(timing.prepareMs + 100),
      capture,
    );
    const ids = hostIds(sarahOff).map(must);
    const before = withHostStage(sarahOff, must(ids[2]), "reserved");
    expect(hostStages(before)).toEqual(["uploaded", "uploading", "reserved"]);
    const w = run(
      before,
      { type: "endSession" },
      { type: "setNetwork", device: "sarah", network: "online" },
      settle,
    );
    expect(hostStages(w)).toEqual(["delivered", "delivered", "delivered"]);
    expect(gallery(w).map((p) => p.stage)).toEqual(["stored", "stored", "stored"]);
    expect(w.recovery).toBeNull();
  });

  test("cancel unsent cancels only what hasn't arrived, never Sarah's stored or saved photos", () => {
    let w = run(connected(), capture, settle);
    const saved = must(hostIds(w)[0]);
    w = run(w, { type: "savePhoto", id: saved }, settle, capture, settle);
    const stored = must(hostIds(w)[1]);
    w = run(
      w,
      { type: "setNetwork", device: "sarah", network: "offline" },
      capture,
      settle,
      { type: "setNetwork", device: "alex", network: "offline" },
      capture,
      settle,
      capture,
      { type: "cancelUnsent" },
    );
    expect(hostStages(w)).toEqual(["delivered", "delivered", "canceled", "canceled", "canceled"]);
    expect(stageOf(w, saved)).toBe("saved");
    expect(stageOf(w, stored)).toBe("stored");
    const back = run(w, { type: "setNetwork", device: "sarah", network: "online" }, settle);
    expect(
      gallery(back)
        .map((p) => p.id)
        .sort(),
    ).toEqual([saved, stored].sort());
  });
});

describe("R7: photos stuck offline need both phones to approve recovery", () => {
  const stuck = () =>
    run(
      connected(),
      { type: "setNetwork", device: "alex", network: "offline" },
      capture,
      tick(timing.captureMs),
      capture,
      tick(timing.prepareMs),
      { type: "endSession" },
    );

  test("unsent photos without a reservation need recovery when the session ends", () => {
    const w = stuck();
    expect(hostStages(w)).toEqual(["prepared", "prepared"]);
    expect(must(w.recovery)).toMatchObject({ state: "needed", photoIds: hostIds(w) });
  });

  test("trying again on the network doesn't send them", () => {
    const w = run(
      stuck(),
      { type: "setNetwork", device: "alex", network: "online" },
      { type: "retryNetwork", device: "alex" },
      settle,
    );
    expect(hostStages(w)).toEqual(["prepared", "prepared"]);
    expect(must(w.recovery).state).toBe("needed");
  });

  test("only approvals from both phones send them", () => {
    let w = run(
      stuck(),
      { type: "setNetwork", device: "alex", network: "online" },
      { type: "approveRecovery", by: "alex" },
      settle,
    );
    expect(hostStages(w)).toEqual(["prepared", "prepared"]);
    w = run(w, { type: "approveRecovery", by: "sarah" });
    expect(must(w.recovery).state).toBe("approved");
    expect(hostStages(w)).toEqual(["reserved", "reserved"]);
    w = run(w, settle);
    expect(hostStages(w)).toEqual(["delivered", "delivered"]);
  });

  test.each(["alex", "sarah"] as const)("a decline from %s's phone ends the recovery", (by) => {
    const w = run(stuck(), { type: "declineRecovery", by });
    expect(must(w.recovery).state).toBe("declined");
    expect(hostStages(w)).toEqual(["canceled", "canceled"]);
  });

  test("recovery keeps the photos' original deadline", () => {
    const w = stuck();
    const first = must(w.devices.alex.hostPhotos[0]);
    expect(must(w.recovery).expiresAt).toBe(first.capturedAt + limits.photoMs);
    const late = run(w, tick(limits.photoMs));
    expect(must(late.recovery).state).toBe("expired");
    expect(hostStages(late)).toEqual(["expired", "expired"]);
  });
});

describe("recovery panels and reports", () => {
  test("once both phones approve recovery, the Recovery panels close and sending goes on", () => {
    const w = run(
      connected(),
      { type: "setNetwork", device: "alex", network: "offline" },
      capture,
      tick(timing.prepareMs),
      { type: "endSession" },
    );
    expect(w.devices.alex.ui.panel).toBe("recovery");
    expect(w.devices.sarah.ui.panel).toBe("recovery");
    const approved = run(
      w,
      { type: "approveRecovery", by: "alex" },
      { type: "approveRecovery", by: "sarah" },
    );
    expect(approved.devices.alex.ui.panel).toBeNull();
    expect(approved.devices.sarah.ui.panel).toBeNull();
  });

  test("a report says it was sent, and can block the other person (D17)", () => {
    const sent = run(createWorld(), { type: "sendReport", device: "sarah", block: false });
    expect(sent.devices.sarah.ui.notice).toBe("reportSent");
    expect(sent.devices.sarah.account.blocked).toEqual([]);
    const blocked = run(createWorld(), { type: "sendReport", device: "sarah", block: true });
    expect(blocked.devices.sarah.account.blocked).toEqual(["@alex"]);
  });
});

describe("R8: permissions are asked once, at the moment of need", () => {
  const onIphone = () =>
    run(connected(createWorld({ sarahModel: "iphone16pro" })), capture, settle);

  test("with Photos access off, saving shows no prompt and changes nothing, however often", () => {
    const sent = onIphone();
    const a = must(hostIds(sent)[0]);
    const w = run(
      sent,
      { type: "permission", device: "sarah", kind: "photosAddOnly", allow: false },
      { type: "savePhoto", id: a },
      { type: "savePhoto", id: a },
      settle,
    );
    expect(w.devices.sarah.ui.prompt).toBeNull();
    expect(stageOf(w, a)).toBe("stored");
  });

  test("not asked yet: the iPhone asks for add-only access, then saves that photo", () => {
    const sent = onIphone();
    const a = must(hostIds(sent)[0]);
    let w = run(sent, { type: "savePhoto", id: a });
    expect(w.devices.sarah.ui.prompt).toBe("photosAddOnly");
    expect(stageOf(w, a)).toBe("stored");
    w = run(w, { type: "permission", device: "sarah", kind: "photosAddOnly", allow: true });
    expect(w.devices.sarah.ui.prompt).toBeNull();
    expect(stageOf(w, a)).toBe("exportPending");
    expect(stageOf(run(w, tick(timing.saveMs)), a)).toBe("saved");
  });

  test("Android saves straight to MediaStore, without asking", () => {
    const sent = run(connected(), capture, settle);
    const a = must(hostIds(sent)[0]);
    const w = run(sent, { type: "savePhoto", id: a });
    expect(w.devices.sarah.ui.prompt).toBeNull();
    expect(stageOf(w, a)).toBe("exportPending");
  });

  test("a prompt that was answered no is never shown again", () => {
    const w = run(
      createWorld(),
      { type: "requestPermission", device: "alex", kind: "camera" },
      { type: "permission", device: "alex", kind: "camera", allow: false },
      { type: "requestPermission", device: "alex", kind: "camera" },
    );
    expect(w.devices.alex.ui.prompt).toBeNull();
    expect(w.devices.alex.permissions.camera).toBe("denied");
  });

  test("auto-save saves new arrivals once Photos access is on", () => {
    const w = run(
      connected(createWorld({ sarahModel: "iphone16pro" })),
      { type: "setSetting", device: "sarah", key: "autoSave", value: true },
      { type: "permission", device: "sarah", kind: "photosAddOnly", allow: true },
      capture,
      settle,
    );
    expect(gallery(w).map((p) => p.stage)).toEqual(["saved"]);
  });
});

test("R9: with Wi-Fi only on cellular, photos stay prepared and count as waiting for Wi-Fi", () => {
  const w = run(
    connected(),
    { type: "setSetting", device: "alex", key: "wifiOnly", value: true },
    { type: "setNetwork", device: "alex", network: "online", connection: "cellular" },
    capture,
    tick(timing.captureMs),
    capture,
    settle,
  );
  expect(hostStages(w)).toEqual(["prepared", "prepared"]);
  expect(hostSummary(w)).toEqual({
    sent: 0,
    sending: 0,
    preparing: 0,
    waitingInternet: 0,
    waitingWifi: 2,
  });
});

test("R10: a tap while the camera is busy is refused at once and never counted", () => {
  const ready = run(connected(), capture);
  const busy: World = {
    ...ready,
    devices: { ...ready.devices, alex: { ...ready.devices.alex, busy: true } },
  };
  const w = reduce(busy, capture);
  expect(w.devices.alex.hostPhotos).toHaveLength(1);
  expect(w.devices.alex.ui.toast).toBe("Camera busy. That tap didn't take a photo.");
  expect(w.devices.alex.ui.dropKey).toBe(ready.devices.alex.ui.dropKey);
});

describe("R11: signing out and deleting the account", () => {
  const withPhotos = () => {
    const sent = run(connected(), capture, tick(timing.captureMs), capture, settle);
    return run(sent, { type: "savePhoto", id: must(hostIds(sent)[0]) }, settle);
  };

  test("signing out keeps Sarah's photos, locked, and saved ones stay saved", () => {
    const before = withPhotos();
    const w = run(before, { type: "signOut", device: "sarah" });
    expect(w.devices.sarah.signedIn).toBe(false);
    expect(w.devices.sarah.ui.route).toBe("welcome");
    expect(gallery(w)).toEqual(gallery(before));
    expect(remainingInPhotos(w.devices.sarah)).toBe(1);
  });

  test("deleting the account clears the app's photos and any session; Photos keeps its copies", () => {
    const before = withPhotos();
    expect(remainingInPhotos(before.devices.sarah)).toBe(1);
    const w = run(before, { type: "deleteAccount", device: "sarah" });
    expect(gallery(w)).toEqual([]);
    expect(w.session).toBeNull();
    expect(w.devices.sarah).toMatchObject({
      signedIn: false,
      username: null,
      ui: { route: "welcome" },
    });
  });
});

describe("Review Focus 1: a double tap has one effect", () => {
  test("approving twice from one phone still waits for the other", () => {
    const w = run(scanned(), { type: "approve", by: "sarah" }, { type: "approve", by: "sarah" });
    expect(must(w.session).state).toBe("verifying");
  });

  test("tapping Save twice saves the photo once", () => {
    const sent = run(connected(), capture, settle);
    const a = must(hostIds(sent)[0]);
    const w = run(sent, { type: "savePhoto", id: a }, { type: "savePhoto", id: a }, settle);
    expect(gallery(w).map((p) => [p.id, p.stage])).toEqual([[a, "saved"]]);
  });
});

describe("the session's clock", () => {
  test("a session ends 15 minutes after the last photo, and at most two hours after it started", () => {
    const w = connected();
    const started = must(must(w.session).startedAt);
    expect(must(w.session).endsAt).toBe(started + limits.idleMs);
    const later = run(w, tick(10 * 60_000), capture);
    expect(must(later.session).endsAt).toBe(later.clock + limits.idleMs);
    let busy = w;
    for (let i = 0; i < 12; i += 1) busy = run(busy, tick(10 * 60_000), capture);
    expect(must(busy.session).endsAt).toBe(started + limits.sessionMs);
  });

  test("when time runs out the camera shows the end, still borrowing, without the last shot", () => {
    const w = run(connected(), capture, tick(limits.idleMs));
    expect(must(w.session).state).toBe("ended");
    expect(w.devices.alex).toMatchObject({
      mode: "borrowing",
      ui: { route: "camera", lastShot: null },
    });
  });
});

describe("selectors", () => {
  test("Sarah's tiles: one section per session, newest first, honest labels", () => {
    const w = run(connected(), capture, tick(timing.captureMs), capture, settle);
    const [first, second] = hostIds(w);
    const sections = recipientTiles(w);
    expect(sections).toHaveLength(1);
    const section = must(sections[0]);
    expect(section).toMatchObject({ title: "Today", detail: "2 photos from Alex" });
    expect(section.tiles.map((t) => t.id)).toEqual([second, first]);
    expect(section.tiles[0]).toMatchObject({
      status: "onlyInApp",
      label: "Only in this app",
      develop: false,
    });
  });

  test("a photo develops only just after it arrives", () => {
    const arriving = run(connected(), capture, tick(timing.prepareMs + timing.uploadMs + 500));
    expect(must(recipientTiles(arriving)[0]).tiles[0]).toMatchObject({
      status: "arriving",
      progress: 0.5,
      develop: false,
    });
    const arrived = run(arriving, tick(500));
    expect(must(recipientTiles(arrived)[0]).tiles[0]).toMatchObject({ develop: true });
    expect(must(recipientTiles(run(arrived, settle))[0]).tiles[0]).toMatchObject({
      develop: false,
    });
  });

  test("Alex's counts follow each photo's label", () => {
    const w = run(connected(), capture, settle, capture, tick(timing.prepareMs + 100), capture);
    expect(hostSummary(w)).toEqual({
      sent: 1,
      sending: 1,
      preparing: 1,
      waitingInternet: 0,
      waitingWifi: 0,
    });
  });
});

describe("the camera between taps", () => {
  test("a capture keeps the camera busy for a moment: a second tap then is refused (R10)", () => {
    const w = run(connected(), capture, tick(timing.captureMs - 1), capture);
    expect(w.devices.alex.hostPhotos).toHaveLength(1);
    expect(w.devices.alex.ui.toast).toBe(toasts.busy);
    const later = run(w, tick(1), capture);
    expect(later.devices.alex.hostPhotos).toHaveLength(2);
  });

  test("a refusal's toast goes after a few seconds", () => {
    const w = run(connected(), capture, capture);
    expect(w.devices.alex.ui.toast).toBe(toasts.busy);
    expect(run(w, tick(timing.toastMs)).devices.alex.ui.toast).toBeNull();
  });

  test("flash, zoom and the lens change only the camera's controls", () => {
    const w = connected();
    const next = run(w, {
      type: "setCamera",
      device: "alex",
      flash: "on",
      zoom: 2,
      facing: "front",
    });
    expect(next.devices.alex.ui.camera).toEqual({ flash: "on", zoom: 2, facing: "front" });
    expect({ ...next.devices.alex.ui, camera: w.devices.alex.ui.camera }).toEqual(
      w.devices.alex.ui,
    );
  });

  test("relaunching clears a busy camera", () => {
    const w = run(connected(), capture, { type: "relaunch", device: "alex" });
    expect(w.devices.alex.busy).toBe(false);
  });
});

describe("signing in", () => {
  const newSarah = (): World => {
    const w = createWorld();
    const sarah = { ...w.devices.sarah, signedIn: false, username: null };
    return {
      ...w,
      devices: {
        ...w.devices,
        sarah: { ...sarah, ui: { ...sarah.ui, route: "welcome" as const } },
      },
    };
  };

  test("a new account goes on to choose a username; an existing one goes Home", () => {
    const w = run(newSarah(), { type: "signIn", device: "sarah", method: "google" });
    expect(w.devices.sarah).toMatchObject({
      signedIn: true,
      ui: { route: "username", notice: null },
    });
    const back = run(
      createWorld(),
      { type: "signOut", device: "sarah" },
      { type: "signIn", device: "sarah", method: "google" },
    );
    expect(back.devices.sarah).toMatchObject({ signedIn: true, ui: { route: "home" } });
  });

  test("offline, signing in does nothing", () => {
    const offline = run(newSarah(), { type: "setNetwork", device: "sarah", network: "offline" });
    expect(reduce(offline, { type: "signIn", device: "sarah", method: "google" })).toBe(offline);
  });
});

describe("the username check", () => {
  test("takes a moment, then says whether the name is free", () => {
    const start = createWorld();
    const typed = run(start, { type: "typeField", device: "sarah", value: "sarah.k" });
    const checking = run(typed, { type: "submitUsername", device: "sarah" });
    expect(checking.devices.sarah.ui.field.state).toBe("checking");
    expect(run(checking, tick(timing.checkUsernameMs)).devices.sarah.ui.field.state).toBe("valid");
    const taken = run(
      start,
      { type: "typeField", device: "sarah", value: "maya" },
      { type: "submitUsername", device: "sarah" },
      tick(timing.checkUsernameMs),
    );
    expect(taken.devices.sarah.ui.field.state).toBe("invalid");
  });
});

test("the model's timing", () => {
  expect(timing).toEqual({
    prepareMs: 700,
    uploadMs: 1200,
    downloadMs: 1000,
    saveMs: 800,
    checkUsernameMs: 600,
    captureMs: 300,
    toastMs: 3000,
  });
});

/** Freezes every nested object, so any mutation throws (modules run in strict mode). */
function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

/** A small seeded random number generator, so the event sequence repeats exactly. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test("reduce never mutates its input", () => {
  const events: WorldEvent[] = [
    capture,
    capture,
    tick(100),
    tick(timing.uploadMs),
    tick(limits.idleMs),
    { type: "relaunch", device: "alex" },
    { type: "relaunch", device: "sarah" },
    { type: "setNetwork", device: "alex", network: "offline" },
    { type: "setNetwork", device: "alex", network: "online", connection: "wifi" },
    { type: "setNetwork", device: "sarah", network: "slow" },
    { type: "setNetwork", device: "sarah", network: "offline" },
    { type: "setNetwork", device: "sarah", network: "online" },
    { type: "navigate", device: "sarah", route: "settings" },
    { type: "navigate", device: "sarah", route: "home" },
    { type: "navigate", device: "alex", route: "home" },
    { type: "openPanel", device: "alex", panel: "session" },
    { type: "closePanel", device: "alex" },
    { type: "openConfirm", device: "alex", confirm: "endSession" },
    { type: "closeConfirm", device: "alex" },
    { type: "openPanel", device: "sarah", panel: "invitation" },
    { type: "scanInvitation" },
    { type: "approve", by: "alex" },
    { type: "approve", by: "sarah" },
    { type: "wordsMismatch" },
    { type: "startAgain" },
    { type: "endSession" },
    { type: "cancelUnsent" },
    { type: "approveRecovery", by: "alex" },
    { type: "approveRecovery", by: "sarah" },
    { type: "declineRecovery", by: "sarah" },
    { type: "unlock", success: false },
    { type: "unlock", success: true },
    { type: "retryNetwork", device: "alex" },
    { type: "savePhoto", id: "s1-1" },
    { type: "openPhoto", device: "sarah", id: "s1-1" },
    { type: "deleteFromApp", id: "s1-2" },
    { type: "setSetting", device: "sarah", key: "autoSave", value: true },
    { type: "setSetting", device: "alex", key: "wifiOnly", value: true },
    { type: "permission", device: "sarah", kind: "photosAddOnly", allow: true },
    { type: "typeField", device: "sarah", value: "sarah" },
    { type: "submitUsername", device: "sarah" },
  ];
  const random = seeded(2026);
  let w = deepFreeze(connected());
  for (let i = 0; i < 200; i += 1) {
    const event = must(events[Math.floor(random() * events.length)]);
    w = deepFreeze(reduce(w, event));
  }
  expect(w.clock).toBeGreaterThan(0);
});
