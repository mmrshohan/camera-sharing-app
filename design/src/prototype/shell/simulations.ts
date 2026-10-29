import { canStartNew } from "@prototype/model/session";
import type { DeviceId, World, WorldEvent } from "@prototype/model/types";

export interface Simulation {
  label: string;
  event: WorldEvent;
}

/** What the review shell can make happen to a phone that the phone itself can't show. */
export function simulationsFor(world: World, id: DeviceId): Simulation[] {
  const device = world.devices[id];
  const session = world.session;
  const pending = session?.state === "requested" || session?.state === "verifying";
  if (id !== "alex") return [];
  if (device.ui.route === "lock") {
    return [{ label: "Unlock canceled", event: { type: "unlock", success: false } }];
  }
  if (pending) {
    return [
      { label: "Words don’t match", event: { type: "wordsMismatch" } },
      { label: "Sarah’s phone changes", event: { type: "deviceChanged" } },
    ];
  }
  // A scan means something only while Sarah shows a code and nothing else is under way.
  const scannable =
    device.ui.route === "scanner" &&
    device.permissions.camera === "granted" &&
    world.devices.sarah.ui.panel === "invitation" &&
    canStartNew(session);
  if (scannable) {
    return [{ label: "Simulate scan", event: { type: "scanInvitation" } }];
  }
  return [];
}
