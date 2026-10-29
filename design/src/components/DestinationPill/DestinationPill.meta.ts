import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "destination-pill",
  name: "DestinationPill",
  group: 3,
  layer: "brand",
  status: "final",
  version: "1.0.1",
  summary:
    "“Sending to Sarah”, over the camera: where every photo goes. It pulses once after each photo.",
  anatomy: [
    "A capsule on the camera scrim: an 18 pt arrow and the words in label type",
    "Inside a full touch target",
    "Tap it for the session's details",
  ],
  tokens: [
    "color.onCamera",
    "color.cameraScrim",
    "type.label",
    "shape.labelHeight",
    "shape.labelPadX",
    "shape.iconChip",
    "motion.pulse",
    "motion.dim",
  ],
  states: ["at rest", "pulse"],
  accessibility: [
    "A button named by its words, such as “Sending to Sarah”",
    "The pulse is decoration; the status line and the screen's announcements carry the news",
    "Keeps the default text size at every text size, as the system camera does; natively a long press shows it large",
  ],
  motion: [
    "After each photo: scale 1 → 1.06 → 1 over 240 ms",
    "Reduce Motion: it dims to 60% and back instead",
  ],
  native: {
    ios: 'A Button with Label("Sending to \\(name)", systemImage: "arrow.up") in a Capsule of the camera scrim; after each capture a keyframe scale of 1 → motion.pulse.scale → 1 over motion.pulse; .dynamicTypeSize(.large) with .accessibilityShowsLargeContentViewer()',
    android:
      "A Surface(shape = CircleShape) button with an Icon and Text; an Animatable scale of 1 → motion.pulse.scale → 1 after each capture; text size in dp, so font scale doesn't grow it",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.1",
      date: "2026-10-29",
      summary:
        "Keeps the default text size, so it stays on one line, clear of the flash, at the largest text.",
    },
    { version: "1.0.0", date: "2026-10-29", summary: "First version." },
  ],
};
