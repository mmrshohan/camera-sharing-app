import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "choice-chips",
  name: "ChoiceChips",
  group: 2,
  layer: "system",
  status: "final",
  version: "1.0.0",
  summary:
    "Pick one of a few short options, such as what went wrong. Capsules on iOS; Material filter chips on Android.",
  anatomy: [
    "iOS: 36 pt capsules on the system fill; the choice turns tinted and gains a checkmark",
    "Android: 32 dp filter chips, radius 8, outlined until chosen; the choice fills with the tint and shows a checkmark",
    "The touch target stays 44 pt (iOS) or 48 dp (Android)",
    "Subheadline type, semibold; chips wrap onto new lines",
  ],
  tokens: [
    "system.chipHeight",
    "system.chipRadius",
    "color.fill",
    "color.accentTint",
    "color.accentText",
    "color.fieldBorder",
    "color.ink",
    "type.subheadline",
    "shape.iconChip",
    "motion.fadeMs",
  ],
  states: ["nothing chosen", "chosen"],
  accessibility: [
    "role=radiogroup named by its label; each chip is a radio with aria-checked",
    "One tab stop, on the choice or else the first chip; arrow keys move the choice and the focus, Home and End jump",
    "The choice shows a checkmark, never color alone",
  ],
  motion: ["The fill fades over 200 ms"],
  native: {
    ios: "A wrapping layout of Buttons with .buttonBorderShape(.capsule) on the system fill; the choice is tinted with a checkmark and .accessibilityAddTraits(.isSelected)",
    android:
      "FlowRow of FilterChip(selected, onClick, label, leadingIcon = check when selected) in Modifier.selectableGroup(), each with Role.RadioButton",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version: single choice." }],
};
