import type { Page } from "@playwright/test";
import type { DeviceModel } from "../../src/prototype/model/types";
import { scenarios } from "../../src/prototype/scenarios/catalog";
import type { Scenario } from "../../src/prototype/scenarios/types";
import { expect, gotoAndSettle, test } from "./fixtures";
import { assertNothingEssentialClipped, phoneA11yViolations } from "./helpers";

const titles = { alex: "Alex's phone", sarah: "Sarah's phone" } as const;
const models: DeviceModel[] = ["iphone16pro", "iphoneSE3", "galaxyA15", "androidCompact"];
const main = scenarios.filter((s) => s.main);

/** The phones a scenario is about. */
const shownFor = (s: Scenario) =>
  s.focus === "both" ? (["alex", "sarah"] as const) : ([s.focus] as const);

/** Opens a scenario paused, on the given phones and theme, and waits until the phones settle. */
async function open(
  page: Page,
  s: Scenario,
  options: { model?: DeviceModel; theme?: "light" | "dark"; text?: "default" | "largest" } = {},
): Promise<void> {
  const params = new URLSearchParams({ scenario: s.id, play: "0" });
  const shown = shownFor(s);
  if (shown.length === 1) {
    params.set("view", "single");
    params.set("focus", shown[0]);
  }
  if (options.model) for (const id of shown) params.set(`${id}Device`, options.model);
  if (options.theme === "dark") params.set("theme", "dark");
  if (options.text === "largest") params.set("text", "largest");
  await gotoAndSettle(page, `/prototype?${params.toString()}`);
  await expect(page.locator(".proto-phone[data-ready]")).toHaveCount(shown.length);
  // Let entrances finish: panels rise and prompts fade in.
  for (const id of shown) {
    await page
      .frameLocator(`iframe[title="${titles[id]}"]`)
      .locator("body")
      .evaluate(() =>
        Promise.all(
          document
            .getAnimations()
            .filter((a) => a.effect?.getTiming().iterations !== Infinity)
            .map((a) => a.finished.catch(() => undefined)),
        ),
      );
  }
  await page.waitForTimeout(400);
}

async function expectAccessible(page: Page, s: Scenario): Promise<void> {
  for (const id of shownFor(s)) expect(await phoneA11yViolations(page, titles[id]), id).toEqual([]);
}

test.describe("(a) every scenario on the story's phones, light", () => {
  for (const s of scenarios) {
    test(s.id, async ({ page }) => {
      await open(page, s);
      await expectAccessible(page, s);
    });
  }
});

test.describe("(b) every main scenario on every phone, light and dark", () => {
  for (const s of main) {
    for (const model of models) {
      for (const theme of ["light", "dark"] as const) {
        test(`${s.id} · ${model} · ${theme}`, async ({ page }) => {
          await open(page, s, { model, theme });
          await expectAccessible(page, s);
        });
      }
    }
  }
});

test.describe("(c) the largest text on the smallest phones: nothing essential clipped", () => {
  for (const s of main) {
    for (const model of ["iphoneSE3", "androidCompact"] as const) {
      test(`${s.id} · ${model}`, async ({ page }) => {
        await open(page, s, { model, text: "largest" });
        for (const id of shownFor(s)) {
          const screen = page
            .frameLocator(`iframe[title="${titles[id]}"]`)
            .locator(".device__screen");
          await assertNothingEssentialClipped(page, screen);
        }
      });
    }
  }
});

test.describe("(d) Review Focus 5: with Reduce Motion, nothing moves for long", () => {
  for (const s of main) {
    test(s.id, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await open(page, s);
      for (const id of shownFor(s)) {
        const long = await page
          .frameLocator(`iframe[title="${titles[id]}"]`)
          .locator("body")
          .evaluate(() =>
            document
              .getAnimations()
              .filter((a) => a.playState === "running")
              .map((a) => {
                const timing = a.effect?.getTiming();
                const duration = typeof timing?.duration === "number" ? timing.duration : 0;
                const iterations = timing?.iterations ?? 1;
                const name = a instanceof CSSAnimation ? a.animationName : "script";
                return { name, total: iterations === Infinity ? Infinity : duration * iterations };
              })
              .filter((a) => a.total > 200)
              .map((a) => `${a.name} (${a.total} ms)`),
          );
        expect(long, id).toEqual([]);
      }
    });
  }
});
