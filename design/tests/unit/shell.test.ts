import { describe, expect, test } from "vitest";
import type { WorldEvent } from "@prototype/model/types";
import { reduce } from "@prototype/model/world";
import { createWorld } from "@prototype/scenarios/build";
import { reconcile } from "@prototype/shell/bridge";
import { clockLabel, fitScale } from "@prototype/shell/layout";

describe("review shell events", () => {
  test("changing a phone's model, theme or text size changes nothing else", () => {
    const w = createWorld();
    const next = reduce(w, {
      type: "setAppearance",
      device: "sarah",
      model: "iphone16pro",
      theme: "dark",
      textSize: "largest",
    });
    expect(next.devices.sarah).toMatchObject({
      model: "iphone16pro",
      theme: "dark",
      textSize: "largest",
    });
    const back = reduce(next, {
      type: "setAppearance",
      device: "sarah",
      model: "galaxyA15",
      theme: "light",
      textSize: "default",
    });
    expect(back).toEqual(w);
  });

  test("showing the Lock Screen puts a system surface over the app", () => {
    const w = reduce(createWorld(), { type: "showSystem", device: "sarah", surface: "lockScreen" });
    expect(w.devices.sarah.ui.system).toBe("lockScreen");
    expect(
      reduce(w, { type: "showSystem", device: "sarah", surface: null }).devices.sarah.ui.system,
    ).toBeNull();
  });
});

describe("fitScale", () => {
  const pro = { width: 426, height: 898 };
  const galaxy = { width: 436, height: 915 };

  test("never enlarges a phone beyond true size", () => {
    expect(fitScale({ width: 4000, height: 3000 }, [pro, galaxy], 32)).toBe(1);
  });

  test("fits both phones side by side, whichever dimension is tighter", () => {
    expect(fitScale({ width: 600, height: 2000 }, [pro, galaxy], 32)).toBeCloseTo(
      (600 - 32) / (426 + 436),
    );
    expect(fitScale({ width: 4000, height: 500 }, [pro, galaxy], 32)).toBeCloseTo(500 / 915);
  });

  test("an empty or collapsed stage gives a small positive scale, never zero", () => {
    expect(fitScale({ width: 0, height: 0 }, [pro], 32)).toBeGreaterThan(0);
  });
});

describe("clockLabel", () => {
  test("the story starts at 9:41 today", () => expect(clockLabel(0)).toBe("Today 9:41"));
  test("an hour later", () => expect(clockLabel(60 * 60_000)).toBe("Today 10:41"));
  test("past midnight", () => expect(clockLabel(15 * 60 * 60_000)).toBe("Tomorrow 0:41"));
  test("days later", () => expect(clockLabel(3 * 24 * 60 * 60_000)).toBe("In 3 days 9:41"));
});

describe("bridge", () => {
  test("a phone re-applies its own events the shell hasn't confirmed yet", () => {
    const typing = (value: string): WorldEvent => ({ type: "typeField", device: "sarah", value });
    const pending = [
      { seq: 1, event: typing("s") },
      { seq: 2, event: typing("sa") },
    ];
    const confirmed = reduce(createWorld(), typing("s"));
    const { world, pending: left } = reconcile(confirmed, 1, pending);
    expect(left.map((p) => p.seq)).toEqual([2]);
    expect(world.devices.sarah.ui.field.value).toBe("sa");
    expect(reconcile(world, 2, left).pending).toEqual([]);
  });
});
