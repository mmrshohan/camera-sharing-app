import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "toggle",
  name: "Toggle",
  group: 2,
  layer: "system",
  status: "final",
  version: "1.0.0",
  summary:
    "The platform's own switch in a row with its label: UISwitch on iOS, the Material 3 switch on Android.",
  anatomy: [
    "iOS: a 51 × 31 pt track with a 27 pt white knob; system fill when off, accent when on",
    "Android: a 52 × 32 dp track with a 2 dp outline when off; the thumb grows from 16 to 24 dp when on",
    "The label in body type, with an optional description in footnote, ink2",
    "The whole row flips it",
  ],
  tokens: [
    "system.switchWidth",
    "system.switchHeight",
    "system.switchThumbOff",
    "system.switchThumbOn",
    "color.fill",
    "color.accent",
    "color.onAccent",
    "color.shadow",
    "color.surface",
    "color.fieldBorder",
    "type.body",
    "type.footnote",
    "motion.fadeMs",
  ],
  states: ["off", "on"],
  accessibility: [
    "role=switch with aria-checked, named by its label and described by its description",
    "Space and Enter flip it",
    "Android's off outline passes 3:1; on iOS the knob's position and shadow carry the state, as in UISwitch",
    "The row is at least 44 pt (iOS) or 48 dp (Android) tall",
  ],
  motion: [
    "The knob slides over 200 ms, ease-out, and the track color fades",
    "Reduce Motion: the knob moves without travelling; colors still fade",
  ],
  native: {
    ios: "SwiftUI Toggle(isOn:) { Text(label) } with .tint(accent); the system draws the current switch",
    android:
      "A Row with Text and Switch(checked, onCheckedChange) themed with accent; Modifier.toggleable(role = Role.Switch) on the row",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version: off and on." }],
};
