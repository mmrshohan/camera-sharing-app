import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "avatar",
  name: "Avatar",
  group: 3,
  layer: "brand",
  status: "review",
  version: "1.0.0",
  summary: "A person, by one or two initials. Neutral, because the photos bring the color.",
  anatomy: [
    "36, 40 or 44 pt circle on the system fill",
    "Initials in ink, semibold, at 40% of the size",
    "“Sarah” → S, “Sarah Khan” → SK, “@alex” → A",
  ],
  tokens: ["color.fill", "color.ink", "type.headline"],
  states: ["initials", "decorative"],
  accessibility: [
    "Named by the person's name, unless their name already sits beside it; then it is decorative and hidden",
    "Initials in ink pass 4.5:1 on the fill in both themes",
  ],
  motion: [],
  native: {
    ios: "A Circle filled with the system fill and Text(initials); .accessibilityLabel(name), or .accessibilityHidden(true) when decorative",
    android:
      "Box(Modifier.size().clip(CircleShape).background(fill)) with Text(initials); semantics { contentDescription = name } or invisibleToUser()",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version." }],
};
