import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "icon-button",
  name: "IconButton",
  group: 2,
  layer: "brand",
  status: "review",
  version: "1.0.0",
  summary:
    "An icon with a full touch target and a name for screen readers. Accent on the app's surfaces; white on a scrim over the camera.",
  anatomy: [
    "A 24 pt icon centered in a 44 pt (iOS) or 48 dp (Android) target",
    "onLight: accentText, because blue means tappable",
    "onCamera: white on a camera-scrim circle 8 pt smaller than the target",
  ],
  tokens: [
    "shape.iconBar",
    "space.target",
    "color.accentText",
    "color.onCamera",
    "color.cameraScrim",
    "motion.pressScale.button",
    "motion.spring.press",
    "motion.dim",
  ],
  states: ["onLight", "onCamera", "pressed"],
  accessibility: [
    "Named by its label: it shows no words",
    "The target is at least 44 × 44 pt on iOS and 48 × 48 dp on Android",
    "accentText passes 3:1 for icons on the background in both themes; over the camera the scrim keeps white legible on any photo",
  ],
  motion: [
    "Touch down: the icon scales to 0.97 over 100 ms; release with spring.press",
    "Reduce Motion: it dims instead",
  ],
  native: {
    ios: "Button with Image(systemName:) at shape.iconBar, .frame(minWidth: 44, minHeight: 44), .accessibilityLabel(label); over the camera a Circle filled with cameraScrim behind the glyph",
    android:
      "IconButton (48 dp) with Icon(contentDescription = label); over the camera FilledIconButton with a cameraScrim container and white content",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: on light and over the camera.",
    },
  ],
};
