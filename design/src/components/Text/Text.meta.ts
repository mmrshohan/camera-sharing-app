import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "text",
  name: "Text",
  group: 1,
  layer: "system",
  status: "final",
  version: "1.0.0",
  summary:
    "Every word in the app, in the platform's own typeface and scale: SF Pro with Dynamic Type on iOS, Roboto with font scale on Android.",
  anatomy: [
    "Ten styles: numeral, largeTitle, title2, title3, headline, body, subheadline, footnote, label, ringLabel",
    "Four tones: ink, ink2 for second lines, accentText for text buttons and links, danger for destructive words",
    "Never truncates: long words wrap and rows stack at large sizes",
  ],
  tokens: ["type.*", "color.ink", "color.ink2", "color.accentText", "color.danger"],
  states: [
    "numeral",
    "largeTitle",
    "title2",
    "title3",
    "headline",
    "body",
    "subheadline",
    "footnote",
    "label",
    "ringLabel",
  ],
  accessibility: [
    "Scales to AX5 on iOS and 200% on Android; only the numeral stays fixed, because it is already large",
    "Nothing smaller than 13 pt on iOS or 14 sp on Android",
    "Headings render as h1–h3 so screen readers can move by heading",
    "Every tone passes 4.5:1 on background and surface in both themes (see the Guideline's color table)",
  ],
  motion: [],
  native: {
    ios: "SwiftUI Text with the matching text style so Dynamic Type applies: .largeTitle.bold(), .title2.bold(), .title3.weight(.semibold), .headline, .body, .subheadline, .footnote; label is .footnote.weight(.semibold), ringLabel .subheadline.weight(.semibold); the numeral is .system(size: 80, weight: .bold).monospacedDigit() and does not scale",
    android:
      "Compose Text with one TextStyle per style in sp, so font scale applies (Roboto; Medium where iOS uses Semibold); the numeral converts 80.dp with LocalDensity so it stays fixed",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    { version: "1.0.0", date: "2026-10-29", summary: "First version: ten styles and four tones." },
  ],
};
