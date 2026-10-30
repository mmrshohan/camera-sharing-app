import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "status-label",
  name: "StatusLabel",
  group: 2,
  layer: "brand",
  status: "final",
  version: "1.0.0",
  summary:
    "A soft tint for status, always with an icon and words: live, sending, saved, waiting and neutral.",
  anatomy: [
    "A 30 pt capsule: 12 pt padding, 8 pt before the icon",
    "An 18 pt filled icon, or the 8 pt live dot for live",
    "Label type: 13 pt semibold on iOS, 14 sp medium on Android",
    "Text and tint come from the label tokens of its kind",
  ],
  tokens: [
    "label.live",
    "label.sending",
    "label.saved",
    "label.waiting",
    "label.neutral",
    "shape.labelHeight",
    "shape.labelPadX",
    "shape.iconChip",
    "shape.liveDotSizeInLabel",
    "type.label",
  ],
  states: ["live", "sending", "saved", "waiting", "neutral"],
  accessibility: [
    "Read as its words; the icon is decorative and the live dot is named “Live”",
    "Each kind's text passes 4.5:1 on its tint in both themes (tested pairs)",
    "Tints never carry meaning alone: an icon and words, always",
    "Labels wrap at large text sizes instead of truncating",
  ],
  motion: ["The live dot breathes inside the live label and holds still with Reduce Motion"],
  native: {
    ios: "Label(text, systemImage:) in a Capsule filled with the kind's tint, .font(.footnote.weight(.semibold)); the live kind uses the LiveDot view",
    android:
      "A Row in Surface(shape = CircleShape, color = tint) with an 18 dp Icon and Text at 14 sp Medium; the live kind uses the LiveDot composable",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version: five kinds." }],
};
