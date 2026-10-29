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

  test("content that scrolls with nothing to tap can still be scrolled from the keyboard (final review)", async ({
    page,
  }) => {
    await gotoAndSettle(page, "/library/panel?platform=ios&text=largest");
    await example(page, "Medium").getByRole("button", { name: "Show my code" }).click();
    const panel = page.getByRole("dialog");
    await expect(panel).toBeVisible();
    const body = panel.locator(".panel__body");
    // At the largest text the medium detent overflows, and there is no control inside.
    expect(await body.evaluate((el) => el.scrollHeight - el.clientHeight)).toBeGreaterThan(0);
    await expect(body.getByRole("button")).toHaveCount(0);
    await expect(body).toHaveAttribute("tabindex", "0");
    await expect(body).toHaveAccessibleName("Your code");
    expect(await seriousA11yViolations(page)).toEqual([]);
  });

  test("content that fits takes no extra stop in the tab order", async ({ page }) => {
    const panel = await openPanel(page, "Medium");
    await expect(panel.locator(".panel__body")).not.toHaveAttribute("tabindex", /.*/);
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

  const alex = (page: Page) => page.frameLocator(`iframe[title="Alex's phone"]`);

  test("the Session panel's list lines up with its title on iPhone (design review 13)", async ({
    page,
  }) => {
    await open(page, "scenario=session-photo-list");
    const card = await alex(page)
      .locator(".grouped-list__items")
      .evaluate((el) => el.getBoundingClientRect().left);
    // Where the title's words start, inside its padding.
    const title = await alex(page)
      .locator(".panel__title")
      .evaluate((el) => {
        const words = document.createRange();
        words.selectNodeContents(el);
        return words.getBoundingClientRect().left;
      });
    expect(card).toBeCloseTo(title, 0);
  });

  test("at the largest text the Connect panel opens with the words' first line in full (design review 16)", async ({
    page,
  }) => {
    await open(page, "scenario=connect-check-words&sarahDevice=iphoneSE3&text=largest");
    const panel = sarah(page).getByRole("dialog");
    await expect(panel).toBeVisible();
    // Focus starts on the words, scrolled so they begin right under the title: no line is cut there.
    const offset = await panel.locator(".panel__body").evaluate((body) => {
      const words = body.querySelector(".panel-focus");
      return {
        focused: document.activeElement === words,
        scrolled: body.scrollTop,
        gap: (words?.getBoundingClientRect().top ?? 0) - body.getBoundingClientRect().top,
      };
    });
    expect(offset.focused).toBe(true);
    expect(offset.scrolled).toBeGreaterThan(0);
    expect(Math.abs(offset.gap)).toBeLessThan(1);
  });

  test("Recovery on Sarah's phone says the photos come to this phone (design review 15)", async ({
    page,
  }) => {
    await open(page, "scenario=recovery-needs-both");
    const body = (frame: ReturnType<Page["frameLocator"]>) =>
      frame.getByRole("dialog", { name: "Finish sending offline photos?" }).locator(".panel__body");
    await expect(body(sarah(page))).toContainText("sending them to this phone");
    await expect(body(sarah(page))).not.toContainText("to Sarah");
    await expect(body(alex(page))).toContainText("sending them to Sarah");
  });

  test("words that don't match say so in the title, and the message doesn't repeat the button (design review 15)", async ({
    page,
  }) => {
    await open(page, "scenario=connect-words-dont-match");
    for (const frame of [alex(page), sarah(page)]) {
      const panel = frame.getByRole("dialog", { name: "Words didn’t match" });
      await expect(panel).toBeVisible();
      await expect(panel.locator(".inline-message")).not.toContainText("Start again");
      await expect(panel.getByRole("button", { name: "Start again" })).toBeVisible();
    }
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
