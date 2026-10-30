import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { LiveDot } from "@components/LiveDot";
import { ProgressRing } from "@components/ProgressRing";
import { Text } from "@components/Text";

const ring = (value: number) =>
  renderToStaticMarkup(<ProgressRing value={value} label="Photo 3" />);

describe("ProgressRing", () => {
  test("reports real progress as a percentage", () => {
    const html = ring(0.25);
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-label="Photo 3"');
    expect(html).toContain('aria-valuenow="25"');
  });

  test("clamps out-of-range and missing values instead of overstating", () => {
    expect(ring(1.4)).toContain('aria-valuenow="100"');
    expect(ring(-1)).toContain('aria-valuenow="0"');
    expect(ring(Number.NaN)).toContain('aria-valuenow="0"');
  });

  test("draws no arc at zero, so nothing implies progress before it happens", () => {
    expect(ring(0)).not.toContain("progress-ring__arc");
  });

  test("leaves a visible gap at 99%, never looking complete early", () => {
    expect(ring(0.99)).toContain('stroke-dasharray="99 100"');
  });
});

describe("LiveDot", () => {
  test("is an image named Live by default", () => {
    const html = renderToStaticMarkup(<LiveDot />);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Live"');
  });

  test("takes the smaller size inside a label", () => {
    expect(renderToStaticMarkup(<LiveDot size="inLabel" />)).toContain("live-dot--in-label");
  });
});

describe("Text", () => {
  test("styles through token classes, never inline sizes", () => {
    const html = renderToStaticMarkup(<Text style="footnote">Nothing is saved here.</Text>);
    expect(html).toContain("text--footnote");
    expect(html).not.toContain("font-size");
    expect(html).not.toContain("style=");
  });

  test("renders the requested element and tone", () => {
    const html = renderToStaticMarkup(
      <Text style="title2" as="h2" tone="ink2">
        Lend your camera?
      </Text>,
    );
    expect(html).toMatch(/^<h2 class="text text--title2 text--tone-ink2">/);
  });
});
