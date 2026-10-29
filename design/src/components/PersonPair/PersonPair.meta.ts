import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "person-pair",
  name: "PersonPair",
  group: 3,
  layer: "brand",
  status: "final",
  version: "1.0.0",
  summary:
    "Who lends the camera and exactly which phone the photos go to. Both phones show the same block before anyone approves (R2).",
  anatomy: [
    "Two people on the surface card: a 44 pt avatar, the name in headline, the handle and phone in subheadline",
    "The recipient's exact phone is emphasized: it is what both people check",
    "A down arrow between them shows where the photos go",
    "Titles in footnote, ink2, such as “Camera” and “Photos go to”",
  ],
  tokens: [
    "color.surface",
    "color.ink",
    "color.ink2",
    "color.ink3",
    "shape.radiusCard",
    "shape.iconChip",
    "type.headline",
    "type.subheadline",
    "type.footnote",
  ],
  states: ["pair"],
  accessibility: [
    "Reads top to bottom: title, name, handle and phone, then the other person",
    "The avatars are decorative; the names are text",
    "Long names and phone models wrap; nothing truncates",
  ],
  motion: [],
  native: {
    ios: "A VStack in RoundedRectangle(cornerRadius: shape.radiusCard) on surface: per person an HStack of the avatar and a VStack(name, handle · device), with .accessibilityElement(children: .combine)",
    android:
      "A Column in Surface(shape = RoundedCornerShape(shape.radiusCard)): per person a Row of the avatar and a Column(name, handle · device), with Modifier.semantics(mergeDescendants = true)",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version." }],
};
