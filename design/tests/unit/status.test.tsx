import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { InlineMessage } from "@components/InlineMessage";
import { Numeral } from "@components/Numeral";
import { StatusLabel } from "@components/StatusLabel";
import { Toast } from "@components/Toast";

const html = (node: React.ReactNode) => renderToStaticMarkup(<>{node}</>);

describe("Numeral", () => {
  test("reads as one phrase, with exactly one live dot", () => {
    const out = html(<Numeral value={14} caption="photos" detail="2 on the way" live />);
    expect(out).toContain('aria-label="14 photos, 2 on the way, live"');
    expect(out.match(/class="live-dot/g)).toHaveLength(1);
  });

  test("without live, there is no dot", () => {
    const out = html(<Numeral value={1} caption="photo" />);
    expect(out).toContain('aria-label="1 photo"');
    expect(out).not.toContain("live-dot");
  });
});

describe("StatusLabel", () => {
  test("takes its colors from the label tokens of its kind", () => {
    expect(html(<StatusLabel kind="saved">Saved to Photos</StatusLabel>)).toContain(
      "status-label--saved",
    );
    const css = readFileSync(
      new URL("../../src/components/StatusLabel/StatusLabel.css", import.meta.url),
      "utf8",
    );
    expect(css).toMatch(
      /\.status-label--saved \{\s*color: var\(--label-saved-fg\);\s*background: var\(--label-saved-bg\);/,
    );
  });

  test("always shows an icon with its words: the live dot for live", () => {
    expect(html(<StatusLabel kind="live">A session is on</StatusLabel>)).toContain(
      "live-dot--in-label",
    );
    expect(html(<StatusLabel kind="waiting">Paused, not lost</StatusLabel>)).toContain("<svg");
  });
});

describe("InlineMessage", () => {
  test("problems interrupt; other tones wait their turn", () => {
    expect(html(<InlineMessage tone="problem" title="Photos access is off" />)).toContain(
      'role="alert"',
    );
    expect(html(<InlineMessage tone="waiting" title="Waiting for internet" />)).toContain(
      'role="status"',
    );
  });
});

describe("Toast", () => {
  test("with no message it is hidden; with one it is a polite status", () => {
    expect(html(<Toast message={null} placement="aboveControls" />)).toContain("hidden");
    const out = html(<Toast message="Sent to Sarah" placement="aboveControls" />);
    expect(out).toContain('role="status"');
    expect(out).toContain("Sent to Sarah");
    expect(out).not.toContain("hidden");
  });
});
