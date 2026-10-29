import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "keyboard",
  name: "Keyboard",
  group: 4,
  layer: "system",
  status: "final",
  version: "1.0.0",
  summary: "A picture of the platform's keyboard, so screens can be checked with the keyboard up.",
  anatomy: [
    "iOS: 291 pt plus the bottom inset; white keys with soft shadows on gray",
    "Android: 280 dp; Gboard's rounder, flat keys",
    "Letters, shift, delete, numbers, space and return",
  ],
  tokens: [
    "system.keyboardHeight",
    "system.keyHeight",
    "system.keyRadius",
    "system.keyText",
    "color.keyboard",
    "color.keyboardKey",
    "color.keyboardKeyAlt",
  ],
  states: ["iOS", "Android"],
  accessibility: [
    "Hidden from screen readers: it is a picture, and typing happens on the computer's keyboard",
    "Letters pass 4.5:1 on their keys in both themes (tested pairs)",
  ],
  motion: [],
  native: {
    ios: "The system keyboard; screens keep fields and messages above it with keyboardLayoutGuide or safeAreaInset (D15)",
    android:
      "The system keyboard; screens keep fields and messages above it with WindowInsets.ime (D15)",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version." }],
};
