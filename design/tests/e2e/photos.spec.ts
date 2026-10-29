import { expect, gotoAndSettle, test } from "./fixtures";

interface Running {
  properties: string[];
  duration: number;
}

const arriveAndRead = async (
  page: import("@playwright/test").Page,
  reducedMotion: "reduce" | "no-preference",
): Promise<Running[]> => {
  await page.emulateMedia({ reducedMotion });
  await gotoAndSettle(page, "/library/photo-tile");
  const example = page
    .locator(".ws-example")
    .filter({ has: page.getByText("Develops on arrival", { exact: true }) });
  await example.getByRole("button", { name: "Arrive" }).click();
  return example.locator(".photo-tile__image").evaluate((element) =>
    element.getAnimations().map((animation) => {
      const effect = animation.effect as KeyframeEffect;
      const properties = [
        ...new Set(effect.getKeyframes().flatMap((frame) => Object.keys(frame))),
      ].filter((key) => !["offset", "easing", "composite", "computedOffset"].includes(key));
      return { properties, duration: Number(effect.getTiming().duration) };
    }),
  );
};

test("a photo develops when it arrives: blur and saturation clear", async ({ page }) => {
  const running = await arriveAndRead(page, "no-preference");
  expect(running.length).toBeGreaterThan(0);
  expect(running.some((a) => a.properties.includes("filter"))).toBe(true);
});

test.describe("with Reduce Motion", () => {
  test("the develop becomes a 200 ms fade", async ({ page }) => {
    const running = await arriveAndRead(page, "reduce");
    for (const animation of running) {
      expect(animation.properties).toEqual(["opacity"]);
      expect(animation.duration).toBe(200);
    }
  });
});
