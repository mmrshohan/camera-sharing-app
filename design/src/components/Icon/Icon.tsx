import { icons, materialPaths, type IconName, type IconSpec } from "@icons";
import type { Platform } from "@tokens";
import "./Icon.css";

export interface GlyphProps {
  glyph: string;
  filled?: boolean;
  size?: number;
  /** Gives the icon a name for screen readers. Without it the icon is decorative. */
  label?: string;
}

/** Draws one vendored Material Symbols Rounded glyph. Product UI uses <Icon>; system mockups use this. */
export function MaterialGlyph({ glyph, filled = false, size = 24, label }: GlyphProps) {
  const paths = materialPaths[glyph];
  if (!paths) throw new Error(`Glyph "${glyph}" is not vendored; add it to src/icons/registry.ts`);
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  return (
    <svg
      className="icon"
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      focusable="false"
      {...a11y}
    >
      <path d={filled ? paths.fill : paths.outline} fill="currentColor" />
    </svg>
  );
}

export interface IconProps {
  name: IconName;
  filled?: boolean;
  size?: number;
  label?: string;
  platform?: Platform;
}

/** A standard icon by meaning. On iOS it draws the glyph closest to the SF Symbol. */
export function Icon({ name, filled = false, size = 24, label, platform }: IconProps) {
  const spec: IconSpec = icons[name];
  const glyph = platform === "ios" && spec.iosGlyph ? spec.iosGlyph : spec.material;
  return label === undefined ? (
    <MaterialGlyph glyph={glyph} filled={filled} size={size} />
  ) : (
    <MaterialGlyph glyph={glyph} filled={filled} size={size} label={label} />
  );
}
