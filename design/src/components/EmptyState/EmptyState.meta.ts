import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "empty-state",
  name: "EmptyState",
  group: 3,
  layer: "brand",
  status: "review",
  version: "1.0.0",
  summary: "What a screen says before it has anything to show: calm, with at most one way forward.",
  anatomy: [
    "An optional 48 pt icon in ink2",
    "The title in title3; an optional body in subheadline, ink2",
    "At most one action, as a tinted capsule",
    "Centered, at most 360 pt wide",
  ],
  tokens: ["shape.iconHero", "type.title3", "type.subheadline", "color.ink", "color.ink2"],
  states: ["message", "with action"],
  accessibility: [
    "The title is a level-2 heading",
    "The icon is decorative; the words say everything",
    "Nothing blames the person or the phone",
  ],
  motion: [],
  native: {
    ios: "ContentUnavailableView(title, systemImage:, description:) with one action",
    android: "A centered Column with an Icon, the title and body Texts and one FilledTonalButton",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version." }],
};
