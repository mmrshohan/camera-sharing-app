import { createContext, useContext } from "react";
import type { DeviceId, DeviceState, World, WorldEvent } from "@prototype/model/types";

export interface DeviceView {
  device: DeviceState;
  world: World;
  dispatch: (event: WorldEvent) => void;
  /** The phone's screen, where panels, dialogs and prompts open. */
  screen: HTMLElement | null;
}

export const DeviceViewContext = createContext<DeviceView | null>(null);

/** A screen's view of its own phone, provided by DeviceHost. */
export function useDeviceView(id: DeviceId): DeviceView {
  const view = useContext(DeviceViewContext);
  if (view?.device.id !== id)
    throw new Error(`useDeviceView("${id}") must be used inside its DeviceHost`);
  return view;
}
