import type { DeviceId, PhotoId, Route, World } from "@prototype/model/types";
import { limits, timing } from "@prototype/model/world";
import {
  connected,
  createWorld,
  newUser,
  pastSession,
  patchDevice,
  patchUi,
  run,
  scanned,
  settle,
  shoot,
  tick,
  withPhotos,
} from "./build";
import type { Journey, Scenario } from "./types";

// ---- Shared starting points ----

function must<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`Scenario needs ${what}`);
  return value;
}

const go = (w: World, device: DeviceId, route: Route): World =>
  run(w, { type: "navigate", device, route });

const firstWith = (w: World, stage: "stored" | "saved"): PhotoId =>
  must(
    w.devices.sarah.gallery.find((p) => p.stage === stage),
    `a ${stage} photo`,
  ).id;

/** Sarah has her account but no username yet. */
const onboarding = (): World =>
  patchUi(patchDevice(createWorld(), "sarah", { username: null }), "sarah", { route: "username" });

const typed = (w: World, value: string): World =>
  run(
    w,
    { type: "typeField", device: "sarah", value },
    { type: "submitUsername", device: "sarah" },
  );

const invitation = (): World =>
  run(createWorld(), { type: "openPanel", device: "sarah", panel: "invitation" });

/** Alex's scanner with the camera allowed. */
const scanning = (w: World = createWorld()): World =>
  run(
    w,
    { type: "navigate", device: "alex", route: "scanner" },
    { type: "requestPermission", device: "alex", kind: "camera" },
    { type: "permission", device: "alex", kind: "camera", allow: true },
  );

/** Alex types a username on the scanner and asks. */
const asks = (w: World, username: string): World =>
  run(
    go(w, "alex", "scanner"),
    { type: "typeField", device: "alex", value: username },
    { type: "requestByUsername", username },
  );

/** Moves the clock to `msBefore` the end of the active session. */
const beforeEnd = (w: World, msBefore: number): World =>
  run(w, tick(must(w.session?.endsAt, "an active session") - w.clock - msBefore));

/** Photos arriving on Sarah's Home: some developing, one still downloading. */
const liveReceiving = (): World => run(shoot(connected(withPhotos()), 4), tick(2400));

/** Alex was offline when the session ended: two photos need both phones to approve. */
const stuck = (): World =>
  run(
    shoot(run(connected(), { type: "setNetwork", device: "alex", network: "offline" }), 2),
    tick(1000),
    { type: "endSession" },
  );

/** Three photos on their way when Alex ended the session. */
const locked = (): World => run(shoot(connected(), 3), tick(1000), { type: "endSession" });

const openStored = (w: World): World =>
  run(w, { type: "openPhoto", device: "sarah", id: firstWith(w, "stored") });

const page = (route: Route, w: World = createWorld()): World => go(w, "sarah", route);

const confirmIn = (w: World, confirm: "signOut" | "deleteAccount"): World =>
  run(go(w, "sarah", confirm === "signOut" ? "settings" : "settings/delete"), {
    type: "openConfirm",
    device: "sarah",
    confirm,
  });

// ---- The catalog ----

type Entry = Omit<Scenario, "build" | "journey"> & { make: () => World };

/** Each build starts from nothing and shares no objects with any other (D13). */
const group = (journey: Journey, entries: Entry[]): Scenario[] =>
  entries.map(({ make, ...rest }) => ({ ...rest, journey, build: () => structuredClone(make()) }));

