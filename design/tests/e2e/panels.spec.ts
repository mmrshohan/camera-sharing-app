import type { Page } from "@playwright/test";
import { expect, gotoAndSettle, test } from "./fixtures";
import { seriousA11yViolations } from "./helpers";

const example = (page: Page, title: string) =>
  page.locator(".ws-example").filter({ has: page.getByText(title, { exact: true }) });

async function openDeleteConfirmation(page: Page) {
  await gotoAndSettle(page, "/library/confirm-dialog");
  const opener = example(page, "Destructive: an action sheet on iOS").getByRole("button", {
    name: "Delete from this app",
  });
  await opener.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  return { opener, dialog };
}

test.describe("ConfirmDialog", () => {
  test("opens on the safe action, with a visible focus ring", async ({ page }) => {
    const { dialog } = await openDeleteConfirmation(page);
    const keep = dialog.getByRole("button", { name: "Keep" });
    await expect(keep).toBeFocused();
    await expect(keep).toHaveCSS("outline-style", "solid");
  });

  test("Tab stays inside; Escape closes it and returns focus to the opener", async ({ page }) => {
    const { opener, dialog } = await openDeleteConfirmation(page);
    for (let i = 0; i < 3; i += 1) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });
});

test.describe("Panel", () => {
  async function openPanel(page: Page, title: string) {
    await gotoAndSettle(page, "/library/panel");
    await example(page, title).getByRole("button", { name: "Show my code" }).click();
    const panel = page.getByRole("dialog");
    await expect(panel).toBeVisible();
    return panel;
  }

  async function dragHandle(page: Page, panel: ReturnType<Page["getByRole"]>, distance: number) {
    // Hover waits until the panel has finished rising, so the press lands on the handle.
    await panel.locator(".panel__handle").hover();
    const box = (await panel.locator(".panel__handle").boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y + distance, { steps: 8 });
    await page.mouse.up();
  }

  test("closes after a 120 px downward drag on its handle", async ({ page }) => {
    const panel = await openPanel(page, "Drag down to dismiss");
    await dragHandle(page, panel, 120);
    await expect(panel).toBeHidden();
  });

  test("springs back after a short, slow drag", async ({ page }) => {
    const panel = await openPanel(page, "Drag down to dismiss");
    await panel.locator(".panel__handle").hover();
    const box = (await panel.locator(".panel__handle").boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + 32, { steps: 30 });
    await page.waitForTimeout(150);
    await page.mouse.up();
    await page.waitForTimeout(600);
    await expect(panel).toBeVisible();
  });

  test("a panel that is not dismissible ignores Escape", async ({ page }) => {
    const panel = await openPanel(page, "Not dismissible: it needs an answer");
    await page.keyboard.press("Escape");
    await expect(panel).toBeVisible();
  });

  test("an open panel has no serious accessibility violations", async ({ page }) => {
    await openPanel(page, "Medium");
    expect(await seriousA11yViolations(page)).toEqual([]);
  });
});

test.describe("panels on the phones (design review, 29 October 2026)", () => {
  const sarah = (page: Page) => page.frameLocator(`iframe[title="Sarah's phone"]`);
  async function open(page: Page, search: string) {
    await gotoAndSettle(page, `/prototype?${search}&play=0`);
    await expect(page.locator(".proto-phone[data-ready]")).toHaveCount(2);
  }
  const looks = [
    ["galaxyA15", "light"],
    ["galaxyA15", "dark"],
    ["iphone16pro", "light"],
    ["iphone16pro", "dark"],
  ] as const;

  for (const [model, theme] of looks) {
    test(`cards stand out from the panel they sit on: ${model}, ${theme}`, async ({ page }) => {
      const background = (selector: string) =>
        sarah(page)
          .locator(selector)
          .first()
          .evaluate((el) => getComputedStyle(el).backgroundColor);
      for (const [scenario, cards] of [
        ["connect-check-words", [".person-pair", ".verification-words__list li"]],
        ["connect-words-dont-match", [".inline-message"]],
      ] as const) {
        await open(page, `scenario=${scenario}&sarahDevice=${model}&theme=${theme}`);
        const panel = await background(".panel");
        for (const card of cards)
          expect(await background(card), `${scenario} ${card}`).not.toBe(panel);
      }
    });
  }

  test("an expired invitation's action sits above Android's navigation bar", async ({ page }) => {
    await open(page, "scenario=invitation-expired");
    const action = await sarah(page).getByRole("button", { name: "Show a new code" }).boundingBox();
    const nav = await sarah(page).locator(".home-indicator").boundingBox();
    expect(action && nav && action.y + action.height).toBeLessThanOrEqual(nav?.y ?? 0);
  });

  test("a showing invitation fits: its countdown and Done show without scrolling", async ({
    page,
  }) => {
    await open(page, "scenario=invitation-showing-code");
    const body = sarah(page).locator(".panel__body");
    expect(await body.evaluate((el) => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(0);
    const done = await sarah(page).getByRole("button", { name: "Done" }).boundingBox();
    const nav = await sarah(page).locator(".home-indicator").boundingBox();
    expect(done && nav && done.y + done.height).toBeLessThanOrEqual(nav?.y ?? 0);
  });
});
