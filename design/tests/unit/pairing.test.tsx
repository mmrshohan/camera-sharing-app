import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { InvitationCode } from "@components/InvitationCode";
import { PersonPair } from "@components/PersonPair";
import { VerificationWords } from "@components/VerificationWords";
import { Viewfinder } from "@components/Viewfinder";
import type { Words } from "@shared/types";

const html = (node: React.ReactNode) => renderToStaticMarkup(<>{node}</>);
const payload = "https://example.invalid/i/7KQ2-9XWD";
const code = (state: "active" | "expired" | "offline", secondsLeft: number | null) =>
  html(
    <InvitationCode
      payload={payload}
      handle="@sarah"
      device="Galaxy A15"
      state={state}
      secondsLeft={secondsLeft}
    />,
  );

describe("InvitationCode", () => {
  test("active: the QR code and a countdown", () => {
    const out = code("active", 95);
    expect(out).toContain('class="invitation__qr"');
    expect(out).toContain("1:35");
    expect(out).toContain("1 minute 35 seconds");
  });

  test("offline shows no code and no countdown (D19)", () => {
    const out = code("offline", 95);
    expect(out).not.toContain("invitation__qr");
    expect(out).not.toMatch(/\d:\d\d/);
    expect(out).not.toContain("Expires");
  });

  test("expired shows no code", () => {
    const out = code("expired", 0);
    expect(out).not.toContain("invitation__qr");
    expect(out).not.toMatch(/\d:\d\d/);
  });

  test("draws the QR as path data, never raw HTML", () => {
    const out = code("active", 95);
    expect(out).toMatch(
      /<svg[^>]*class="invitation__qr"[^>]*>(?:<title[^>]*>[^<]*<\/title>)?<path d="M/,
    );
  });
});

describe("VerificationWords", () => {
  test("shows six words in reading order, as a list", () => {
    const words: Words = ["maple", "river", "candle", "orbit", "velvet", "sparrow"];
    const out = html(
      <VerificationWords words={words} prompt="Check both phones show these words." />,
    );
    expect(out.match(/<li/g)).toHaveLength(6);
    const order = words.map((word) => out.indexOf(`>${word}<`));
    expect(order.every((at, i) => at > -1 && (i === 0 || at > (order[i - 1] ?? 0)))).toBe(true);
  });
});

describe("PersonPair", () => {
  test("names both people and the recipient's exact device", () => {
    const out = html(
      <PersonPair
        from={{ name: "Alex", handle: "@alex", device: "iPhone 16 Pro" }}
        to={{ name: "Sarah", handle: "@sarah", device: "Galaxy A15" }}
        fromTitle="Camera"
        toTitle="Photos go to"
      />,
    );
    for (const text of [
      "Camera",
      "Alex",
      "@alex",
      "Photos go to",
      "Sarah",
      "@sarah",
      "Galaxy A15",
    ]) {
      expect(out).toContain(text);
    }
  });
});

describe("Viewfinder", () => {
  test("says what is happening in words, in every state", () => {
    expect(html(<Viewfinder state="denied" />)).toContain("Camera access is off");
    expect(html(<Viewfinder state="invalid" />)).toContain('role="status"');
    expect(html(<Viewfinder state="scanning" />)).toContain("viewfinder__frame");
  });
});
