import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "ring-button",
  name: "RingButton",
  group: 1,
  layer: "brand",
  status: "review",
  version: "1.0.0",
  summary:
    "The signature control: the camera shutter turned into a button. Rings are for camera moments; decisions inside panels use capsule buttons.",
  anatomy: [
    "72 pt ring: a 2.5 pt accent stroke, a 4.5 pt gap and a 58 pt disc",
    "Filled (Lend): accent disc, onAccent icon. Tinted (Borrow): accentTint disc, accentText icon",
    "28 pt filled icon; the label sits 9 pt below in ringLabel type and belongs to the button",
    "Waiting: the ring becomes a quarter arc turning on the track, and the disc turns tinted",
    "Unavailable: neutral ring and disc, with the reason in words below the label",
  ],
  tokens: [
    "shape.ringSize",
    "shape.ringStroke",
    "shape.ringGap",
    "shape.ringDisc",
    "shape.ringIcon",
    "shape.ringLabelGap",
    "color.accent",
    "color.onAccent",
    "color.accentTint",
    "color.accentText",
    "color.track",
    "color.ink3",
    "color.surface",
    "type.ringLabel",
    "motion.pressScale.ring",
    "motion.pressDown",
    "motion.spring.press",
    "motion.waiting",
    "motion.dim",
  ],
  states: ["rest", "pressed", "waiting", "unavailable"],
  accessibility: [
    "A native button; the visible label is its accessible name, and ring plus label make one touch target well above 44 pt and 48 dp",
    "Waiting is aria-busy and ignores presses; unavailable is aria-disabled, stays focusable and is described by its reason",
    "Acts on release inside the button: Space and Enter press once, and sliding off cancels",
    "The accent ring passes 3:1 against the background, and each icon passes 4.5:1 on its disc, in both themes",
    "Keyboard focus draws a 2 pt accent outline around the ring",
  ],
  motion: [
    "Touch down: the disc scales to 0.92 over 100 ms, ease-out",
    "Release: spring.press (response 0.30 s, damping fraction 0.7)",
    "Waiting: a quarter arc turns once every 1.2 s, linear",
    "Reduce Motion: the disc dims to 60% instead of scaling, and the waiting arc holds still at 12 o'clock",
  ],
  native: {
    ios: "Button with a custom ButtonStyle: Circle().strokeBorder(accent, lineWidth: shape.ringStroke) at shape.ringSize around a shape.ringDisc Circle and a filled Image(systemName:) at shape.ringIcon; the label in a VStack(spacing: shape.ringLabelGap). configuration.isPressed scales the disc to motion.pressScale.ring and releases with spring.press. Waiting: Circle().trim(from: 0, to: motion.waiting.arc) turning once per motion.waiting.period. Unavailable: taps ignored without .disabled, so VoiceOver still reaches it, plus .accessibilityHint(reason)",
    android:
      "A custom composable, not a Material button: a shape.ringSize Box with a shape.ringStroke accent border around a CircleShape disc and a filled Icon; the Text label shape.ringLabelGap below. interactionSource.collectIsPressedAsState() drives graphicsLayer scale with spring(dampingRatio, stiffness) from spring.press. Waiting: drawArc turned by rememberInfiniteTransition. Unavailable: clicks ignored, semantics { disabled(); stateDescription = reason }",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: filled and tinted; rest, pressed, waiting and unavailable.",
    },
  ],
};
