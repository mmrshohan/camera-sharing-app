import { people } from "@prototype/model/fixtures";
import type { DeviceId, DeviceModel, DeviceState, World } from "@prototype/model/types";

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
