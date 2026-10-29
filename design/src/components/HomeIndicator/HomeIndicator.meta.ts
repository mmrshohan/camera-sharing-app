import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "home-indicator",
  name: "HomeIndicator",
  group: 4,
  layer: "system",
  status: "final",
  version: "1.0.0",
  summary:
    "The bottom of the screen: iOS's home indicator, Android's gesture handle or three buttons.",
  anatomy: [
    "iOS: a 134 × 5 pt bar, 8 pt from the bottom",
    "Android gestures: a 108 × 4 dp handle",
    "Android three buttons: back, home and recents in the 48 dp bottom inset",
  ],
  tokens: ["color.ink", "color.ink2", "color.background", "color.onCamera"],
  states: ["homeIndicator", "gestureBar", "threeButton"],
  accessibility: ["Decoration only, hidden from screen readers"],
  motion: [],
  native: {
    ios: "Drawn by the system; screens keep content clear of it with the bottom safe area",
    android:
      "Drawn by the system; screens keep content clear of it with WindowInsets.navigationBars",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version." }],
};
