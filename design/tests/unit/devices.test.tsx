import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { DeviceFrame, devices } from "@components/DeviceFrame";

describe("devices", () => {
  test("the iPhone 16 Pro matches Apple's metrics (checked 28 October)", () => {
    expect(devices.iphone16pro).toMatchObject({
      width: 402,
      height: 874,
      safeTop: 62,
      safeBottom: 34,
    });
  });

  test("every approximate entry names one of the device's own fields", () => {
    for (const spec of Object.values(devices)) {
      for (const key of spec.approximate) expect(Object.keys(spec), spec.model).toContain(key);
    }
  });

  test("platforms and bottoms match the hardware", () => {
    expect(devices.galaxyA15.platform).toBe("android");
    expect(devices.androidCompact.platform).toBe("android");
    expect(devices.iphoneSE3).toMatchObject({
      platform: "ios",
      bottom: "homeButton",
      biometric: "touchId",
    });
  });

  test("only the budget compact Android is under 4 GB, so only it fades instead of developing", () => {
    const low = Object.values(devices)
      .filter((spec) => spec.memoryGb < 4)
      .map((spec) => spec.model);
    expect(low).toEqual(["androidCompact"]);
  });
});

describe("DeviceFrame", () => {
  const frame = (model: keyof typeof devices) =>
    renderToStaticMarkup(
      <DeviceFrame model={model} theme="dark" textSize="largest" reduceMotion>
        <p>Screen</p>
      </DeviceFrame>,
    );

  test("the keyboard inset has its own name, so the keyboardHeight token never shadows it", () => {
    const out = frame("iphone16pro");
    expect(out).toContain("--keyboard-inset:0px");
    expect(out).not.toContain("--keyboard-height:");
  });

  test("the screen carries the surface for every component inside", () => {
    const out = frame("galaxyA15");
    expect(out).toContain('data-platform="android"');
    expect(out).toContain('data-theme="dark"');
    expect(out).toContain('data-text-size="largest"');
    expect(out).toContain('data-reduce-motion="true"');
    expect(out).toContain("--safe-top:32px");
  });

  test("draws the status bar, the cutout and the bottom of each phone", () => {
    expect(frame("iphone16pro")).toContain(">9:41<");
    expect(frame("iphone16pro")).toContain("device__island");
    expect(frame("galaxyA15")).toContain("device__punch-hole");
    expect(frame("iphoneSE3")).toContain("device__home-button");
    expect(frame("androidCompact")).toContain("home-indicator--gestureBar");
    expect(frame("galaxyA15")).toContain("home-indicator--buttons");
  });

  test("the keyboard starts hidden", () => {
    expect(frame("iphone16pro")).not.toContain('class="keyboard');
  });
});
