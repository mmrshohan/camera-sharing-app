import { describe, expect, test } from "vitest";
import { people, samples } from "@prototype/model/fixtures";
import { hostLabel, recipientLabel, withRetry, type HostNetwork } from "@prototype/model/photos";
import { countKey, tileStatus } from "@prototype/model/selectors";
import type { HostPhoto, HostStage, RecipientLabel, RecipientStage } from "@prototype/model/types";

const online: HostNetwork = { network: "online", connection: "wifi", wifiOnly: false };
const offline: HostNetwork = { network: "offline", connection: "cellular", wifiOnly: false };
const cellularWifiOnly: HostNetwork = { network: "online", connection: "cellular", wifiOnly: true };

const host = (stage: HostStage): HostPhoto => ({
  id: "p1",
  sessionId: "s1",
  stage,
  reserved: false,
  retry: false,
  capturedAt: 0,
  stageAt: 0,
  reservedAt: null,
  expiresAt: 0,
  sample: "coast-01",
});

describe("what Alex's phone says (Appendix C)", () => {
  test("a photo being prepared says Preparing", () => {
    expect(hostLabel(host("preparing"), online, "Sarah")).toBe("Preparing");
  });

  test("a prepared photo with no internet is waiting for internet", () => {
    expect(hostLabel(host("prepared"), offline, "Sarah")).toBe("Waiting for internet");
  });

  test("a prepared photo on cellular with Wi-Fi only is waiting for Wi-Fi (R9, D10)", () => {
    expect(hostLabel(host("prepared"), cellularWifiOnly, "Sarah")).toBe("Waiting for Wi-Fi");
  });

  test("reserved and uploading photos are sending", () => {
    expect(hostLabel(host("reserved"), online, "Sarah")).toBe("Sending");
    expect(hostLabel(host("uploading"), online, "Sarah")).toBe("Sending");
  });

  test("a photo that loses its connection mid-upload waits; it is never still 'Sending'", () => {
    expect(hostLabel(host("uploading"), offline, "Sarah")).toBe("Waiting for internet");
    expect(hostLabel(host("uploading"), cellularWifiOnly, "Sarah")).toBe("Waiting for Wi-Fi");
  });

  test("an uploaded photo is ready for the recipient, by name", () => {
    expect(hostLabel(host("uploaded"), online, "Sarah")).toBe("Ready for Sarah");
    expect(hostLabel(host("uploaded"), offline, "Maya")).toBe("Ready for Maya");
  });

  test("delivered, expired and canceled photos say so", () => {
    expect(hostLabel(host("delivered"), online, "Sarah")).toBe("Delivered");
    expect(hostLabel(host("expired"), online, "Sarah")).toBe("Expired");
    expect(hostLabel(host("canceled"), online, "Sarah")).toBe("Canceled");
  });
});

describe("what Sarah's phone says (Appendix C)", () => {
  const rows: [RecipientStage, RecipientLabel][] = [
    ["arriving", "Arriving"],
    ["stored", "Only in this app"],
    ["exportPending", "Saving to Photos"],
    ["saved", "Saved to Photos"],
    ["exportUncertain", "Photos save needs checking"],
    ["actionRequired", "Photos save needs checking"],
    ["expired", "Expired, never arrived"],
    ["canceled", "Canceled before arrival"],
  ];
  test.each(rows)("%s says “%s”", (stage, label) => {
    expect(
      recipientLabel({
        id: "p1",
        sessionId: "s1",
        fromName: "Alex",
        stage,
        progress: 0,
        retry: false,
        arrivedAt: 0,
        stageAt: 0,
        sample: "coast-01",
      }),
    ).toBe(label);
  });
});

test("a retry marker adds “Will retry” to any state, on both phones", () => {
  expect(withRetry("Sending", true)).toBe("Sending · Will retry");
  expect(withRetry("Photos save needs checking", true)).toBe(
    "Photos save needs checking · Will retry",
  );
  expect(withRetry("Sending", false)).toBe("Sending");
});

describe("fixtures", () => {
  test("12 samples, all different crops of the one sample image", () => {
    const all = Object.values(samples);
    expect(all).toHaveLength(12);
    for (const sample of all) expect(sample.src).toBe("/images/coast.jpg");
    expect(new Set(all.map((s) => s.position)).size).toBe(12);
  });

  test("everyone's exact phone", () => {
    expect(people.alex).toMatchObject({ name: "Alex", device: "iPhone 16 Pro" });
    expect(people.sarah).toMatchObject({ name: "Sarah", device: "Galaxy A15" });
    expect(people.maya).toMatchObject({ name: "Maya", device: "iPhone 13" });
  });
});

describe("selectors", () => {
  test("each of Sarah's photos shows its tile; canceled ones never arrived, like expired", () => {
    expect(tileStatus("arriving")).toBe("arriving");
    expect(tileStatus("stored")).toBe("onlyInApp");
    expect(tileStatus("exportPending")).toBe("saving");
    expect(tileStatus("saved")).toBe("saved");
    expect(tileStatus("exportUncertain")).toBe("needsChecking");
    expect(tileStatus("actionRequired")).toBe("needsChecking");
    expect(tileStatus("expired")).toBe("expired");
    expect(tileStatus("canceled")).toBe("expired");
  });

  test("Alex's counts: ready and delivered are sent; expired and canceled aren't counted", () => {
    expect(countKey("Preparing")).toBe("preparing");
    expect(countKey("Waiting for internet")).toBe("waitingInternet");
    expect(countKey("Waiting for Wi-Fi")).toBe("waitingWifi");
    expect(countKey("Sending")).toBe("sending");
    expect(countKey("Ready for Sarah")).toBe("sent");
    expect(countKey("Delivered")).toBe("sent");
    expect(countKey("Expired")).toBeNull();
    expect(countKey("Canceled")).toBeNull();
  });
});
