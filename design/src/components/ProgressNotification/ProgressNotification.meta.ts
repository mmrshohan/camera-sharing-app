import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "progress-notification",
  name: "ProgressNotification",
  group: 4,
  layer: "system",
  status: "review",
  version: "1.0.0",
  summary:
    "Android's ongoing notification while photos arrive with the app closed. Android only; iOS uses LiveActivity.",
  anatomy: [
    "Material notification card with system.platterRadius corners: the app's icon and name, then the title and what has arrived",
    "A determinate bar only while progress is real; none otherwise, never an endless one",
    "Pinned to Android; it follows the light or dark theme",
  ],
  tokens: [
    "system.platterRadius",
    "color.surface",
    "color.ink",
    "color.ink2",
    "color.accent",
    "color.onAccent",
    "color.track",
    "shape.iconBar",
    "shape.iconChip",
    "type.headline",
    "type.subheadline",
    "type.footnote",
  ],
  states: ["with progress", "without progress", "all arrived"],
  accessibility: [
    "The bar is a progressbar named “Photos arriving”, with its percent",
    "Text passes 4.5:1 on the card in both themes (tested pairs)",
  ],
  motion: [],
  native: {
    ios: "None: iOS shows LiveActivity instead",
    android:
      "NotificationCompat.Builder with setOngoing(true), setContentTitle and setContentText; setProgress(100, percent, false) only while progress is known",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: honest progress, or none.",
    },
  ],
};
