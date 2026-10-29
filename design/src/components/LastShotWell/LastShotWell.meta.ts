import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "last-shot-well",
  name: "LastShotWell",
  group: 3,
  layer: "brand",
  status: "review",
  version: "1.0.0",
  summary: "The last photo, beside the shutter. A new one drops in after each capture.",
  anatomy: [
    "A 48 pt rounded square with the thumbnail radius",
    "Empty before the first photo, holding its place so nothing shifts",
    "Tap it to open the last photo",
  ],
  tokens: [
    "shape.wellSize",
    "shape.radiusThumb",
    "color.cameraScrim",
    "color.cameraScrimSelected",
    "motion.spring.drop",
    "motion.fadeMs",
  ],
  states: ["empty", "last photo", "drop"],
  accessibility: [
    "A button named “Open the last photo” when there is one; nothing to focus while empty",
    "The image inside is decorative; the name says what the button does",
  ],
  motion: [
    "A new photo drops in from 1.5× and 24 pt above on spring.drop (response 0.42 s, damping fraction 0.86)",
    "Coming back to the camera shows the last photo in place, without the drop",
    "Reduce Motion: it fades in",
  ],
  native: {
    ios: "A Button with the thumbnail (.resizable().scaledToFill()) clipped to RoundedRectangle(cornerRadius: shape.radiusThumb), animated with spring.drop; cleared when the app goes to the background (memory only)",
    android:
      "A clickable Box with the thumbnail clipped to RoundedCornerShape(shape.radiusThumb); scale and offset animate with spring.drop",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version." }],
};
