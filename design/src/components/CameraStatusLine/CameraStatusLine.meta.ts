import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "camera-status-line",
  name: "CameraStatusLine",
  group: 3,
  layer: "brand",
  status: "review",
  version: "1.0.0",
  summary:
    "What has happened to Alex's photos, in one line: “4 sent · 1 sending · 2 waiting for Wi-Fi”. Tap it for details.",
  anatomy: [
    "Footnote, semibold, on the camera scrim, with tabular figures",
    "Empty parts are left out; with nothing yet it says “No photos yet”",
    "Inside a full touch target",
  ],
  tokens: ["type.footnote", "color.onCamera", "color.cameraScrim", "shape.labelPadX"],
  states: ["sending", "waiting for Wi-Fi", "nothing yet"],
  accessibility: [
    "A button named by its words",
    "Photos waiting for Wi-Fi are never called sending (D10); plurals are always right (D16)",
    "The camera screen announces changes politely and coalesced; this line does not announce itself",
  ],
  motion: [],
  native: {
    ios: "A Button with Text(statusText) in a Capsule of the camera scrim; the words come from the one shared plural function",
    android: "A Surface(shape = CircleShape) button with the same shared status text",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version." }],
};
