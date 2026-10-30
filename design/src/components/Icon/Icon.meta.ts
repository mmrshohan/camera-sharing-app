import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "icon",
  name: "Icon",
  group: 1,
  layer: "system",
  status: "final",
  version: "1.0.0",
  summary:
    "Thirty standard icons by meaning. iOS uses the SF Symbol; Android and this workspace draw Material Symbols Rounded.",
  anatomy: [
    "24 × 24 grid; drawn at 22 pt in rows, 24 pt in bars and 28 pt inside rings",
    "Outlined at rest, filled when selected or inside a ring",
    "Color inherits from text (currentColor); status icons take success, waiting or danger",
  ],
  tokens: ["color.ink", "color.success", "color.waiting", "color.danger"],
  states: ["outlined", "filled", "labelled"],
  accessibility: [
    "Decorative by default (aria-hidden) when words already say the same thing",
    "Pass a label when the icon carries meaning alone; it becomes role=img with that name",
    "Never the only signal for a status: always next to words (guideline rule)",
  ],
  motion: [],
  native: {
    ios: "Image(systemName:) with the SF Symbol name from the registry",
    android: "Icon(painterResource(R.drawable.<material name>)) from Material Symbols Rounded",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    { version: "1.0.0", date: "2026-10-28", summary: "First version with 30 standard icons." },
  ],
};
