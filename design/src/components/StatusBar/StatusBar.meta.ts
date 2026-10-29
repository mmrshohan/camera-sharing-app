import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "status-bar",
  name: "StatusBar",
  group: 4,
  layer: "system",
  status: "final",
  version: "1.0.0",
  summary: "The phone's status bar at 9:41, drawn the way each platform draws it.",
  anatomy: [
    "iPhones with an island: the clock in the left ear; signal, Wi-Fi and battery in the right",
    "iPhone SE: the clock in the middle",
    "Android: the clock at the start; Wi-Fi, signal and battery at the end",
    "Fixed system text: it does not grow with the text size",
    'Over the camera or a photo, screens ask for light glyphs (data-status-bar="light")',
  ],
  tokens: ["system.statusBarText", "color.ink", "color.onCamera"],
  states: ["iPhone with island", "iPhone SE", "Android"],
  accessibility: ["Decoration only, hidden from screen readers"],
  motion: [],
  native: {
    ios: "Drawn by the system; screens choose light content over the camera and photos (.toolbarColorScheme(.dark, for: .navigationBar) or the hosting controller's preferredStatusBarStyle)",
    android:
      "Drawn by the system; screens set WindowInsetsControllerCompat.isAppearanceLightStatusBars per screen",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version." }],
};
