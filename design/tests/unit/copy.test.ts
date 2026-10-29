import { describe, expect, test } from "vitest";
import { allCopy } from "@prototype/copy";
import { strings as camera } from "@prototype/copy/camera";
import { strings as home } from "@prototype/copy/home";
import { cameraStatusText } from "@prototype/copy/plural";
import { strings as session } from "@prototype/copy/session";
import { strings as settings } from "@prototype/copy/settings";
import { hostLabel, recipientLabel, withRetry } from "@prototype/model/photos";
import type { HostPhoto, HostStage, RecipientPhoto, RecipientStage } from "@prototype/model/types";

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

describe("copy review: what happens, precisely (deferred minors, 29 October 2026)", () => {
  const module = (name: string) => {
    const found = allCopy.find((c) => c.module === name);
    if (!found) throw new Error(`no copy module ${name}`);
    return found;
  };

  test("each photo's status words are copy, and every one is a promise (R5, Appendix C)", () => {
    const status = module("status");
    expect([...status.trust].sort()).toEqual(Object.keys(status.strings).sort());
    const words = texts(status.strings).map(([, text]) => text);
    const net = { network: "online", connection: "wifi", wifiOnly: false } as const;
    const host: HostStage[] = ["preparing", "prepared", "uploaded", "delivered", "expired"];
    for (const stage of [...host, "canceled" as const]) {
      const photo = { stage } as HostPhoto;
      expect(words, stage).toContain(hostLabel(photo, net, "Sarah"));
      expect(words, stage).toContain(hostLabel(photo, { ...net, network: "offline" }, "Sarah"));
    }
    expect(words).toContain(
      hostLabel(
        { stage: "reserved" } as HostPhoto,
        { ...net, wifiOnly: true, connection: "cellular" },
        "Sarah",
      ),
    );
    const recipient: RecipientStage[] = [
      "arriving",
      "stored",
      "exportPending",
      "saved",
      "exportUncertain",
      "actionRequired",
      "expired",
      "canceled",
    ];
    for (const stage of recipient)
      expect(words, stage).toContain(recipientLabel({ stage } as RecipientPhoto));
    expect(withRetry("Sending", true)).toBe(`Sending · ${String(status.strings.willRetry)}`);
    expect(
      cameraStatusText({ sent: 1, sending: 1, preparing: 1, waitingInternet: 1, waitingWifi: 1 }),
    ).toBe("1 sent · 1 sending · 1 preparing · 1 waiting for internet · 1 waiting for Wi-Fi");
  });

  test("the six words say what the other phone shows, so they are a promise (§11)", () => {
    expect(module("connect").trust).toContain("words");
  });

  test("auto-save says where photos go, without promising each save at once", () => {
    expect(settings.autoSaveOn).toMatch(/to Photos/);
    expect(settings.autoSaveOn).not.toMatch(/as they arrive/);
  });

  test("the last photo's note doesn't sound as if the photo leaves the phone (doc 03)", () => {
    expect(camera.lastPhotoNote).not.toMatch(/\bgoes\b|\bgone\b|deleted/);
    expect(camera.lastPhotoNote).toMatch(/shown here, until you leave the camera/);
  });

  test("with Photos access off, Home never says photos already received will be saved", () => {
    const on = home.accessBody(true);
    const off = home.accessBody(false);
    for (const body of [on, off]) expect(body).not.toMatch(/until you turn it on/);
    // With Save to Photos on, only new photos save themselves; with it off, saving is a choice.
    expect(on).toMatch(/save new ones to Photos/);
    expect(off).not.toMatch(/new ones/);
  });

  test("canceling says photos already on their way may still arrive (doc 06)", () => {
    expect(session.cancelMessage(2, "Sarah", 1)).toBe(
      "2 photos won’t be sent. Photos already sent may still arrive. Photos already received stay on Sarah’s phone.",
    );
    expect(session.cancelMessage(1, "Sarah", 0)).toBe(
      "1 photo won’t be sent. Photos already received stay on Sarah’s phone.",
    );
  });
});
