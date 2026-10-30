import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "permission-prompt",
  name: "PermissionPrompt",
  group: 4,
  layer: "system",
  status: "final",
  version: "1.0.0",
  summary:
    "The system's permission prompt in each platform's own words, so screens show exactly what people will see.",
  anatomy: [
    "iOS: the system alert. The title names the app in quotes, the purpose string sits below, Don’t Allow and Allow side by side",
    "iOS notifications: the system writes the message itself; apps can't add a purpose",
    "Android: the permission dialog. An icon, the question with the app's name in bold, the answers stacked in one rounded group, Don’t allow last",
    "Android never asks to save photos: MediaStore needs no permission, so rendering that prompt is a development error",
  ],
  tokens: [
    "system.dialogWidth",
    "system.dialogRadius",
    "color.elevated",
    "color.scrim",
    "color.accentText",
    "color.accentTint",
    "shape.radiusCard",
    "shape.iconBar",
    "type.headline",
    "type.footnote",
    "type.title3",
    "type.label",
    "motion.fadeMs",
  ],
  states: ["camera", "photosAddOnly", "notifications"],
  accessibility: [
    "role=alertdialog, named by its title",
    "Focus starts on the refusal, the safe answer (D8), stays inside, and returns to the opener on close (D12)",
    "Escape answers no, as dismissing the real prompt does",
    "Answers pass 4.5:1 on their backgrounds in both themes (tested pairs)",
  ],
  motion: ["Fades in and out over motion.fadeMs; the same with Reduce Motion"],
  native: {
    ios: "Drawn by the system, not the app: AVCaptureDevice.requestAccess(for: .video), PHPhotoLibrary.requestAuthorization(for: .addOnly) and UNUserNotificationCenter.requestAuthorization(options:). Purpose strings live in Info.plist as NSCameraUsageDescription and NSPhotoLibraryAddUsageDescription",
    android:
      "Drawn by the system, not the app: ActivityResultContracts.RequestPermission() with Manifest.permission.CAMERA, and POST_NOTIFICATIONS on Android 13 and later. Saving photos through MediaStore asks nothing",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: camera, Photos and notification prompts on both platforms.",
    },
  ],
};
