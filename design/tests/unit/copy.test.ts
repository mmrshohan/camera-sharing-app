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

  test("no copy promises more than the product does (overclaim review, 29 October 2026)", () => {
    const overclaims = [
      /Everything (was|has been) delivered/, // R5: uploaded is not received
      /only during that session/, // R6, R7: photos keep going after it ends
      /Nothing (is saved|taken with)/, // absolute: a screenshot still saves one
      /deleted once they arrive/, // deletion is requested, and finishes later
      /every photo they take/, // photos can expire or be canceled
      /keep coming once/, // not once they expire
      /stay private/, // no blanket privacy guarantee
      /Only \w+ can unlock/, // anyone with the passcode can
      /better camera/, // the app never points at the gap (spec §4)
      /until you delete them\.$/, // deleting the app loses them too, and nothing is backed up
      /until you sign in again\./, // only on this phone, never on another
      /cleaned up when they next connect/, // deletion runs on the servers' schedule
    ];
    for (const { module, strings } of allCopy)
      for (const [key, text] of texts(strings))
        for (const claim of overclaims) expect(text, `${module}.${key}`).not.toMatch(claim);
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
