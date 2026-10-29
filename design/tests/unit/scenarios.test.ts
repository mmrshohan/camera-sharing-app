import { describe, expect, test } from "vitest";
import { hostSummary, recipientTiles, showsLiveDot } from "@prototype/model/selectors";
import type { DeviceId, World } from "@prototype/model/types";
import { limits, reduce, toasts } from "@prototype/model/world";
import { getScenario, scenarios } from "@prototype/scenarios/catalog";
import { journeys } from "@prototype/scenarios/types";
import {
  defaultUrlState,
  formatUrlState,
  parseUrlState,
  type UrlState,
} from "@prototype/scenarios/url";

/** Every state in design spec §9, transcribed row by row, as `<where>-<state>`. */
const requiredStates = [
  // Welcome: Ready · sign-in failed · sign-in canceled · offline
  "welcome-ready",
  "welcome-sign-in-failed",
  "welcome-sign-in-canceled",
  "welcome-offline",
  // Username: Empty · checking · available · taken · not allowed · offline
  "username-empty",
  "username-checking",
  "username-available",
  "username-taken",
  "username-not-allowed",
  "username-offline",
  // Home: first use · photos · live receiving · live waiting for Alex's internet · storage full ·
  // Photos access off · request arriving
  "home-first-use",
  "home-photos",
  "home-live-receiving",
  "home-live-waiting-for-alex",
  "home-storage-full",
  "home-photos-access-off",
  "home-request-arriving",
  // Invitation (Sarah): showing code with countdown · expired, refresh · offline: no code shown
  "invitation-showing-code",
  "invitation-expired",
  "invitation-offline",
  // Scanner (Alex): camera access prompt · access off · camera in use elsewhere · scanning ·
  // not a valid invitation · type a username: no match, too many requests, not available
  "scanner-camera-prompt",
  "scanner-access-off",
  "scanner-camera-in-use",
  "scanner-scanning",
  "scanner-not-an-invitation",
  "scanner-username-no-match",
  "scanner-username-too-many-requests",
  "scanner-username-not-available",
  // Connect (both): incoming · check words · waiting for the other phone · declined · expired ·
  // words don't match · receiving device changed
  "connect-incoming",
  "connect-check-words",
  "connect-waiting-for-other-phone",
  "connect-declined",
  "connect-expired",
  "connect-words-dont-match",
  "connect-device-changed",
  // Camera (Alex): ready · preparing · photo sent · offline · Wi-Fi only · busy tap rejected ·
  // queue full · storage full · interrupted · ends soon · ended · flash, zoom, flip ·
  // last photo open · last photo cleared after background
  "camera-ready",
  "camera-preparing",
  "camera-photo-sent",
  "camera-offline-waiting",
  "camera-wifi-only-waiting",
  "camera-busy-tap-rejected",
  "camera-queue-full",
  "camera-storage-full",
  "camera-interrupted",
  "camera-session-ends-soon",
  "camera-session-ended",
  "camera-flash-zoom-flip",
  "camera-last-photo-open",
  "camera-last-photo-cleared",
  // Session panel (Alex): counts · per-photo list · time left · end session · cancel unsent
  "session-counts",
  "session-photo-list",
  "session-time-left",
  "session-end-session",
  "session-cancel-unsent",
  // Lock (Alex): locked, still sending · authentication canceled · relaunched · unlocked → Home
  "lock-locked",
  "lock-authentication-canceled",
  "lock-relaunched",
  "lock-unlocked-home",
  // Recovery (both): needs both approvals · approved here, waiting · declined · expiry passed
  "recovery-needs-both",
  "recovery-approved-waiting",
  "recovery-declined",
  "recovery-expired",
  // Photo (Sarah): only in this app · saving · saved · Photos access off · needs checking · delete
  "photo-only-in-app",
  "photo-saving",
  "photo-saved",
  "photo-access-off",
  "photo-needs-checking",
  "photo-delete-confirm",
  // Settings: list · save to Photos unavailable · Wi-Fi only on · notifications off
  "settings-list",
  "settings-photos-unavailable",
  "settings-wifi-only",
  "settings-notifications-off",
  // Settings pages
  "signin-connected",
  "signin-last-method",
  "devices-two",
  "devices-one",
  "blocked-list",
  "blocked-empty",
  "storage-normal",
  "storage-full",
  "storage-empty",
  "privacy-summary",
  "help-topics",
  "help-support-unavailable",
  "report-form",
  "report-sent",
  "delete-account-confirm",
  "delete-account-deleted",
  // Sign out: unsaved app copies warning · no unsaved photos · signed out
  "signout-unsaved-warning",
  "signout-no-unsaved",
  "signout-signed-out",
  // System: camera, Photos and notification prompts · Live Activity · Android notification
  "system-camera-prompt",
  "system-photos-prompt",
  "system-notifications-prompt",
  "system-live-activity-connected",
  "system-live-activity-arriving",
  "system-live-activity-done",
  "system-progress-notification",
];

