import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { RingButton } from "@components/RingButton";
import { Shutter } from "@components/Shutter";
import { contrastRatio, tokens } from "@tokens";

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

describe("RingButton", () => {
  test("is a native button named by its visible label", () => {
    const html = renderToStaticMarkup(
      <RingButton variant="filled" icon="lend" label="Lend my camera" />,
    );
    expect(html).toMatch(/^<button type="button"/);
    expect(html).toContain(">Lend my camera<");
    expect(html).not.toContain("aria-label=");
  });

  test("waiting is busy, not disabled, and shows the moving arc", () => {
    const html = renderToStaticMarkup(
      <RingButton variant="filled" icon="lend" label="Waiting for Sarah" state="waiting" />,
    );
    expect(html).toContain('aria-busy="true"');
    expect(html).not.toContain("aria-disabled");
    expect(html).toContain("ring-button__arc");
  });

  test("unavailable is aria-disabled and describes why", () => {
    const html = renderToStaticMarkup(
      <RingButton
        variant="tinted"
        icon="borrow"
        label="Borrow a camera"
        state="unavailable"
        unavailableReason="Needs the internet"
      />,
    );
    expect(html).toContain('aria-disabled="true"');
    const id = /aria-describedby="([^"]+)"/.exec(html)?.[1] ?? "";
    expect(id).not.toBe("");
    expect(html).toMatch(new RegExp(`id="${escape(id)}"[^>]*>Needs the internet<`));
  });

  test("the accent ring meets 3:1 against the background in both themes", () => {
    for (const theme of ["light", "dark"] as const) {
      const { accent, background } = tokens.color[theme];
      expect(contrastRatio(accent, background)).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("Shutter", () => {
  test("names what it does", () => {
    const ready = renderToStaticMarkup(<Shutter state="ready" onCapture={() => {}} />);
    const preparing = renderToStaticMarkup(<Shutter state="preparing" onCapture={() => {}} />);
    expect(ready).toContain('aria-label="Take photo"');
    expect(preparing).toContain('aria-label="Preparing photo"');
    expect(preparing).toContain('aria-busy="true"');
  });

  test("blocked is never silently disabled: aria-disabled, its message part of its name (WCAG 2.5.3)", () => {
    const html = renderToStaticMarkup(
      <Shutter state="blocked" message="Waiting for internet" onCapture={() => {}} />,
    );
    expect(html).toContain('aria-disabled="true"');
    // The message is drawn inside the button, so its name must contain it, not only describe it.
    expect(html).toContain('aria-label="Take photo. Waiting for internet"');
    expect(html).toContain(">Waiting for internet<");
    expect(html).not.toContain("aria-describedby");
  });
});
