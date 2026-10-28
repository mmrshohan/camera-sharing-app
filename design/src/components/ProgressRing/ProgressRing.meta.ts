import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "progress-ring",
  name: "ProgressRing",
  group: 1,
  layer: "brand",
  status: "review",
  version: "1.0.0",
  summary:
    "Shows real progress, such as a photo arriving. It fills only as progress happens and never spins.",
  anatomy: [
    "28 pt circle",
    "2.5 pt accent arc on a track of ink at 10%",
    "Starts at 12 o'clock and fills clockwise",
    "Square ends, so 99% never looks complete",
  ],
  tokens: [
    "shape.progressRingSize",
    "shape.progressRingStroke",
    "color.accent",
    "color.track",
    "motion.fadeMs",
  ],
  states: ["0%", "25%", "75%", "100%"],
  accessibility: [
    "role=progressbar with a name (what is progressing) and a value from 0 to 100",
    "Values outside 0–1 are clamped; only a finished task reads 100",
    "The accent arc passes 3:1 against the background in both themes",
    "No progress, no ring: there is no indeterminate spinner",
  ],
  motion: [
    "The arc eases to each new value over 200 ms, ease-out",
    "Reduce Motion: the arc moves straight to each value",
  ],
  native: {
    ios: "ProgressView(value:) with a custom ProgressViewStyle: two Circle() strokes of 2.5 pt, the arc trimmed to the value, rotated −90°, .butt line cap; VoiceOver reads the percentage",
    android:
      "CircularProgressIndicator(progress = { value }) at 28.dp with strokeWidth 2.5.dp, color accent, trackColor track, gapSize 0.dp and StrokeCap.Butt",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: determinate only, square ends.",
    },
  ],
};
