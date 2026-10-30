import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "toast",
  name: "Toast",
  group: 2,
  layer: "brand",
  status: "final",
  version: "1.0.0",
  summary:
    "A brief confirmation, such as “Connected to Sarah's phone”. It never covers a primary control and never takes a tap.",
  anatomy: [
    "An inverted capsule: ink, with text in the background color",
    "Subheadline, semibold; 8 by 16 pt padding",
    "At the top of the screen, or just above the camera controls",
    "Hidden when there is no message; its live region stays in place",
  ],
  tokens: [
    "color.ink",
    "color.background",
    "type.subheadline",
    "shape.shutterSize",
    "space.margin",
  ],
  states: ["top", "aboveControls", "hidden"],
  accessibility: [
    "role=status: each new message is announced politely",
    "It never blocks a tap (pointer events pass through)",
    "Its text passes 4.5:1 on the capsule in both themes (tested pair)",
  ],
  motion: ["Fades in over 200 ms"],
  native: {
    ios: "An overlay Capsule with .transition(.opacity), placed above the controls with safeAreaInset; UIAccessibility.post(notification: .announcement) for the words",
    android:
      "A custom overlay, not a Snackbar (Snackbars take taps and sit over the bottom controls); Modifier.semantics { liveRegion = LiveRegionMode.Polite }",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    { version: "1.0.0", date: "2026-10-29", summary: "First version: top or above the controls." },
  ],
};
