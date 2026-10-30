import type { Page } from "@playwright/test";
import { expect, gotoAndSettle, test } from "./fixtures";

const example = (page: Page, title: string) =>
  page.locator(".ws-example").filter({ has: page.getByText(title, { exact: true }) });

test.describe("RingButton presses", () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndSettle(page, "/library/ring-button");
  });

  test("a press at rest fires once; a double-click is two presses", async ({ page }) => {
    const rest = example(page, "Filled, at rest");
    const count = rest.getByTestId("press-count");
    await expect(count).toHaveText("0");
    await rest.getByRole("button").click();
    await expect(count).toHaveText("1");
    await rest.getByRole("button").dblclick();
    await expect(count).toHaveText("3");
  });

  test("waiting and unavailable rings ignore presses", async ({ page }) => {
    for (const title of ["Waiting", "Unavailable, with its reason"]) {
      const ring = example(page, title);
      await ring.getByRole("button").click({ force: true });
      await expect(ring.getByTestId("press-count"), title).toHaveText("0");
    }
  });

  test("Space and Enter each press once", async ({ page }) => {
    const rest = example(page, "Filled, at rest");
    await rest.getByRole("button").focus();
    await page.keyboard.press("Space");
    await expect(rest.getByTestId("press-count")).toHaveText("1");
    await page.keyboard.press("Enter");
    await expect(rest.getByTestId("press-count")).toHaveText("2");
  });

  test("sliding off before release does not press", async ({ page }) => {
    const rest = example(page, "Filled, at rest");
    const box = (await rest.getByRole("button").boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 300, box.y + box.height / 2, { steps: 5 });
    await page.mouse.up();
    await expect(rest.getByTestId("press-count")).toHaveText("0");
  });
});
