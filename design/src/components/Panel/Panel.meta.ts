import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "panel",
  name: "Panel",
  group: 3,
  layer: "system",
  status: "review",
  version: "1.0.0",
  summary:
    "A short task on top of the screen: the system sheet on iOS, Material's modal bottom sheet on Android.",
  anatomy: [
    "iOS: a 36 × 5 pt grabber, 38 pt top corners, the elevated background",
    "Android: a 32 × 4 dp drag handle with a 48 dp touch area, 28 dp corners, the surface color",
    "The title in title2; the content scrolls inside",
    "Medium detent is half the screen; large stops just below the status bar",
    "The screen behind dims to 40%",
  ],
  tokens: [
    "system.panelRadius",
    "system.handleWidth",
    "system.handleHeight",
    "color.elevated",
    "color.surface",
    "color.scrim",
    "color.ink3",
    "type.title2",
    "motion.spring.panel",
    "motion.dismiss",
    "motion.fadeMs",
  ],
  states: ["medium", "large", "dismissible", "not dismissible"],
  accessibility: [
    "A modal dialog named by its title; focus moves in when it opens and stays inside",
    "When it closes, focus returns to whatever opened it (D12)",
    "Escape, an outside tap or a drag down closes it, unless it needs an answer",
    "Focus inside shows the 2 pt accent ring",
  ],
  motion: [
    "Rises on spring.panel (response 0.42 s, damping fraction 0.9) while the screen dims over 200 ms",
    "Dragging the handle down more than 76 pt, or flinging faster than 0.45 pt per ms, closes it; otherwise it springs back",
    "Reduce Motion: it fades in and out instead of rising",
  ],
  native: {
    ios: ".sheet(isPresented:) with .presentationDetents([.medium, .large]), .presentationDragIndicator(.visible) and .interactiveDismissDisabled() when it needs an answer",
    android:
      "ModalBottomSheet(onDismissRequest, sheetState = rememberModalBottomSheetState(), dragHandle = { BottomSheetDefaults.DragHandle() }); confirmValueChange blocks dismissal when it needs an answer",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: medium and large, drag to dismiss, focus returns to the opener.",
    },
  ],
};
