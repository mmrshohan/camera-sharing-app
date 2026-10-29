import { describe, expect, test } from "vitest";
import { allCopy } from "@prototype/copy";

/** Every string a module can produce, calling functions with sample names and counts. */
function texts(strings: Record<string, unknown>): [key: string, text: string][] {
  const walk = (key: string, value: unknown): [string, string][] => {
    if (typeof value === "string") return [[key, value]];
    if (typeof value === "function") {
      return [
        [key, String(value("Sarah", 2, "Sunday 9:41 AM"))],
        [key, String(value(1, "Alex", "Sunday 9:41 AM"))],
      ];
    }
    if (Array.isArray(value)) return value.flatMap((item, i) => walk(`${key}.${i}`, item));
    if (value !== null && typeof value === "object") {
      return Object.entries(value).flatMap(([k, v]) => walk(`${key}.${k}`, v));
    }
    return [];
  };
  return Object.entries(strings).flatMap(([key, value]) => walk(key, value));
}

describe("prototype copy (spec §11)", () => {
  test("every screen's copy is registered", () => {
    expect(allCopy.map((c) => c.module)).toEqual(
      expect.arrayContaining([
        "welcome",
        "username",
        "home",
        "invitation",
        "scanner",
        "connect",
        "permissions",
      ]),
    );
  });

  test.each(allCopy.map((c) => [c.module, c] as const))(
    "%s: no review words on the phone (D18), and no exclamation marks",
    (_, { strings }) => {
      for (const [key, text] of texts(strings)) {
        expect(text, key).not.toMatch(/prototype|simulated|sample|demo/i);
        expect(text, key).not.toContain("!");
        expect(text.trim(), key).not.toBe("");
      }
    },
  );

  test.each(allCopy.map((c) => [c.module, c] as const))(
    "%s: every trust-sensitive key exists",
    (_, c) => {
      for (const key of c.trust) expect(Object.keys(c.strings), key).toContain(key);
    },
  );
});
