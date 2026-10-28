import type { Page } from "@playwright/test";
import { tokens } from "../../src/tokens/generated/tokens";
import { expect, gotoAndSettle, test } from "./fixtures";

const example = (page: Page, title: string) =>
  page.locator(".ws-example").filter({ has: page.getByText(title, { exact: true }) });

for (const platform of ["ios", "android"] as const) {
  test(`text fields use the ${platform} field height`, async ({ page }) => {
    await gotoAndSettle(page, `/library/text-field?platform=${platform}`);
    const box = await page.locator(".text-field__box").first().boundingBox();
    expect(box?.height).toBe(tokens.system.fieldHeight[platform]);
  });

  test(`icon buttons meet the ${platform} touch target`, async ({ page }) => {
    await gotoAndSettle(page, `/library/icon-button?platform=${platform}`);
    const buttons = page.locator(".icon-button");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i += 1) {
      const box = (await buttons.nth(i).boundingBox())!;
      expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(tokens.target[platform]);
    }
  });
}

test("arrow keys move the chosen chip and focus with it", async ({ page }) => {
  await gotoAndSettle(page, "/library/choice-chips");
  const group = example(page, "One chosen").getByRole("radiogroup");
  const radios = group.getByRole("radio");
  await radios.nth(1).focus();
  await expect(radios.nth(1)).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("ArrowRight");
  await expect(radios.nth(2)).toHaveAttribute("aria-checked", "true");
  await expect(radios.nth(2)).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(radios.nth(0)).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(radios.nth(2)).toHaveAttribute("aria-checked", "true");
  await expect(radios.nth(1)).toHaveAttribute("aria-checked", "false");
});

test("a loading button ignores presses; a filled one presses once", async ({ page }) => {
  await gotoAndSettle(page, "/library/button");
  const loading = example(page, "Loading");
  await loading.getByRole("button").click({ force: true });
  await expect(loading.getByTestId("press-count")).toHaveText("0");
  const filled = example(page, "Filled");
  await filled.getByRole("button").click();
  await expect(filled.getByTestId("press-count")).toHaveText("1");
});

test("a switch flips with a click and with Space", async ({ page }) => {
  await gotoAndSettle(page, "/library/toggle");
  const toggle = example(page, "Off").getByRole("switch");
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-checked", "false");
});

test("a lab component page shows its sections, ending with the promotion checklist", async ({
  page,
}) => {
  await gotoAndSettle(page, "/lab");
  const cards = page.locator("a.ws-card");
  // Between an approval and the next group's first component, the Lab is empty.
  test.skip((await cards.count()) === 0, "Nothing is in the Lab right now");
  await cards.first().click();
  const headings = await page.getByRole("heading", { level: 2 }).allTextContents();
  expect(headings.at(-1)).toBe("Promotion checklist");
  await expect(page.getByText(/^Group \d approved by the owner$/)).toBeVisible();
});
