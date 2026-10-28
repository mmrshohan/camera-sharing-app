import { describe, expect, it } from "vitest";
import { findLiterals } from "../../scripts/check-literals.ts";

const count = (text: string, path = "src/components/X/X.css") => findLiterals(text, path).length;

describe("findLiterals", () => {
  it("flags a hex color", () => {
    expect(count("color: #0071E3;")).toBe(1);
  });

  it("allows a token color", () => {
    expect(count("color: var(--color-accent);")).toBe(0);
  });

  it("flags a literal font size", () => {
    expect(count("font-size: 17px")).toBe(1);
  });

  it("flags a literal duration in a transition", () => {
    expect(count("transition: opacity 200ms")).toBe(1);
  });

  it("allows a token duration in a transition", () => {
    expect(count("transition: opacity var(--motion-fade-duration)")).toBe(0);
  });

  it("flags a hex color inside a TSX style object", () => {
    expect(count("<div style={{ color: '#fff' }} />", "src/prototype/screens/Home.tsx")).toBe(1);
  });

  it("allows layout sizes", () => {
    expect(count("width: 72px")).toBe(0);
  });

  it("reports the line number of each match", () => {
    expect(findLiterals("a {}\nb { color: rgb(0, 0, 0); }", "x.css")).toEqual([
      { line: 2, match: "rgb(" },
    ]);
  });
});
