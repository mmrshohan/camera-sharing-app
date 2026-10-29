import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  androidLargestSp,
  contrastRatio,
  springToMotion,
  tokens,
  type ColorName,
  type LabelKind,
  type Theme,
} from "@tokens";
import contrastPairs from "../../tokens/contrast-pairs.json";

const themes: Theme[] = ["light", "dark"];

function resolve(ref: string, theme: Theme): string {
  if (ref.startsWith("#")) return ref;
  const [group, name, part] = ref.split(".");
  if (group === "color") return tokens.color[theme][name as ColorName];
  if (group === "label") return tokens.label[theme][name as LabelKind][part as "fg" | "bg"];
  throw new Error(`Unknown token reference ${ref}`);
}

describe("contrastRatio", () => {
  it("measures white on the accent at 4.70:1", () => {
    expect(contrastRatio("#FFFFFF", "#0071E3")).toBeCloseTo(4.7, 2);
  });

  it("shows why iOS's default blue was not chosen (4.02:1)", () => {
    expect(contrastRatio("#FFFFFF", "#007AFF")).toBeCloseTo(4.02, 2);
  });
});

describe("springToMotion", () => {
  it("converts an Apple spring into stiffness and damping", () => {
    const spring = springToMotion({ response: 0.3, dampingFraction: 0.7 });
    expect(spring.type).toBe("spring");
    expect(spring.mass).toBe(1);
    expect(spring.stiffness).toBeCloseTo(438.65, 1);
    expect(spring.damping).toBeCloseTo(29.32, 1);
  });
});

describe("androidLargestSp (AOSP scale 2.0)", () => {
  it.each([
    [8, 16],
    [14, 26],
    [16, 28],
    [100, 100],
  ])("maps %i sp to %i dp", (sp, dp) => {
    expect(androidLargestSp(sp)).toBe(dp);
  });

  it("interpolates between table points", () => {
    expect(androidLargestSp(32)).toBeCloseTo(39.77, 2);
  });
});

describe("tokens", () => {
  it("carries each color's documented use from the token source", () => {
    expect(tokens.colorUse.accent).toContain("Filled buttons");
    expect(Object.keys(tokens.colorUse).sort()).toEqual(Object.keys(tokens.color.light).sort());
  });

  it("has the approved accent and dark-mode link color", () => {
    expect(tokens.color.light.accent).toBe("#0071E3");
    expect(tokens.color.dark.accentText).toBe("#2997FF");
  });

  it("uses Apple's AX5 sizes for the largest iOS text", () => {
    expect(tokens.type.ios.largest.body).toMatchObject({ size: 53, line: 62 });
    expect(tokens.type.ios.largest.title3).toMatchObject({ size: 55, line: 65 });
    expect(tokens.type.ios.largest.numeral).toMatchObject({ size: 80, line: 80 });
  });

  it("derives the largest Android text from the AOSP curve", () => {
    expect(tokens.type.android.default.body).toMatchObject({ size: 16, line: 24 });
    expect(tokens.type.android.largest.body).toMatchObject({ size: 28, line: 36 });
  });

  it("sets the ring's label gap and the waiting arc", () => {
    expect(tokens.shape.ringLabelGap).toBe(9);
    expect(tokens.motion.waiting).toEqual({ arc: 0.25, periodMs: 1200 });
  });

  it("has one dim level: a press under Reduce Motion, a preparing shutter", () => {
    expect(tokens.motion.dim).toBe(0.6);
  });

  it("gives system components each platform's own metrics", () => {
    expect(tokens.system.fieldHeight).toEqual({ ios: 50, android: 56 });
    expect(tokens.system.fieldRadius).toEqual({ ios: 12, android: 4 });
    expect(tokens.system.switchWidth).toEqual({ ios: 51, android: 52 });
    expect(tokens.system.switchThumbOn).toEqual({ ios: 27, android: 24 });
    expect(tokens.system.chipHeight).toEqual({ ios: 36, android: 32 });
    expect(tokens.system.rowHeight).toEqual({ ios: 44, android: 56 });
    expect(tokens.system.barHeight).toEqual({ ios: 44, android: 64 });
  });

  it("sizes icons by context: rows, bars, chips and rings", () => {
    expect(tokens.shape).toMatchObject({ iconRow: 22, iconBar: 24, iconChip: 18, ringIcon: 28 });
  });

  it("has panel, handle and dialog metrics per platform, and the dismiss thresholds", () => {
    expect(tokens.system.panelRadius).toEqual({ ios: 38, android: 28 });
    expect(tokens.system.handleWidth).toEqual({ ios: 36, android: 32 });
    expect(tokens.system.dialogRadius).toEqual({ ios: 14, android: 28 });
    expect(tokens.motion.dismiss).toEqual({ distance: 76, velocity: 0.45 });
    expect(tokens.color.light.scrim).toBe("rgba(0, 0, 0, 0.4)");
  });

  it("keeps one source per value: platform radii live only in system", () => {
    expect(Object.keys(tokens.shape)).not.toContain("radiusPanel");
    expect(Object.keys(tokens.shape)).not.toContain("radiusField");
  });

  it("has iOS's system fill and a shadow for raised controls", () => {
    expect(tokens.color.light.fill).toBe("rgba(120, 120, 128, 0.2)");
    expect(tokens.color.dark.fill).toBe("rgba(120, 120, 128, 0.36)");
    expect(tokens.color.light.shadow).toBe("rgba(0, 0, 0, 0.15)");
  });

  it("keeps the minimum text sizes (13 pt iOS, 14 sp Android)", () => {
    for (const spec of Object.values(tokens.type.ios.default)) {
      expect(spec.size).toBeGreaterThanOrEqual(13);
    }
    for (const spec of Object.values(tokens.type.android.default)) {
      expect(spec.size).toBeGreaterThanOrEqual(14);
    }
  });
});

