import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { strings as camera } from "@prototype/copy/camera";
import { strings as session } from "@prototype/copy/session";
import { endingNow, recipientTiles } from "@prototype/model/selectors";
import type { DeviceId, HostPhoto, World, WorldEvent } from "@prototype/model/types";
import { limits, reduce, timing, toasts } from "@prototype/model/world";
import { getScenario } from "@prototype/scenarios/catalog";
import { Camera } from "@prototype/screens/Camera";
import { Home } from "@prototype/screens/Home";
import { Lock } from "@prototype/screens/Lock";
import { DeviceViewContext } from "@prototype/shell/deviceView";

const run = (world: World, ...events: WorldEvent[]): World => events.reduce(reduce, world);
const tick = (ms: number): WorldEvent => ({ type: "tick", ms });
const capture: WorldEvent = { type: "capture" };
/** Long enough for any photo to be prepared, sent, received and saved. */
const settle = tick(10_000);
/** Alex leaves the camera while lending, which locks his phone (R4). */
const leave: WorldEvent = { type: "navigate", device: "alex", route: "home" };
const offline = (device: DeviceId): WorldEvent => ({
  type: "setNetwork",
  device,
  network: "offline",
});

function scenario(id: string): World {
  const found = getScenario(id);
  if (!found) throw new Error(`no scenario ${id}`);
  return found.build();
}

/** A screen as one phone draws it in a world. */
function markup(Screen: ComponentType<{ id: DeviceId }>, world: World, id: DeviceId): string {
  return renderToStaticMarkup(
    <DeviceViewContext.Provider
      value={{ device: world.devices[id], world, dispatch: () => {}, screen: null }}
    >
      <Screen id={id} />
    </DeviceViewContext.Provider>,
  );
}

/** What a screen says, as plain text. */
const said = (Screen: ComponentType<{ id: DeviceId }>, world: World, id: DeviceId) =>
  markup(Screen, world, id)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

describe("the lock says only what is true of every photo (R5)", () => {
  test("a photo that has left this phone but isn't on Sarah's yet is waiting, not delivered", () => {
    const w = run(scenario("camera-ready"), offline("sarah"), capture, settle, leave);
    expect(w.devices.alex.ui.route).toBe("lock");
    const text = said(Lock, w, "alex");
    expect(text).toContain("1 photo waiting for Sarah’s phone");
    expect(text).not.toMatch(/deliver|reached/i);
  });

  test("photos still on this phone say what each one waits for", () => {
    const w = run(
      scenario("camera-ready"),
      offline("alex"),
      capture,
      tick(timing.captureMs),
      capture,
      tick(timing.prepareMs),
      leave,
    );
    expect(said(Lock, w, "alex")).toContain("Still on this phone: 2 waiting for internet");
  });

  test("only when every photo is on Sarah's phone does it say so", () => {
    const w = run(scenario("camera-ready"), capture, settle, leave);
    expect(said(Lock, w, "alex")).toContain("The photo reached Sarah’s phone");
  });

  test("a canceled unlock makes no promise about privacy or who can unlock", () => {
    const text = said(Lock, scenario("lock-authentication-canceled"), "alex");
    expect(text).toContain("Still locked.");
    expect(text).not.toMatch(/only alex|private/i);
  });
});

describe("ending a session says what keeps going and what will need both phones (R6, R7)", () => {
  test("a photo taken with a connection keeps sending", () => {
    expect(endingNow(run(scenario("camera-ready"), capture))).toEqual({
      keepGoing: 1,
      needApproval: 0,
    });
  });

  test("a photo taken without internet will need both phones to approve", () => {
    const w = run(scenario("camera-ready"), offline("alex"), capture, tick(timing.prepareMs));
    expect(endingNow(w)).toEqual({ keepGoing: 0, needApproval: 1 });
    expect(session.endMessage(0, 1, "Sarah")).toBe(
      "New photos stop. 1 photo taken without internet will need both phones to approve.",
    );
  });

  test("with nothing left on this phone, it doesn't claim the photos arrived", () => {
    const w = run(scenario("camera-ready"), offline("sarah"), capture, settle);
    expect(endingNow(w)).toEqual({ keepGoing: 0, needApproval: 0 });
    expect(session.endMessage(0, 0, "Sarah")).toBe(
      "New photos stop. Nothing is left to send from this phone.",
    );
  });
});

describe("Sarah's Home (design review, 29 October 2026)", () => {
  test("during a live session both rings are unavailable, with no waiting arc", () => {
    const html = markup(Home, scenario("home-live-receiving"), "sarah");
    expect(html).not.toContain('aria-busy="true"');
    expect(html.match(/ring-button--unavailable/g)).toHaveLength(2);
  });

  test("each photo has a name of its own: which one, and when", () => {
    const w = scenario("home-photos");
    const labels = recipientTiles(w).flatMap((section) => section.tiles.map((t) => t.label));
    expect(labels.length).toBeGreaterThan(1);
    expect(new Set(labels).size).toBe(labels.length);
    expect(markup(Home, w, "sarah")).not.toMatch(/aria-label="([^",]+), \1[,"]/);
  });
});

describe("the queue limit (code review 10)", () => {
  /** An earlier session's photos, still on Alex's phone and waiting for internet. */
  function earlierPhotos(w: World, count: number): World {
    const alex = w.devices.alex;
    const waiting: HostPhoto[] = Array.from({ length: count }, (_, i) => ({
      id: `s0-${i + 1}`,
      sessionId: "s0",
      stage: "reserved",
      reserved: true,
      retry: false,
      capturedAt: 0,
      stageAt: 0,
      reservedAt: 0,
      expiresAt: limits.photoMs,
      sample: "coast-01",
    }));
    return {
      ...w,
      devices: { ...w.devices, alex: { ...alex, hostPhotos: [...waiting, ...alex.hostPhotos] } },
    };
  }

  test("photos still waiting from an earlier session count on the camera as in the model", () => {
    const w = earlierPhotos(run(scenario("camera-ready"), offline("alex")), limits.queue);
    expect(run(w, capture).devices.alex.ui.toast).toBe(toasts.queueFull);
    expect(markup(Camera, w, "alex")).toContain(camera.queueFull);
  });

  test("one under the limit, both still take photos", () => {
    const w = earlierPhotos(run(scenario("camera-ready"), offline("alex")), limits.queue - 1);
    expect(run(w, capture).devices.alex.ui.toast).toBeNull();
    expect(markup(Camera, w, "alex")).not.toContain(camera.queueFull);
  });
});
