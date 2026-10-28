import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "shutter",
  name: "Shutter",
  group: 1,
  layer: "brand",
  status: "final",
  version: "1.0.0",
  summary: "Takes the photo. White, because color belongs to the photo.",
  anatomy: [
    "78 pt: a 4 pt onCamera ring around a 64 pt onCamera disc, with a 3 pt gap",
    "Always over the camera preview, never on a plain background",
    "Preparing: the disc dims and the ring keeps its shape",
    "Blocked: the disc hides behind a short message on the camera scrim; it is never silently disabled",
  ],
  tokens: [
    "shape.shutterSize",
    "shape.shutterStroke",
    "shape.shutterDisc",
    "color.onCamera",
    "color.cameraScrim",
    "type.label",
    "shape.labelHeight",
    "shape.labelPadX",
    "motion.pressScale.ring",
    "motion.pressDown",
    "motion.spring.press",
    "motion.dim",
    "motion.fadeMs",
  ],
  states: ["ready", "pressed", "preparing", "blocked"],
  accessibility: [
    "Named “Take photo”; while preparing it is “Preparing photo” and aria-busy",
    "Blocked: aria-disabled, still focusable, and described by its message",
    "One capture per press; the camera model ignores presses while preparing",
    "Keyboard focus draws a 2 pt white outline",
  ],
  motion: [
    "Touch down: the disc scales to 0.92 over 100 ms, ease-out; release with spring.press",
    "Preparing and blocked fade in over 200 ms",
    "Reduce Motion: the disc dims instead of scaling",
    "The capture dip (black 0 → 60% → 0 over 140 ms) belongs to the viewfinder, not the shutter",
  ],
  native: {
    ios: 'Button with a custom ButtonStyle: Circle().strokeBorder(.white, lineWidth: shape.shutterStroke) at shape.shutterSize around a white shape.shutterDisc Circle; .accessibilityLabel("Take photo"); preparing sets the disc opacity to motion.dim. The camera screen owns the capture dip and the light impact haptic',
    android:
      'A shape.shutterSize Box with a shape.shutterStroke white border around a white CircleShape disc; semantics { contentDescription = "Take photo" }. The camera screen owns the capture dip and HapticFeedbackConstants.CONFIRM',
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: ready, pressed, preparing and blocked.",
    },
  ],
};
