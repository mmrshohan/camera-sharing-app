import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "grouped-list",
  name: "GroupedList",
  group: 3,
  layer: "system",
  status: "review",
  version: "1.0.0",
  summary:
    "Rows in a group with an optional header and footer: iOS's inset grouped list, a plain Material list on Android.",
  anatomy: [
    "iOS: rows on a rounded surface card at the screen margin; hairlines inset to where the text starts",
    "Android: rows on the background, without separators; the header in the accent, 14 sp medium",
    "Header and footer in footnote, ink2, lined up with the row text",
  ],
  tokens: [
    "color.surface",
    "color.separator",
    "color.ink2",
    "color.accentText",
    "shape.radiusCard",
    "type.footnote",
    "type.label",
    "space.margin",
  ],
  states: ["header and footer", "rows only"],
  accessibility: [
    "The header is a level-2 heading; the rows are a list, so screen readers say how many there are",
    "The footer explains the group in words; nothing relies on its color",
  ],
  motion: [],
  native: {
    ios: "List { Section { rows } header: { Text(header) } footer: { Text(footer) } }.listStyle(.insetGrouped)",
    android:
      "A LazyColumn section: the header Text in the accent with Modifier.semantics { heading() }, then ListItems, then the footer Text",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version." }],
};
