import type { ComponentType } from "react";
import type { DeviceId, Route } from "@prototype/model/types";

/** A screen draws one phone's route, reading its phone through useDeviceView(id). */
export type Screen = ComponentType<{ id: DeviceId }>;

/** Each route's screen. A route without one shows its name until its screen is built. */
export const screens: Partial<Record<Route, Screen>> = {};

export const routeNames: Record<Route, string> = {
  welcome: "Welcome",
  username: "Username",
  home: "Home",
  scanner: "Scanner",
  camera: "Camera",
  lock: "Lock",
  photo: "Photo",
  settings: "Settings",
  "settings/signin": "Sign-in methods",
  "settings/devices": "Devices",
  "settings/blocked": "Blocked accounts",
  "settings/storage": "Storage",
  "settings/privacy": "Privacy",
  "settings/help": "Help",
  "settings/report": "Report",
  "settings/delete": "Delete account",
};
