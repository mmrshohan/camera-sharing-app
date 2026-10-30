import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "zoom-control",
  name: "ZoomControl",
  group: 3,
  layer: "brand",
  status: "final",
  version: "1.0.1",
  summary:
    "Zoom levels over the camera: “.5”, “1×”, “2”. The chosen level is larger and carries the “×”.",
  anatomy: [
    "30 pt circles on the camera scrim; the chosen one 38 pt on the darker scrim, semibold",
    "Each level sits in a full touch target",
    "Labels in label type with tabular figures",
  ],
  tokens: [
    "shape.zoomSize",
    "shape.zoomSizeSelected",
    "color.cameraScrim",
    "color.cameraScrimSelected",
    "color.onCamera",
    "type.label",
    "motion.fadeMs",
  ],
  states: ["chosen"],
  accessibility: [
    "A group named “Zoom”; each level is a toggle button named like “Zoom 2×”, pressed when chosen",
    "The chosen level differs in size and words, not color alone",
    "Keeps the default text size at every text size, as the system camera does; natively a long press shows the label large",
  ],
  motion: ["The chosen circle grows over 200 ms; with Reduce Motion it changes at once"],
  native: {
    ios: "An HStack of Buttons over the preview, the chosen one with .accessibilityAddTraits(.isSelected); .dynamicTypeSize(.large) with .accessibilityShowsLargeContentViewer()",
    android:
      "A Row of circular toggle buttons over the preview with Modifier.semantics { selected = chosen }; label sizes in dp, so font scale doesn't grow them",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.1",
      date: "2026-10-29",
      summary: "Keeps the default text size, so the levels never run together at the largest text.",
    },
    { version: "1.0.0", date: "2026-10-29", summary: "First version." },
  ],
};