const all = scenarios.map((s) => [s.id, s] as const);
const ids: DeviceId[] = ["alex", "sarah"];

function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error("expected a value");
  return value;
}

describe("coverage", () => {
  test("every state in spec §9 has exactly one scenario, and there are no extras", () => {
    expect(scenarios.map((s) => s.id).sort()).toEqual([...requiredStates].sort());
    expect(new Set(scenarios.map((s) => s.id)).size).toBe(scenarios.length);
  });

  test("ids are kebab-case and every journey starts with a main scenario", () => {
    for (const s of scenarios) expect(s.id).toMatch(/^[a-z]+(-[a-z]+)+$/);
    for (const journey of journeys) {
      const first = scenarios.find((s) => s.journey === journey);
      expect(first?.main, journey).toBe(true);
    }
  });

  test("the default scenario exists, and unknown ids don't", () => {
    expect(getScenario("home-photos")?.title).toBeTruthy();
    expect(getScenario("nope")).toBeUndefined();
  });
});

/** Touches every nested object and array, so shared references would show. */
function touchEverything(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(touchEverything);
    value.push("touched");
  } else if (value !== null && typeof value === "object") {
    for (const child of Object.values(value)) touchEverything(child);
    (value as Record<string, unknown>).touched = true;
  }
}

describe("purity (D13)", () => {
  test.each(all)("%s builds the same world every time, sharing nothing", (_, scenario) => {
    const first = scenario.build();
    const second = scenario.build();
    expect(first).toEqual(second);
    // Touching every object in one build must leave the other exactly as it was,
    // including anything shared through module-level fixtures.
    const before = JSON.stringify(second);
    touchEverything(first);
    expect(JSON.stringify(second)).toBe(before);
    reduce(scenario.build(), { type: "capture" });
    expect(JSON.stringify(scenario.build())).toBe(before);
  });
});

describe("invariants", () => {
  test.each(all)("%s", (_, scenario) => {
    const w = scenario.build();
    const hosted = new Set([
      ...w.devices.alex.hostPhotos.map((p) => p.sessionId),
      ...(w.session ? [w.session.id] : []),
    ]);
    expect(w.devices.alex.gallery.filter((p) => hosted.has(p.sessionId))).toEqual([]);
    expect(ids.filter((id) => showsLiveDot(w, id)).length).toBeLessThanOrEqual(1);
    for (const d of Object.values(w.devices)) {
      if (d.mode === "borrowing") expect(["camera", "lock"]).toContain(d.ui.route);
    }
  });
});

