import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "photo-tile",
  name: "PhotoTile",
  group: 4,
  layer: "brand",
  status: "review",
  version: "1.0.0",
  summary:
    "One of Sarah's photos in the grid: square, never rounded, with its state in the corner. A new photo develops once when it arrives.",
  anatomy: [
    "Square and edge to edge: no corner radius, no border",
    "Arriving: blurred and pale, with a progress ring in the middle",
    "Only in this app: a neutral badge with the phone icon",
    "Saving: a progress ring in the corner",
    "Saved: nothing; it is simply a photo",
    "Needs checking: the attention icon in danger; expired: dimmed gray with the clock icon",
  ],
  tokens: [
    "shape.badgeSize",
    "shape.iconChip",
    "color.surface",
    "color.elevated",
    "label.neutral",
    "color.danger",
    "color.cameraScrim",
    "motion.develop",
    "motion.fadeMs",
    "motion.dim",
  ],
  states: ["arriving", "onlyInApp", "saving", "saved", "needsChecking", "expired", "develop"],
  accessibility: [
    "Named by its label and its state's words, such as “Photo 3, Photos save needs checking”; arriving and saving add the percentage",
    "A button when it opens the photo; otherwise an image",
    "State is never color alone: an icon or a ring, and words",
  ],
  motion: [
    "Develop: blur 16 → 0 and saturation 0.2 → 1 over 600 ms, cubic-bezier(0.22, 1, 0.36, 1), once per photo and never on scroll",
    "Reduce Motion, or a phone under 4 GB of memory: a 200 ms fade instead",
  ],
  native: {
    ios: "A square Image(.resizable().scaledToFill()) clipped without rounding; develop animates .blur(radius:) and .saturation() once with motion.develop; .accessibilityLabel(label + state words)",
    android:
      "A square image with Modifier.blur and a saturation ColorMatrix animated once with motion.develop (blur needs Android 12; older or low-memory phones fade); semantics contentDescription = label + state words",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: six states and the develop effect.",
    },
  ],
};
