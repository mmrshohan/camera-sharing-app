export interface Spring {
  response: number;
  dampingFraction: number;
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`contrastRatio expects #RRGGBB colors, got "${hex}"`);
  const value = parseInt(match[1]!, 16);
  const r = channel((value >> 16) & 0xff);
  const g = channel((value >> 8) & 0xff);
  const b = channel(value & 0xff);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two opaque #RRGGBB colors. */
export function contrastRatio(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/**
 * Converts Apple's spring(response:dampingFraction:) into the stiffness and damping that motion
 * (and Compose) use, with mass 1: stiffness = (2π / response)², damping = 4π × fraction / response.
 */
export function springToMotion(s: Spring): {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: 1;
} {
  const omega = (2 * Math.PI) / s.response;
  return {
    type: "spring",
    stiffness: omega * omega,
    damping: (4 * Math.PI * s.dampingFraction) / s.response,
    mass: 1,
  };
}
