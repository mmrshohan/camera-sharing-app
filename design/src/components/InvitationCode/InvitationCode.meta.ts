import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "invitation-code",
  name: "InvitationCode",
  group: 3,
  layer: "brand",
  status: "review",
  version: "1.0.0",
  summary:
    "Sarah's invitation: a QR code that Alex scans, with a countdown only while it is active.",
  anatomy: [
    "A 200 pt QR code, dark on white in both themes, with a four-module quiet zone",
    "The handle in headline and the phone in subheadline below it",
    "“Expires in 1:35” in footnote with tabular figures, only while active (D19)",
    "Expired and offline keep the code's footprint and say why, with no code and no countdown",
  ],
  tokens: [
    "shape.qrSize",
    "shape.radiusCard",
    "color.background",
    "color.ink",
    "color.ink2",
    "color.surface",
    "type.headline",
    "type.subheadline",
    "type.footnote",
  ],
  states: ["active", "expired", "offline"],
  accessibility: [
    "The QR code is an image named “Invitation code for @sarah”; its payload never appears as text",
    "The countdown reads as “1 minute 35 seconds” and is not announced every second",
    "Expired and offline say what happened and what comes next",
  ],
  motion: ["The countdown ticks once a second; nothing else moves"],
  native: {
    ios: "CIFilter.qrCodeGenerator() with correction level M, scaled with .interpolation(.none) on a white tile in both appearances; TimelineView(.periodic(from: .now, by: 1)) for the countdown",
    android:
      "A QR bitmap from an encoder library, drawn without filtering on a white tile; a LaunchedEffect that ticks each second for the countdown",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: active, expired and offline; no countdown unless active.",
    },
  ],
};
