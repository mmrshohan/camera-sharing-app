import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "live-dot",
  name: "LiveDot",
  group: 1,
  layer: "brand",
  status: "final",
  version: "1.0.0",
  summary:
    "Says “this is happening now”. One per screen, next to a live count or inside the Live label.",
  anatomy: [
    "10 pt circle in the live color",
    "8 pt inside a status label",
    "Breathes between full and 35% opacity",
  ],
  tokens: [
    "color.live",
    "shape.liveDotSize",
    "shape.liveDotSizeInLabel",
    "motion.live.periodMs",
    "motion.live.min",
  ],
  states: ["breathing", "steady (reduce motion)"],
  accessibility: [
    "role=img named “Live” by default; pass a fuller name when the screen needs one",
    "Never the only signal: always beside words or a number",
    "Passes the 3:1 graphic threshold on the background and inside the Live label in both themes (tested pairs)",
  ],
  motion: [
    "Breathing: opacity 1 → 0.35 → 1 over 1.6 s, ease-in-out, repeating",
    "Reduce Motion: steady at full opacity",
  ],
  native: {
    ios: 'Circle().fill(live).frame(width: 10, height: 10); opacity between 1 and motion.live.min, .easeInOut over half of motion.live.periodMs with .repeatForever(autoreverses: true), off when accessibilityReduceMotion is on; .accessibilityLabel("Live")',
    android:
      'Box(Modifier.size(10.dp).clip(CircleShape).background(live)); alpha down to motion.live.min from rememberInfiniteTransition, tween(motion.live.periodMs / 2) with RepeatMode.Reverse, steady when the animator duration scale is 0; semantics { contentDescription = "Live" }',
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    { version: "1.0.0", date: "2026-10-29", summary: "First version: breathing and steady." },
  ],
};
