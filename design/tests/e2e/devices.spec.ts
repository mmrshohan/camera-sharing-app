import type { Page } from "@playwright/test";
import { expect, gotoAndSettle, test } from "./fixtures";

const example = (page: Page, title: string) =>
  page.locator(".ws-example").filter({ has: page.getByText(title, { exact: true }) });

test.describe("the keyboard (D21)", () => {
  test("follows focus, and leaves in the same frame as the screen", async ({ page }) => {
    await gotoAndSettle(page, "/library/device-frame");
    const phone = example(page, "The keyboard follows focus");
    const keyboard = phone.locator(".keyboard");
    await expect(keyboard).toBeHidden();
    const field = phone.getByRole("textbox");
    await field.click();
    await expect(keyboard).toBeVisible();
    await field.press("Enter");
    expect(await keyboard.isHidden()).toBe(true);
  });

  test("hides when the field loses focus", async ({ page }) => {
    await gotoAndSettle(page, "/library/device-frame");
    const phone = example(page, "The keyboard follows focus");
    await phone.getByRole("textbox").click();
    await expect(phone.locator(".keyboard")).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(phone.locator(".keyboard")).toBeHidden();
  });
});
