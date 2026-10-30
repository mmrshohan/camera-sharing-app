import type { CSSProperties } from "react";
import { tokens, type Platform } from "@tokens";
import type { Example } from "@workspace/types";
import { Keyboard } from "./Keyboard";

// Standalone, the keyboard needs the heights a DeviceFrame would give it.
const docked = (platform: Platform, safeBottom: number) => (
  <div
    className="ex-keyboard"
    data-platform={platform}
    style={
      {
        "--safe-bottom": `${safeBottom}px`,
        "--keyboard-height-full": `${tokens.system.keyboardHeight[platform] + safeBottom}px`,
      } as CSSProperties
    }
  >
    <Keyboard platform={platform} visible />
  </div>
);

export const examples: Example[] = [
  { id: "ios", title: "iOS", state: "iOS", render: () => docked("ios", 34) },
  { id: "android", title: "Android", state: "Android", render: () => docked("android", 0) },
];
