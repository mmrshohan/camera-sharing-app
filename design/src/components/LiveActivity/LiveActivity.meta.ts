import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "live-activity",
  name: "LiveActivity",
  group: 4,
  layer: "system",
  status: "final",
  version: "1.0.0",
  summary:
    "Counts the photos arriving from Alex's camera while Sarah's app is closed: on her Lock Screen and in the Dynamic Island. iOS only.",
  anatomy: [
    "Lock Screen: a dark card with system.platterRadius corners; whose camera with the live dot, then the count and what's still on the way",
    "Dynamic Island, compact: as tall as the island; the photos glyph on the leading side and the count on the trailing side, clear of the camera; a check when all have arrived",
    "Pinned to iOS and dark, as the system draws its own; the count uses tabular numerals so it doesn't jitter",
    "Text keeps its default size: iOS truncates a Lock Screen Live Activity taller than 160 pt",
  ],
  tokens: [
    "system.platterRadius",
    "system.statusBarText",
    "color.elevated",
    "color.deviceBody",
    "color.onCamera",
    "color.accent",
    "color.onAccent",
    "color.accentText",
    "color.success",
    "shape.badgeSize",
    "shape.iconChip",
    "type.title2",
    "type.subheadline",
  ],
  states: ["connected", "arriving", "done", "Dynamic Island"],
  accessibility: [
    "The Lock Screen card reads in order: whose camera, live, the count, then what's on the way",
    "The island's glyphs are hidden; it reads as one line, such as “Alex’s camera: 14 photos, 2 on the way”",
    "Text passes 4.5:1 and glyphs 3:1 on their backgrounds (tested pairs)",
  ],
  motion: [],
  native: {
    ios: "ActivityKit: ActivityAttributes with a ContentState of received, arriving and done; a widget's ActivityConfiguration draws the Lock Screen view and DynamicIsland { compactLeading, compactTrailing, minimal, expanded }. Cap the Lock Screen view with .dynamicTypeSize(...DynamicTypeSize.xxxLarge) so it stays within 160 pt. The app updates it while photos arrive",
    android: "None: Android shows ProgressNotification instead",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: Lock Screen card and compact Dynamic Island.",
    },
  ],
};
