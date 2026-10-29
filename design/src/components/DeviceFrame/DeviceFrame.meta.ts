import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "device-frame",
  name: "DeviceFrame",
  group: 4,
  layer: "system",
  status: "review",
  version: "1.0.0",
  summary:
    "A phone at true size: its screen, status bar, cutout and bottom, with a keyboard that follows focus. Screens and the prototype render inside it.",
  anatomy: [
    "Four phones: iPhone 16 Pro, iPhone SE (3rd generation), Galaxy A15 and a compact 360 × 800 Android",
    "The screen carries the surface (platform, theme, text size, Reduce Motion, low memory) and the safe areas as --safe-top and --safe-bottom",
    "The keyboard rises while a text field has focus and goes down with its screen (D21)",
    "Derived or approximate values are listed per device",
  ],
  tokens: ["system.keyboardHeight", "color.deviceBody", "color.background"],
  states: ["iPhone 16 Pro", "iPhone SE", "Galaxy A15", "Compact Android", "keyboard"],
  accessibility: [
    "The frame is decoration; screen readers read only the screen's content",
    "The keyboard is a picture: type with the computer's keyboard",
    "--keyboard-inset (0 while the keyboard is down) lets screens keep fields and messages above the keyboard (D15)",
  ],
  motion: [],
  native: {
    ios: "Not built: it stands in for the phone. Engineers use the safe areas and keyboard behavior it documents",
    android:
      "Not built: it stands in for the phone. Engineers use the insets and keyboard behavior it documents",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: four phones and the keyboard.",
    },
  ],
};
