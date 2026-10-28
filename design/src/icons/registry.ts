// Standard icons only (design document §7.6, Appendix B). Native iOS uses the named SF Symbol;
// Android and this workspace draw the named Material Symbols Rounded glyph. SF Symbols artwork
// is never stored here because Apple's license does not allow publishing it in a public repo.

export interface IconSpec {
  /** SF Symbol name used by the native iOS app. */
  sf: string;
  /** Material Symbols Rounded glyph used on Android (and drawn on both platforms here). */
  material: string;
  /** A Material glyph that reads closer to the SF Symbol on iOS screens, when one exists. */
  iosGlyph?: string;
}

export const icons = {
  lend: { sf: "camera", material: "photo_camera" },
  borrow: { sf: "qrcode", material: "qr_code_2" },
  scan: { sf: "qrcode.viewfinder", material: "qr_code_scanner" },
  typeUsername: { sf: "at", material: "alternate_email" },
  photos: { sf: "photo.on.rectangle", material: "photo_library" },
  save: { sf: "square.and.arrow.down", material: "download" },
  sending: { sf: "arrow.up", material: "arrow_upward" },
  saved: { sf: "checkmark.circle", material: "check_circle" },
  waiting: { sf: "clock", material: "schedule" },
  offline: { sf: "wifi.slash", material: "wifi_off" },
  wifi: { sf: "wifi", material: "wifi" },
  attention: { sf: "exclamationmark.triangle", material: "warning" },
  lock: { sf: "lock", material: "lock" },
  // Face ID has no Material glyph; iOS screens draw an open lock instead.
  unlock: { sf: "faceid", material: "fingerprint", iosGlyph: "lock_open" },
  flashOn: { sf: "bolt", material: "flash_on" },
  flashOff: { sf: "bolt.slash", material: "flash_off" },
  flip: { sf: "arrow.triangle.2.circlepath.camera", material: "cameraswitch" },
  close: { sf: "xmark", material: "close" },
  back: { sf: "chevron.left", material: "arrow_back", iosGlyph: "arrow_back_ios_new" },
  open: { sf: "chevron.right", material: "chevron_right" },
  more: { sf: "ellipsis", material: "more_horiz" },
  delete: { sf: "trash", material: "delete" },
  account: { sf: "person.crop.circle", material: "account_circle" },
  devices: { sf: "iphone", material: "mobile" }, // Material renamed "smartphone" to "mobile"
  blocked: { sf: "nosign", material: "block" },
  privacy: { sf: "checkmark.shield", material: "verified_user" },
  help: { sf: "questionmark.circle", material: "help" },
  report: { sf: "flag", material: "flag" },
  storage: { sf: "internaldrive", material: "hard_drive" },
  signOut: { sf: "rectangle.portrait.and.arrow.right", material: "logout" },
} as const satisfies Record<string, IconSpec>;

export type IconName = keyof typeof icons;

/** Glyphs drawn inside system components and system-surface mockups (chip checkmarks, the Android
 * status bar, keyboards), not product icons. */
export const systemGlyphs = [
  "signal_cellular_alt",
  "battery_full",
  "shift",
  "backspace",
  "keyboard_return",
  "check",
] as const;

/** Every Material glyph the workspace draws; the vendoring script extracts exactly these. */
export function vendoredGlyphs(): string[] {
  const fromIcons = Object.values(icons).flatMap((spec: IconSpec) =>
    spec.iosGlyph ? [spec.material, spec.iosGlyph] : [spec.material],
  );
  return [...new Set([...fromIcons, ...systemGlyphs])].sort();
}
