import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "button",
  name: "Button",
  group: 2,
  layer: "brand",
  status: "review",
  version: "1.0.0",
  summary:
    "Capsules for decisions, text buttons for lesser actions. At most one filled button per screen.",
  anatomy: [
    "Filled and tinted: 50 pt capsules in headline type, 20 pt side padding",
    "Plain and destructive: text buttons, 44 pt tall (48 dp on Android), in accentText or danger",
    "Loading keeps the words for screen readers and the width, and shows the turning arc instead",
    "Disabled: system fill and ink3; it stays focusable so its words can still be read",
    "Full width for the one primary action at the bottom of a screen",
  ],
  tokens: [
    "shape.buttonHeight",
    "shape.textButtonHeight",
    "color.accent",
    "color.onAccent",
    "color.accentTint",
    "color.accentText",
    "color.danger",
    "color.fill",
    "color.ink3",
    "type.headline",
    "motion.pressScale.button",
    "motion.pressDown",
    "motion.spring.press",
    "motion.waiting",
    "motion.dim",
  ],
  states: ["filled", "tinted", "plain", "destructive", "pressed", "disabled", "loading"],
  accessibility: [
    "A native button named by its words",
    "Loading is aria-busy and ignores presses; disabled is aria-disabled and stays focusable",
    "Every label passes 4.5:1 on its fill or background in both themes (tested pairs)",
    "Targets: capsules are 50 pt tall; text buttons meet 44 pt on iOS and 48 dp on Android",
    "Long labels wrap and the button grows; nothing truncates",
  ],
  motion: [
    "Touch down: scales to 0.97 over 100 ms, ease-out; release with spring.press",
    "Reduce Motion: dims to 60% instead of scaling",
    "Loading: the arc turns once every 1.2 s, and holds still with Reduce Motion",
  ],
  native: {
    ios: "SwiftUI Button with a custom ButtonStyle: Capsule() fill at shape.buttonHeight for filled (accent) and tinted (accentTint), plain text for plain and destructive (role: .destructive, danger); configuration.isPressed scales to motion.pressScale.button with spring.press; loading overlays the waiting arc and keeps the frame",
    android:
      "Button and FilledTonalButton with CircleShape at shape.buttonHeight, TextButton for plain and destructive (danger), colors from tokens; loading overlays the waiting arc and keeps the width; minimumInteractiveComponentSize() keeps 48 dp",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: filled, tinted, plain and destructive; disabled and loading.",
    },
  ],
};