export const scenarios: readonly Scenario[] = [
  ...group("start", [
    {
      id: "welcome-ready",
      title: "Welcome: ready",
      focus: "sarah",
      main: true,
      make: () => newUser(),
    },
    {
      id: "welcome-sign-in-failed",
      title: "Welcome: sign-in failed",
      focus: "sarah",
      make: () => patchUi(newUser(), "sarah", { notice: "signInFailed" }),
    },
    {
      id: "welcome-sign-in-canceled",
      title: "Welcome: sign-in canceled",
      focus: "sarah",
      make: () => patchUi(newUser(), "sarah", { notice: "signInCanceled" }),
    },
    {
      id: "welcome-offline",
      title: "Welcome: offline",
      focus: "sarah",
      make: () => run(newUser(), { type: "setNetwork", device: "sarah", network: "offline" }),
    },
    {
      id: "username-empty",
      title: "Username: empty",
      focus: "sarah",
      main: true,
      make: onboarding,
    },
    {
      id: "username-checking",
      title: "Username: checking",
      focus: "sarah",
      make: () => typed(onboarding(), "sarah.k"),
    },
    {
      id: "username-available",
      title: "Username: available",
      focus: "sarah",
      make: () => run(typed(onboarding(), "sarah.k"), tick(timing.checkUsernameMs)),
    },
    {
      id: "username-taken",
      title: "Username: taken",
      focus: "sarah",
      make: () => run(typed(onboarding(), "maya"), tick(timing.checkUsernameMs)),
    },
    {
      id: "username-not-allowed",
      title: "Username: not allowed",
      focus: "sarah",
      make: () => typed(onboarding(), "Sarah K"),
    },
    {
      id: "username-offline",
      title: "Username: offline",
      focus: "sarah",
      make: () =>
        run(
          onboarding(),
          { type: "setNetwork", device: "sarah", network: "offline" },
          { type: "typeField", device: "sarah", value: "sarah.k" },
        ),
    },
  ]),

  ...group("connect", [
    {
      id: "invitation-showing-code",
      title: "Invitation: showing the code",
      focus: "sarah",
      main: true,
      make: invitation,
    },
    {
      id: "invitation-expired",
      title: "Invitation: expired",
      focus: "sarah",
      make: () => run(invitation(), tick(limits.requestMs)),
    },
    {
      id: "invitation-offline",
      title: "Invitation: offline, no code",
      focus: "sarah",
      make: () =>
        run(
          createWorld(),
          { type: "setNetwork", device: "sarah", network: "offline" },
          { type: "openPanel", device: "sarah", panel: "invitation" },
        ),
    },
    {
      id: "scanner-scanning",
      title: "Scanner: scanning",
      focus: "alex",
      main: true,
      make: () => scanning(invitation()),
    },
    {
      id: "scanner-camera-prompt",
      title: "Scanner: camera access prompt",
      focus: "alex",
      make: () =>
        run(go(createWorld(), "alex", "scanner"), {
          type: "requestPermission",
          device: "alex",
          kind: "camera",
        }),
    },
    {
      id: "scanner-access-off",
      title: "Scanner: camera access off",
      focus: "alex",
      make: () =>
        run(
          go(createWorld(), "alex", "scanner"),
          { type: "requestPermission", device: "alex", kind: "camera" },
          { type: "permission", device: "alex", kind: "camera", allow: false },
        ),
    },
    {
      id: "scanner-camera-in-use",
      title: "Scanner: camera in use elsewhere",
      focus: "alex",
      make: () => patchUi(scanning(), "alex", { notice: "cameraInUse" }),
    },
    {
      id: "scanner-not-an-invitation",
      title: "Scanner: not a valid invitation",
      focus: "alex",
      make: () => run(scanning(invitation()), tick(limits.requestMs), { type: "scanInvitation" }),
    },
    {
      id: "scanner-username-no-match",
      title: "Scanner: username, no match",
      focus: "alex",
      make: () => asks(createWorld(), "sarha"),
    },
    {
      id: "scanner-username-too-many-requests",
      title: "Scanner: username, too many requests",
      focus: "alex",
      make: () =>
        patchUi(
          run(go(createWorld(), "alex", "scanner"), {
            type: "typeField",
            device: "alex",
            value: "sarah",
          }),
          "alex",
          {
            notice: "tooManyRequests",
          },
        ),
    },
    {
      id: "scanner-username-not-available",
      title: "Scanner: username, not available",
      focus: "alex",
      make: () => asks(createWorld(), "maya"),
    },
    {
      id: "connect-check-words",
      title: "Connect: check the words",
      focus: "both",
      main: true,
      make: () => scanned(),
    },
    {
      id: "connect-incoming",
      title: "Connect: incoming request",
      focus: "sarah",
      make: () => asks(createWorld(), "sarah"),
    },
    {
      id: "connect-waiting-for-other-phone",
      title: "Connect: waiting for the other phone",
      focus: "both",
      make: () => run(scanned(), { type: "approve", by: "sarah" }),
    },
    {
      id: "connect-declined",
      title: "Connect: declined",
      focus: "both",
      make: () => run(scanned(), { type: "decline", by: "sarah" }),
    },
    {
      id: "connect-expired",
      title: "Connect: expired",
      focus: "both",
      make: () => run(scanned(), tick(limits.requestMs)),
    },
    {
      id: "connect-words-dont-match",
      title: "Connect: words don't match",
      focus: "both",
      make: () => run(scanned(), { type: "wordsMismatch" }),
    },
    {
      id: "connect-device-changed",
      title: "Connect: receiving phone changed",
      focus: "both",
      make: () => run(scanned(), { type: "deviceChanged" }),
    },
    {
      id: "home-request-arriving",
      title: "Home: a request arriving",
      focus: "sarah",
      make: () => asks(withPhotos(), "sarah"),
    },
  ]),

  ...group("capture", [
    {
      id: "camera-ready",
      title: "Camera: ready",
      focus: "alex",
      main: true,
      make: () => connected(),
    },
    {
      id: "camera-preparing",
      title: "Camera: preparing a photo",
      focus: "alex",
      make: () => run(connected(), { type: "capture" }),
    },
    {
      id: "camera-photo-sent",
      title: "Camera: photo sent",
      focus: "alex",
      make: () => run(connected(), { type: "capture" }, tick(timing.prepareMs + timing.uploadMs)),
    },
    {
      id: "camera-offline-waiting",
      title: "Camera: offline, photos waiting",
      focus: "alex",
      make: () =>
        run(
          shoot(
            run(shoot(connected(), 2), settle, {
              type: "setNetwork",
              device: "alex",
              network: "offline",
            }),
            3,
          ),
          tick(1000),
        ),
    },
    {
      id: "camera-wifi-only-waiting",
      title: "Camera: Wi-Fi only, waiting",
      focus: "alex",
      make: () =>
        run(
          shoot(
            run(
              connected(),
              { type: "setSetting", device: "alex", key: "wifiOnly", value: true },
              { type: "setNetwork", device: "alex", network: "online", connection: "cellular" },
            ),
            2,
          ),
          tick(1000),
        ),
    },
    {
      id: "camera-busy-tap-rejected",
      title: "Camera: busy, tap refused",
      focus: "alex",
      make: () =>
        run(patchDevice(run(connected(), { type: "capture" }), "alex", { busy: true }), {
          type: "capture",
        }),
    },
    {
      id: "camera-queue-full",
      title: "Camera: queue full",
      focus: "alex",
      make: () =>
        run(
          shoot(
            run(connected(), { type: "setNetwork", device: "alex", network: "offline" }),
            limits.queue,
            50,
          ),
          { type: "capture" },
        ),
    },
    {
      id: "camera-storage-full",
      title: "Camera: storage full",
      focus: "alex",
      make: () => run(patchDevice(connected(), "alex", { storageFull: true }), { type: "capture" }),
    },
    {
      id: "camera-interrupted",
      title: "Camera: interrupted",
      focus: "alex",
      make: () => patchUi(connected(), "alex", { notice: "cameraInterrupted" }),
    },
    {
      id: "camera-session-ends-soon",
      title: "Camera: session ends soon",
      focus: "alex",
      make: () => beforeEnd(run(shoot(connected(), 3), settle), 90_000),
    },
    {
      id: "camera-session-ended",
      title: "Camera: session ended",
      focus: "alex",
      make: () => beforeEnd(run(shoot(connected(), 2), settle), 0),
    },
    {
      id: "camera-flash-zoom-flip",
      title: "Camera: flash, zoom and flip",
      focus: "alex",
      make: () =>
        patchUi(run(connected(), { type: "capture" }, settle), "alex", {
          camera: { flash: "on", zoom: 2, facing: "back" },
        }),
    },
    {
      id: "camera-last-photo-open",
      title: "Camera: last photo open",
      focus: "alex",
      make: () => {
        const w = run(shoot(connected(), 2), settle);
        const id = must(w.devices.alex.ui.lastShot, "a last shot");
        return run(w, { type: "openPhoto", device: "alex", id });
      },
    },
    {
      id: "camera-last-photo-cleared",
      title: "Camera: last photo cleared after background",
      focus: "alex",
      make: () => run(shoot(connected(), 2), settle, { type: "relaunch", device: "alex" }),
    },
    {
      id: "session-counts",
      title: "Session: counts",
      focus: "alex",
      main: true,
      make: () =>
        run(
          shoot(connected(), 3),
          settle,
          { type: "capture" },
          tick(timing.prepareMs + 100),
          { type: "capture" },
          { type: "openPanel", device: "alex", panel: "session" },
        ),
    },
    {
      id: "session-photo-list",
      title: "Session: each photo",
      focus: "alex",
      make: () =>
        run(
          shoot(
            run(
              shoot(connected(), 4),
              settle,
              { type: "capture" },
              tick(timing.prepareMs + 100),
              { type: "setNetwork", device: "alex", network: "offline" },
              tick(100),
            ),
            2,
          ),
          tick(1000),
          { type: "openPanel", device: "alex", panel: "session" },
        ),
    },
    {
      id: "session-time-left",
      title: "Session: time left",
      focus: "alex",
      make: () =>
        run(beforeEnd(run(shoot(connected(), 2), settle), 4 * 60_000), {
          type: "openPanel",
          device: "alex",
          panel: "session",
        }),
    },
    {
      id: "session-end-session",
      title: "Session: end session?",
      focus: "alex",
      make: () =>
        run(
          shoot(connected(), 2),
          settle,
          { type: "openPanel", device: "alex", panel: "session" },
          { type: "openConfirm", device: "alex", confirm: "endSession" },
        ),
    },
    {
      id: "session-cancel-unsent",
      title: "Session: cancel unsent photos?",
      focus: "alex",
      make: () =>
        run(
          shoot(run(connected(), { type: "setNetwork", device: "alex", network: "offline" }), 3),
          tick(1000),
          { type: "openPanel", device: "alex", panel: "session" },
          { type: "openConfirm", device: "alex", confirm: "cancelUnsent" },
        ),
    },
    { id: "lock-locked", title: "Lock: still sending", focus: "alex", main: true, make: locked },
    {
      id: "lock-authentication-canceled",
      title: "Lock: unlock canceled",
      focus: "alex",
      make: () => run(locked(), { type: "unlock", success: false }),
    },
    {
      id: "lock-relaunched",
      title: "Lock: after a relaunch",
      focus: "alex",
      make: () => run(locked(), { type: "relaunch", device: "alex" }),
    },
    {
      id: "lock-unlocked-home",
      title: "Lock: unlocked, Alex's Home",
      focus: "alex",
      make: () => run(locked(), settle, { type: "unlock", success: true }),
    },
    {
      id: "recovery-needs-both",
      title: "Recovery: needs both phones",
      focus: "both",
      main: true,
      make: stuck,
    },
    {
      id: "recovery-approved-waiting",
      title: "Recovery: approved here, waiting",
      focus: "both",
      make: () => run(stuck(), { type: "approveRecovery", by: "alex" }),
    },
    {
      id: "recovery-declined",
      title: "Recovery: declined",
      focus: "both",
      make: () => run(stuck(), { type: "declineRecovery", by: "sarah" }),
    },
    {
      id: "recovery-expired",
      title: "Recovery: original expiry passed",
      focus: "both",
      make: () => run(stuck(), tick(limits.photoMs)),
    },
  ]),

  ...group("photos", [
    {
      id: "home-photos",
      title: "Home: photos",
      focus: "sarah",
      main: true,
      make: () => withPhotos(),
    },
    { id: "home-first-use", title: "Home: first use", focus: "sarah", make: () => createWorld() },
    {
      id: "home-live-receiving",
      title: "Home: live, receiving",
      focus: "sarah",
      make: liveReceiving,
    },
    {
      id: "home-live-waiting-for-alex",
      title: "Home: live, waiting for Alex's internet",
      focus: "sarah",
      make: () =>
        run(
          shoot(
            run(shoot(connected(withPhotos()), 2), settle, {
              type: "setNetwork",
              device: "alex",
              network: "offline",
            }),
            2,
          ),
          tick(1000),
        ),
    },
    {
      id: "home-storage-full",
      title: "Home: storage full",
      focus: "sarah",
      make: () => patchDevice(withPhotos(), "sarah", { storageFull: true }),
    },
    {
      id: "home-photos-access-off",
      title: "Home: Photos access off",
      focus: "sarah",
      make: () =>
        run(withPhotos(), {
          type: "permission",
          device: "sarah",
          kind: "photosAddOnly",
          allow: false,
        }),
    },
    {
      id: "photo-only-in-app",
      title: "Photo: only in this app",
      focus: "sarah",
      main: true,
      make: () => openStored(withPhotos()),
    },
    {
      id: "photo-saving",
      title: "Photo: saving",
      focus: "sarah",
      make: () => {
        const w = openStored(withPhotos());
        return run(w, {
          type: "savePhoto",
          id: must(w.devices.sarah.ui.openPhoto, "an open photo"),
        });
      },
    },
    {
      id: "photo-saved",
      title: "Photo: saved to Photos",
      focus: "sarah",
      make: () => {
        const w = withPhotos();
        return run(w, { type: "openPhoto", device: "sarah", id: firstWith(w, "saved") });
      },
    },
    {
      id: "photo-access-off",
      title: "Photo: Photos access off",
      focus: "sarah",
      make: () =>
        openStored(
          run(withPhotos(), {
            type: "permission",
            device: "sarah",
            kind: "photosAddOnly",
            allow: false,
          }),
        ),
    },
    {
      id: "photo-needs-checking",
      title: "Photo: save needs checking",
      focus: "sarah",
      make: () => {
        const w = openStored(withPhotos());
        const id = must(w.devices.sarah.ui.openPhoto, "an open photo");
        return run(
          w,
          { type: "savePhoto", id },
          tick(timing.saveMs / 2),
          { type: "relaunch", device: "sarah" },
          { type: "openPhoto", device: "sarah", id },
        );
      },
    },
    {
      id: "photo-delete-confirm",
      title: "Photo: delete from this app?",
      focus: "sarah",
      make: () =>
        run(openStored(withPhotos()), {
          type: "openConfirm",
          device: "sarah",
          confirm: "deleteFromApp",
        }),
    },
  ]),

  ...group("account", [
    {
      id: "settings-list",
      title: "Settings",
      focus: "sarah",
      main: true,
      make: () => page("settings", withPhotos()),
    },
    {
      id: "settings-photos-unavailable",
      title: "Settings: saving to Photos unavailable",
      focus: "sarah",
      make: () =>
        page(
          "settings",
          run(withPhotos(), {
            type: "permission",
            device: "sarah",
            kind: "photosAddOnly",
            allow: false,
          }),
        ),
    },
    {
      id: "settings-wifi-only",
      title: "Settings: Wi-Fi only on",
      focus: "alex",
      make: () =>
        go(
          run(createWorld(), { type: "setSetting", device: "alex", key: "wifiOnly", value: true }),
          "alex",
          "settings",
        ),
    },
    {
      id: "settings-notifications-off",
      title: "Settings: notifications off",
      focus: "sarah",
      make: () =>
        page(
          "settings",
          run(withPhotos(), {
            type: "permission",
            device: "sarah",
            kind: "notifications",
            allow: false,
          }),
        ),
    },
    {
      id: "signin-connected",
      title: "Sign-in methods: connected",
      focus: "sarah",
      main: true,
      make: () =>
        page(
          "settings/signin",
          patchDevice(createWorld(), "sarah", {
            account: { methods: ["google", "passkey"], devices: ["Galaxy A15"], blocked: [] },
          }),
        ),
    },
    {
      id: "signin-last-method",
      title: "Sign-in methods: the last one can't be removed",
      focus: "sarah",
      make: () => page("settings/signin"),
    },
    {
      id: "devices-two",
      title: "Devices: two",
      focus: "sarah",
      main: true,
      make: () =>
        page(
          "settings/devices",
          patchDevice(createWorld(), "sarah", {
            account: { methods: ["google"], devices: ["Galaxy A15", "Galaxy Tab A9"], blocked: [] },
          }),
        ),
    },
    {
      id: "devices-one",
      title: "Devices: one",
      focus: "sarah",
      make: () => page("settings/devices"),
    },
    {
      id: "blocked-list",
      title: "Blocked accounts",
      focus: "sarah",
      main: true,
      make: () =>
        page(
          "settings/blocked",
          patchDevice(createWorld(), "sarah", {
            account: {
              methods: ["google"],
              devices: ["Galaxy A15"],
              blocked: ["@jordan", "@riley"],
            },
          }),
        ),
    },
    {
      id: "blocked-empty",
      title: "Blocked accounts: none",
      focus: "sarah",
      make: () => page("settings/blocked"),
    },
    {
      id: "storage-normal",
      title: "Storage",
      focus: "sarah",
      main: true,
      make: () => page("settings/storage", withPhotos()),
    },
    {
      id: "storage-full",
      title: "Storage: full",
      focus: "sarah",
      make: () =>
        page("settings/storage", patchDevice(withPhotos(), "sarah", { storageFull: true })),
    },
    {
      id: "storage-empty",
      title: "Storage: empty",
      focus: "sarah",
      make: () => page("settings/storage"),
    },
    {
      id: "privacy-summary",
      title: "Privacy",
      focus: "sarah",
      main: true,
      make: () => page("settings/privacy"),
    },
    {
      id: "help-topics",
      title: "Help",
      focus: "sarah",
      main: true,
      make: () => page("settings/help"),
    },
    {
      id: "help-support-unavailable",
      title: "Help: support unavailable",
      focus: "sarah",
      make: () => patchUi(page("settings/help"), "sarah", { notice: "supportUnavailable" }),
    },
    {
      id: "report-form",
      title: "Report",
      focus: "sarah",
      main: true,
      make: () => page("settings/report"),
    },
    {
      id: "report-sent",
      title: "Report: sent",
      focus: "sarah",
      make: () => patchUi(page("settings/report"), "sarah", { notice: "reportSent" }),
    },
    {
      id: "delete-account-confirm",
      title: "Delete account?",
      focus: "sarah",
      main: true,
      make: () => confirmIn(withPhotos(), "deleteAccount"),
    },
    {
      id: "delete-account-deleted",
      title: "Delete account: deleted",
      focus: "sarah",
      make: () => run(withPhotos(), { type: "deleteAccount", device: "sarah" }),
    },
    {
      id: "signout-unsaved-warning",
      title: "Sign out: photos only in this app",
      focus: "sarah",
      main: true,
      make: () => confirmIn(withPhotos(), "signOut"),
    },
    {
      id: "signout-no-unsaved",
      title: "Sign out: every photo saved",
      focus: "sarah",
      make: () =>
        confirmIn(pastSession(createWorld(), { daysAgo: 1, count: 9, saved: 9 }), "signOut"),
    },
    {
      id: "signout-signed-out",
      title: "Sign out: signed out",
      focus: "sarah",
      make: () => run(withPhotos(), { type: "signOut", device: "sarah" }),
    },
  ]),

  ...group("system", [
    {
      id: "system-camera-prompt",
      title: "Camera access prompt",
      focus: "alex",
      main: true,
      make: () =>
        run(go(createWorld(), "alex", "scanner"), {
          type: "requestPermission",
          device: "alex",
          kind: "camera",
        }),
    },
    {
      id: "system-photos-prompt",
      title: "Photos (add only) prompt",
      focus: "sarah",
      main: true,
      make: () => {
        const w = openStored(withPhotos());
        return patchUi(w, "sarah", {
          prompt: "photosAddOnly",
          pendingSave: w.devices.sarah.ui.openPhoto,
        });
      },
    },
    {
      id: "system-notifications-prompt",
      title: "Notifications prompt",
      focus: "sarah",
      main: true,
      make: () =>
        run(connected(), { type: "requestPermission", device: "sarah", kind: "notifications" }),
    },
    {
      id: "system-live-activity-connected",
      title: "Live Activity: connected",
      focus: "sarah",
      make: () => patchUi(connected(), "sarah", { system: "lockScreen" }),
    },
    {
      id: "system-live-activity-arriving",
      title: "Live Activity: photos arriving",
      focus: "sarah",
      main: true,
      make: () => patchUi(liveReceiving(), "sarah", { system: "lockScreen" }),
    },
    {
      id: "system-live-activity-done",
      title: "Live Activity: all arrived",
      focus: "sarah",
      make: () =>
        patchUi(run(shoot(connected(), 3), settle, { type: "endSession" }, settle), "sarah", {
          system: "lockScreen",
        }),
    },
    {
      id: "system-progress-notification",
      title: "Android progress notification",
      focus: "sarah",
      main: true,
      make: () => patchUi(liveReceiving(), "sarah", { system: "notificationShade" }),
    },
  ]),
];

const byId = new Map(scenarios.map((s) => [s.id, s]));

export function getScenario(id: string): Scenario | undefined {
  return byId.get(id);
}
