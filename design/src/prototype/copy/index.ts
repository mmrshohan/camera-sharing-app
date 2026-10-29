import * as camera from "./camera";
import * as connect from "./connect";
import * as home from "./home";
import * as invitation from "./invitation";
import * as lock from "./lock";
import * as permissions from "./permissions";
import * as scanner from "./scanner";
import * as session from "./session";
import * as username from "./username";
import * as welcome from "./welcome";

/** Every string the phones show, by module, with the keys that make a promise (spec §11). */
export const allCopy: {
  module: string;
  strings: Record<string, unknown>;
  trust: readonly string[];
}[] = [
  { module: "welcome", ...welcome },
  { module: "username", ...username },
  { module: "home", ...home },
  { module: "invitation", ...invitation },
  { module: "scanner", ...scanner },
  { module: "connect", ...connect },
  { module: "camera", ...camera },
  { module: "session", ...session },
  { module: "lock", ...lock },
  { module: "permissions", ...permissions },
];
