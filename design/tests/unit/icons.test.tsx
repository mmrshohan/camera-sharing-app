import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Icon } from "@components/Icon";
import { icons, materialPaths, systemGlyphs, type IconName, type IconSpec } from "@icons";

const pathData = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/;

describe("icon registry", () => {
  const names = Object.keys(icons) as IconName[];

  it("covers the 30 meanings in the design document's Appendix B", () => {
    expect(names).toHaveLength(30);
  });

  it.each(names)("%s has outlined and filled paths for every glyph it draws", (name) => {
    const spec: IconSpec = icons[name];
    for (const glyph of [spec.material, spec.iosGlyph].filter(Boolean) as string[]) {
      const paths = materialPaths[glyph];
      expect(paths, glyph).toBeDefined();
      expect(paths!.outline).toMatch(pathData);
      expect(paths!.fill).toMatch(pathData);
    }
  });

  it("vendors the system glyphs used by status bars and keyboards", () => {
    for (const glyph of systemGlyphs) expect(materialPaths[glyph], glyph).toBeDefined();
  });

  it("records the SF Symbol for every icon", () => {
    expect(icons.lend.sf).toBe("camera");
    expect(icons.back.sf).toBe("chevron.left");
    expect(icons.unlock).toMatchObject({
      sf: "faceid",
      material: "fingerprint",
      iosGlyph: "lock_open",
    });
  });
});

describe("Icon", () => {
  it("is hidden from assistive technology by default", () => {
    const html = renderToStaticMarkup(<Icon name="lend" />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('viewBox="0 -960 960 960"');
  });

  it("becomes an image with a name when labelled", () => {
    const html = renderToStaticMarkup(<Icon name="lend" label="Camera" />);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Camera"');
    expect(html).not.toContain("aria-hidden");
  });

  it("draws the iOS glyph on iOS when one is set", () => {
    const ios = renderToStaticMarkup(<Icon name="back" platform="ios" />);
    const android = renderToStaticMarkup(<Icon name="back" platform="android" />);
    expect(ios).toContain(materialPaths.arrow_back_ios_new!.outline);
    expect(android).toContain(materialPaths.arrow_back!.outline);
  });

  it("uses the filled variant when asked", () => {
    const html = renderToStaticMarkup(<Icon name="lend" filled />);
    expect(html).toContain(materialPaths.photo_camera!.fill);
  });
});
