import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "section-header",
  name: "SectionHeader",
  group: 3,
  layer: "system",
  status: "final",
  version: "1.0.0",
  summary: "Names a section of a screen, such as a day in the photo grid, with an optional count.",
  anatomy: [
    "The title in title3, 20 pt",
    "An optional detail on the right in subheadline, ink2, with tabular figures",
    "20 pt above, 8 pt below, at the screen margin",
  ],
  tokens: ["type.title3", "type.subheadline", "color.ink", "color.ink2", "space.margin"],
  states: ["with detail", "title only"],
  accessibility: [
    "A level-2 heading, so screen readers can move section by section",
    "The detail wraps under the title at large text sizes",
  ],
  motion: [],
  native: {
    ios: "A Section header: Text(title).font(.title3.weight(.semibold)) with .accessibilityAddTraits(.isHeader), the detail in .subheadline secondary",
    android:
      "A Row with Text(title) in the title3 style from tokens and Modifier.semantics { heading() }",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version." }],
};
