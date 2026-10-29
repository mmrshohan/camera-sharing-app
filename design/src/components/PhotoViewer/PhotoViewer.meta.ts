import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "photo-viewer",
  name: "PhotoViewer",
  group: 4,
  layer: "brand",
  status: "final",
  version: "1.0.0",
  summary:
    "One photo, large, on a dark surround so the photo is the color, with where it is and what to do next.",
  anatomy: [
    "Always dark",
    "A close button and when it was taken, at the top",
    "The photo, as large as it fits",
    "Its state (a status label) and one or two actions below",
  ],
  tokens: ["color.background", "color.ink", "type.headline", "space.margin", "space.target"],
  states: ["only in this app"],
  accessibility: [
    "A region named by its title; the photo is an image named like “Photo, Today, 2:14 PM”",
    "Close comes first in focus order",
    "Actions are buttons with words",
  ],
  motion: ["None of its own; screens open it with spring.navigate"],
  native: {
    ios: "A full-screen cover in .preferredColorScheme(.dark): the image .scaledToFit() with MagnifyGesture for zoom, a close button and the actions in a bottom toolbar",
    android:
      "A full-screen destination in the dark theme: the image with ContentScale.Fit and transform gestures for zoom, a close button and the actions at the bottom",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version." }],
};