/** Spot checks that a scenario's world really is the state its id names. */
const reaches: Record<string, (w: World) => void> = {
  "welcome-sign-in-failed": (w) =>
    expect(w.devices.sarah).toMatchObject({
      signedIn: false,
      ui: { route: "welcome", notice: "signInFailed" },
    }),
  "username-taken": (w) =>
    expect(w.devices.sarah.ui.field).toMatchObject({ value: "maya", state: "invalid" }),
  "username-checking": (w) => expect(w.devices.sarah.ui.field.state).toBe("checking"),
  "home-live-receiving": (w) => {
    const tiles = must(recipientTiles(w)[0]).tiles;
    expect(tiles.some((t) => t.status === "arriving" && t.progress > 0 && t.progress < 1)).toBe(
      true,
    );
    expect(tiles.some((t) => t.develop)).toBe(true);
    expect(showsLiveDot(w, "sarah")).toBe(true);
  },
  "home-live-waiting-for-alex": (w) => {
    expect(w.devices.alex.network).toBe("offline");
    expect(hostSummary(w).waitingInternet).toBeGreaterThan(0);
  },
  "home-request-arriving": (w) => {
    expect(must(w.session).state).toBe("requested");
    expect(w.devices.sarah.ui.panel).toBe("connect");
  },
  "invitation-expired": (w) =>
    expect(w.clock).toBeGreaterThanOrEqual(must(w.devices.sarah.ui.inviteExpiresAt)),
  "invitation-offline": (w) =>
    expect(w.devices.sarah).toMatchObject({
      network: "offline",
      ui: { panel: "invitation", inviteExpiresAt: null },
    }),
  "scanner-camera-prompt": (w) =>
    expect(w.devices.alex.ui).toMatchObject({ route: "scanner", prompt: "camera" }),
  "scanner-access-off": (w) => expect(w.devices.alex.permissions.camera).toBe("denied"),
  "scanner-not-an-invitation": (w) => expect(w.devices.alex.ui.notice).toBe("notAnInvitation"),
  "scanner-username-no-match": (w) => expect(w.devices.alex.ui.notice).toBe("noMatch"),
  "scanner-username-not-available": (w) => expect(w.devices.alex.ui.notice).toBe("notAvailable"),
  "connect-waiting-for-other-phone": (w) =>
    expect(must(w.session)).toMatchObject({
      state: "verifying",
      approvals: { host: false, recipient: true },
    }),
  "connect-words-dont-match": (w) => expect(must(w.session).state).toBe("mismatch"),
  "connect-device-changed": (w) => expect(must(w.session).state).toBe("deviceChanged"),
  "connect-expired": (w) => expect(must(w.session).state).toBe("expired"),
  "camera-photo-sent": (w) => expect(w.devices.alex.ui).toMatchObject({ dropKey: 1, pulseKey: 1 }),
  "camera-wifi-only-waiting": (w) => expect(hostSummary(w).waitingWifi).toBeGreaterThan(0),
  "camera-offline-waiting": (w) => expect(hostSummary(w).waitingInternet).toBeGreaterThan(0),
  "camera-busy-tap-rejected": (w) => expect(w.devices.alex.ui.toast).toBe(toasts.busy),
  "camera-queue-full": (w) => {
    // The blocked shutter says why; no refused tap repeats it as a toast.
    const counts = hostSummary(w);
    expect(counts.preparing + counts.waitingInternet).toBe(limits.queue);
    expect(w.devices.alex.ui.toast).toBeNull();
  },
  "camera-storage-full": (w) =>
    expect(w.devices.alex).toMatchObject({ storageFull: true, ui: { toast: null } }),
  "camera-session-ends-soon": (w) => {
    const left = must(must(w.session).endsAt) - w.clock;
    expect(left).toBeGreaterThan(0);
    expect(left).toBeLessThanOrEqual(2 * 60_000);
  },
  "camera-session-ended": (w) => {
    expect(must(w.session).state).toBe("ended");
    expect(w.devices.alex.ui.route).toBe("camera");
  },
  "camera-last-photo-open": (w) =>
    expect(w.devices.alex.ui.openPhoto).toBe(w.devices.alex.ui.lastShot),
  "camera-last-photo-cleared": (w) => {
    expect(w.devices.alex.ui.lastShot).toBeNull();
    expect(hostSummary(w).sent).toBeGreaterThan(0);
  },
  "session-end-session": (w) =>
    expect(w.devices.alex.ui).toMatchObject({ panel: "session", confirm: "endSession" }),
  "lock-locked": (w) => {
    expect(w.devices.alex.ui.route).toBe("lock");
    expect(hostSummary(w).sending).toBeGreaterThan(0);
  },
  "lock-authentication-canceled": (w) =>
    expect(w.devices.alex.ui).toMatchObject({ route: "lock", notice: "authCanceled" }),
  "lock-unlocked-home": (w) =>
    expect(w.devices.alex).toMatchObject({ mode: "normal", ui: { route: "home" } }),
  "recovery-needs-both": (w) => {
    expect(must(w.recovery).state).toBe("needed");
    expect(w.devices.alex.ui.panel).toBe("recovery");
    expect(w.devices.sarah.ui.panel).toBe("recovery");
  },
  "recovery-approved-waiting": (w) =>
    expect(must(w.recovery)).toMatchObject({
      state: "needed",
      approvals: { host: true, recipient: false },
    }),
  "recovery-expired": (w) => expect(must(w.recovery).state).toBe("expired"),
  "photo-needs-checking": (w) => {
    const open = must(w.devices.sarah.ui.openPhoto);
    expect(w.devices.sarah.gallery.find((p) => p.id === open)?.stage).toBe("exportUncertain");
  },
  "photo-delete-confirm": (w) => expect(w.devices.sarah.ui.confirm).toBe("deleteFromApp"),
  "settings-wifi-only": (w) =>
    expect(w.devices.alex).toMatchObject({
      settings: { wifiOnly: true },
      ui: { route: "settings" },
    }),
  "signin-last-method": (w) => expect(w.devices.sarah.account.methods).toHaveLength(1),
  "delete-account-deleted": (w) => expect(w.devices.sarah.ui.notice).toBe("accountDeleted"),
  "signout-signed-out": (w) => expect(w.devices.sarah.signedIn).toBe(false),
  "system-photos-prompt": (w) => expect(w.devices.sarah.ui.prompt).toBe("photosAddOnly"),
  "system-live-activity-done": (w) => {
    expect(w.devices.sarah.ui.system).toBe("lockScreen");
    expect(w.devices.sarah.gallery.every((p) => p.stage === "stored")).toBe(true);
  },
  "system-progress-notification": (w) =>
    expect(w.devices.sarah.ui.system).toBe("notificationShade"),
};

