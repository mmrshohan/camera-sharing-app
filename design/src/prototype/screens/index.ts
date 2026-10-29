import type { ComponentType } from "react";
import type { DeviceId, Route } from "@prototype/model/types";
import { Camera } from "./Camera";
import { Home } from "./Home";
import { Lock } from "./Lock";
import { Photo } from "./Photo";
import { Settings } from "./Settings";
import { Blocked } from "./settings/Blocked";
import { DeleteAccount } from "./settings/DeleteAccount";
import { Devices } from "./settings/Devices";
import { Help } from "./settings/Help";
import { Privacy } from "./settings/Privacy";
import { Report } from "./settings/Report";
import { SignIn } from "./settings/SignIn";
import { Storage } from "./settings/Storage";
import { Scanner } from "./Scanner";
import { Username } from "./Username";
import { Welcome } from "./Welcome";

/** A screen draws one phone's route, reading its phone through useDeviceView(id). */
export type Screen = ComponentType<{ id: DeviceId }>;

/** Each route's screen. */
export const screens: Record<Route, Screen> = {
  welcome: Welcome,
  username: Username,
  home: Home,
  scanner: Scanner,
  camera: Camera,
  lock: Lock,
  photo: Photo,
  settings: Settings,
  "settings/signin": SignIn,
  "settings/devices": Devices,
  "settings/blocked": Blocked,
  "settings/storage": Storage,
  "settings/privacy": Privacy,
  "settings/help": Help,
  "settings/report": Report,
  "settings/delete": DeleteAccount,
};
