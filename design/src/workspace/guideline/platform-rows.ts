// The platform table from the design document (§6 workspace, §7.9 platform fidelity).
export interface PlatformRow {
  element: string;
  ios: string;
  android: string;
}

export const platformRows: PlatformRow[] = [
  {
    element: "Typeface",
    ios: "SF Pro, Dynamic Type to AX5",
    android: "Roboto, font scale to 200%",
  },
  { element: "Icons", ios: "SF Symbols", android: "Material Symbols Rounded" },
  { element: "Margins · targets", ios: "20 pt · 44 pt", android: "16 dp · 48 dp" },
  {
    element: "Panels",
    ios: "System sheet with detents and grabber",
    android: "Modal bottom sheet with drag handle",
  },
  { element: "Back", ios: "Edge swipe, chevron", android: "Predictive back gesture, arrow" },
  {
    element: "Floating controls",
    ios: "Liquid Glass material",
    android: "Solid tonal surface (no blur, cheaper on budget phones)",
  },
  {
    element: "Photos arriving, app closed",
    ios: "Live Activity on the Lock Screen and Dynamic Island",
    android: "Ongoing progress notification (Live Update on Android 16+)",
  },
  {
    element: "Owner lock",
    ios: "Face ID, Touch ID or passcode",
    android: "BiometricPrompt or screen lock",
  },
  {
    element: "Save to gallery",
    ios: "Photos add-only access",
    android: "MediaStore insert, no read permission",
  },
  {
    element: "Haptics",
    ios: "Light impact on capture and connect",
    android: "CONFIRM haptic on capture and connect",
  },
  {
    element: "Budget phones",
    ios: "—",
    android: "Develop effect becomes a fade below 4 GB RAM; thumbnails decode at screen size",
  },
];

export interface Layer {
  title: string;
  summary: string;
  components: string[];
}

export const layers: Layer[] = [
  {
    title: "Brand layer",
    summary: "Our own components, identical on both platforms. Points on iOS equal dp on Android.",
    components: [
      "RingButton",
      "Shutter",
      "ProgressRing",
      "LiveDot",
      "StatusLabel",
      "Numeral",
      "Button",
      "InlineMessage",
      "Toast",
      "EmptyState",
      "Avatar",
      "PersonPair",
      "VerificationWords",
      "InvitationCode",
      "Viewfinder",
      "DestinationPill",
      "ZoomControl",
      "LastShotWell",
      "CameraStatusLine",
      "PhotoTile",
      "PhotoGrid",
      "PhotoViewer",
    ],
  },
  {
    title: "System layer",
    summary:
      "Each platform's own components, themed with our tokens. They keep platform metrics, so engineers reuse SwiftUI and Compose defaults.",
    components: [
      "TopBar",
      "Panel",
      "ConfirmDialog",
      "Toggle",
      "TextField",
      "ListRow",
      "GroupedList",
      "ChoiceChips",
      "Keyboard",
      "PermissionPrompt",
      "StatusBar",
      "LiveActivity",
      "ProgressNotification",
    ],
  },
];