describe("each scenario reaches its state", () => {
  test.each(Object.entries(reaches))("%s", (id, check) => check(must(getScenario(id)).build()));
});

describe("URL state", () => {
  test("bad values fall back to defaults, with a notice each", () => {
    const { state, notices } = parseUrlState("?scenario=nope&alexDevice=foo");
    expect(state).toEqual(defaultUrlState);
    expect(notices).toHaveLength(2);
  });

  test("defaults: Home with photos, both phones, Sarah in focus, the story's phones", () => {
    expect(parseUrlState("")).toEqual({
      state: {
        scenario: "home-photos",
        view: "dual",
        focus: "sarah",
        alexDevice: "iphone16pro",
        sarahDevice: "galaxyA15",
        theme: "light",
        text: "default",
        compare: null,
      },
      notices: [],
    });
  });

  test.each([
    "",
    "?scenario=camera-ready&view=single&focus=alex",
    "?scenario=photo-saved&alexDevice=iphoneSE3&sarahDevice=androidCompact&theme=dark&text=largest",
    "?compare=1.0.0",
  ])("“%s” round-trips", (search) => {
    expect(formatUrlState(parseUrlState(search).state)).toBe(search);
  });

  test("a state survives formatting and parsing", () => {
    const state: UrlState = {
      ...defaultUrlState,
      scenario: "lock-locked",
      view: "single",
      focus: "alex",
      theme: "dark",
      compare: "1.0.0",
    };
    expect(parseUrlState(formatUrlState(state))).toEqual({ state, notices: [] });
  });

  test("a compare version that isn't semver is ignored, with a notice", () => {
    const { state, notices } = parseUrlState("?compare=v1");
    expect(state.compare).toBeNull();
    expect(notices).toHaveLength(1);
  });

  test("parameters the shell doesn't own are left alone", () => {
    expect(parseUrlState("?play=0").notices).toEqual([]);
  });
});