describe("contrast pairs", () => {
  for (const pair of contrastPairs.pairs) {
    for (const theme of themes) {
      it(`${pair.fg} on ${pair.bg} meets ${pair.min}:1 in ${theme}`, () => {
        const ratio = contrastRatio(resolve(pair.fg, theme), resolve(pair.bg, theme));
        expect(ratio).toBeGreaterThanOrEqual(pair.min);
      });
    }
  }

  it("forbids secondary text on the accent tint (4.45:1 fails)", () => {
    expect(contrastRatio(tokens.color.light.ink2, tokens.color.light.accentTint)).toBeLessThan(4.5);
  });
});

describe("generated CSS", () => {
  const css = readFileSync(
    new URL("../../src/tokens/generated/tokens.css", import.meta.url),
    "utf8",
  );

  it("defines the accent", () => {
    expect(css).toContain("--color-accent: #0071E3;");
  });

  it("has a dark block with the dark link color", () => {
    const dark = css.slice(css.indexOf('[data-theme="dark"]'));
    expect(dark).toContain("--color-accent-text: #2997FF;");
  });

  it("exposes the ring label gap, waiting arc, dim level and camera white", () => {
    expect(css).toContain("--color-on-camera: #FFFFFF;");
    expect(css).toContain("--ring-label-gap: 9px;");
    expect(css).toContain("--motion-waiting-duration: 1200ms;");
    expect(css).toContain("--motion-waiting-arc: 0.25;");
    expect(css).toContain("--motion-dim: 0.6;");
  });

  it("switches system metrics with the platform", () => {
    const ios = css.slice(css.indexOf('[data-platform="ios"] {'));
    const android = css.slice(css.indexOf('[data-platform="android"] {'));
    expect(ios).toContain("--switch-width: 51px;");
    expect(android).toContain("--switch-width: 52px;");
    expect(android).toContain("--field-height: 56px;");
    expect(android).toContain("--field-radius: 4px;");
  });

  it("has platform and largest-text blocks", () => {
    expect(css).toContain('[data-platform="android"]');
    expect(css).toContain('[data-platform="ios"][data-text-size="largest"]');
  });
});
