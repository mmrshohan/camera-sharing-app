import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "confirm-dialog",
  name: "ConfirmDialog",
  group: 3,
  layer: "system",
  status: "review",
  version: "1.0.0",
  summary:
    "Asks before something that matters. On iOS, destructive questions are an action sheet and others an alert; on Android, a Material alert dialog.",
  anatomy: [
    "iOS alert: 270 pt wide, centered, 14 pt corners; title in headline, message in footnote; two answers side by side",
    "iOS action sheet: at the bottom; the question and the destructive answer on one card, Cancel apart below",
    "Android: Material's alert dialog, 28 dp corners, text from the start, answers at the end",
    "The safe answer is emphasized; destructive answers are drawn in danger",
  ],
  tokens: [
    "system.dialogWidth",
    "system.dialogRadius",
    "color.elevated",
    "color.surface",
    "color.scrim",
    "color.accentText",
    "color.danger",
    "type.headline",
    "type.footnote",
    "motion.spring.panel",
    "motion.fadeMs",
  ],
  states: ["destructive", "not destructive"],
  accessibility: [
    "role=alertdialog, named by its title and described by its message",
    "Focus always starts on the safe answer (D8), stays inside, and returns to the opener on close (D12)",
    "Escape answers with the safe choice",
    "Focus inside shows the 2 pt accent ring; every answer passes 4.5:1 on its surface",
  ],
  motion: [
    "iOS action sheet rises on spring.panel; alerts and Material dialogs fade in over 200 ms",
    "Reduce Motion: everything fades",
  ],
  native: {
    ios: ".confirmationDialog(title, isPresented:) with a Button(role: .destructive) and Button(role: .cancel) for destructive questions; .alert(title, isPresented:) with a .cancel role otherwise. The system draws the current look and focuses the cancel answer",
    android:
      "AlertDialog(onDismissRequest = onCancel, title, text, dismissButton = TextButton(cancel), confirmButton = TextButton(confirm, colors in danger when destructive)); request focus on the dismiss button",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: action sheet, alert and Material dialog; focus starts safe.",
    },
  ],
};
