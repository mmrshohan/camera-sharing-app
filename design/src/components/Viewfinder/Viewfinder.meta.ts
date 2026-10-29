import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "viewfinder",
  name: "Viewfinder",
  group: 3,
  layer: "brand",
  status: "final",
  version: "1.0.0",
  summary:
    "The scanner: the camera's view with a frame for the code, and what is happening in words.",
  anatomy: [
    "Always dark, whatever the phone's appearance",
    "Four white corners frame where the code goes; they turn danger when a code is not an invitation",
    "A message on the camera scrim at the bottom; without a camera, the message takes the center",
  ],
  tokens: [
    "color.onCamera",
    "color.cameraScrim",
    "color.danger",
    "shape.shutterStroke",
    "shape.radiusCard",
    "type.subheadline",
  ],
  states: ["scanning", "invalid", "denied", "unavailable"],
  accessibility: [
    "The message is a status, announced politely when it changes",
    "Every state has words; the frame's color is never the only signal",
    "Denied and unavailable say why there is no camera; the screen offers the way forward",
  ],
  motion: ["None of its own: only the camera's view moves"],
  native: {
    ios: "The camera preview (for example DataScannerViewController recognizing QR codes) under an overlay of four corner paths and the message",
    android:
      "CameraX PreviewView with a barcode analyzer under a Canvas overlay of four corners and the message",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: scanning, invalid, denied and unavailable.",
    },
  ],
};
