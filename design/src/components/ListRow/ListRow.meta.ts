import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "list-row",
  name: "ListRow",
  group: 3,
  layer: "system",
  status: "review",
  version: "1.0.0",
  summary:
    "One row of a list: an icon, a title, an optional second line and one trailing thing: a chevron, a value, a switch or a label.",
  anatomy: [
    "At least 44 pt tall on iOS and 56 dp on Android; it grows with its text",
    "An optional 22 pt icon in ink2; the title in body; a second line in footnote, ink2",
    "Trailing: a chevron (iOS only; Android rows open without one), a value in ink2, the platform switch or a status label",
    "Destructive rows are drawn in danger",
  ],
  tokens: [
    "system.rowHeight",
    "shape.iconRow",
    "shape.iconChip",
    "type.body",
    "type.footnote",
    "color.ink",
    "color.ink2",
    "color.ink3",
    "color.danger",
    "color.fill",
  ],
  states: ["chevron", "value", "toggle", "label", "destructive"],
  accessibility: [
    "With a switch, the whole row is one switch named by its title and described by its second line",
    "With onPress, the row is one button; otherwise it is plain text",
    "Rows meet the platform target and grow at large text sizes; nothing truncates",
  ],
  motion: ["A pressed row fills with the system fill; no movement"],
  native: {
    ios: "A List row: Label(title, systemImage:) with a NavigationLink (chevron), .badge or LabeledContent (value), Toggle (switch) or a trailing view",
    android:
      "ListItem(headlineContent, supportingContent, leadingContent = Icon, trailingContent) with Modifier.clickable, or Modifier.toggleable(role = Role.Switch) around a Switch",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: chevron, value, switch, label and destructive rows.",
    },
  ],
};
