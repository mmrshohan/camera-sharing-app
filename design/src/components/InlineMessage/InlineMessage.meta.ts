import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "inline-message",
  name: "InlineMessage",
  group: 2,
  layer: "brand",
  status: "final",
  version: "1.0.0",
  summary:
    "A message in the flow of a screen: neutral, waiting or a problem, with at most one way forward.",
  anatomy: [
    "16 pt padding on the surface color, with the card radius",
    "A 22 pt filled icon in ink2, waiting or danger",
    "The title in headline; an optional body in subheadline, ink2",
    "An optional text button, lined up with the words",
  ],
  tokens: [
    "color.surface",
    "color.ink",
    "color.ink2",
    "color.waiting",
    "color.danger",
    "shape.radiusCard",
    "shape.iconRow",
    "type.headline",
    "type.subheadline",
  ],
  states: ["neutral", "waiting", "problem"],
  accessibility: [
    "Problems are role=alert and interrupt once; neutral and waiting are role=status, announced politely",
    "Status never relies on color: an icon and words, always",
    "Icons pass 3:1 and text 4.5:1 on the surface in both themes",
  ],
  motion: [],
  native: {
    ios: "A VStack in RoundedRectangle(cornerRadius: shape.radiusCard) filled with surface; problems post UIAccessibility.post(notification: .announcement) once",
    android:
      "A Row in Surface(shape = RoundedCornerShape(shape.radiusCard), color = surface); Modifier.semantics { liveRegion = Assertive for problems, Polite otherwise }",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: neutral, waiting and problem, with an optional action.",
    },
  ],
};
