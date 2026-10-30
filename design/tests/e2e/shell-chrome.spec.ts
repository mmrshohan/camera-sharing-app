import type { Page } from "@playwright/test";
import { expect, gotoAndSettle, test } from "./fixtures";
import { cssContrast } from "./helpers";

// The review shell's own controls: reachable by keyboard, named by what they show, and quiet but
// clear in both themes (Chief Design Officer review, 30 October 2026).

/** Opens the review shell paused, and waits until its phones show the world. */
async function openShell(page: Page, search = ""): Promise<void> {
  const sep = search ? "&" : "?";
  await gotoAndSettle(page, `/prototype${search}${sep}play=0`);
  await expect(page.locator(".proto-phone[data-ready]")).toHaveCount(
    search.includes("view=single") ? 1 : 2,
  );
}

const inToolbar = (page: Page) =>
  page.evaluate(() => document.activeElement?.closest(".proto-toolbar") !== null);

const fillOf = (page: Page, name: string) =>
  page
    .getByRole("button", { name, exact: true })
    .evaluate((el) => getComputedStyle(el).backgroundColor);

/** A translucent color painted over an opaque one, as the screen shows it. */
function over(top: string, bottom: string): string {
  const [r = 0, g = 0, b = 0, a = 1] = (top.match(/[\d.]+/g) ?? []).map(Number);
  const [br = 0, bg = 0, bb = 0] = (bottom.match(/[\d.]+/g) ?? []).map(Number);
  const mix = (x: number, y: number) => Math.round(x * a + y * (1 - a));
  return `rgb(${mix(r, br)}, ${mix(g, bg)}, ${mix(b, bb)})`;
}

test("the keyboard reaches the toolbar in a few presses: the scenario list is one stop", async ({
  page,
}) => {
  await openShell(page);
  let presses = 0;
  while (presses < 20 && !(await inToolbar(page))) {
    await page.keyboard.press("Tab");
    presses += 1;
  }
  // The brand, six sections, the chosen scenario, then the toolbar.
  expect(presses).toBeLessThanOrEqual(9);
});

test("the arrow keys walk the scenario list, and Tab leaves it", async ({ page }) => {
  await openShell(page);
  const links = page.locator(".proto-nav a");
  const chosen = page.locator('.proto-nav a[aria-current="page"]');
  await chosen.focus();
  const at = await links.evaluateAll((all) => all.indexOf(document.activeElement as HTMLElement));

  await page.keyboard.press("ArrowDown");
  await expect(links.nth(at + 1)).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(chosen).toBeFocused();
  await page.keyboard.press("End");
  await expect(links.last()).toBeFocused();
  await page.keyboard.press("Home");
  await expect(links.first()).toBeFocused();

  // Enter opens the scenario with focus, and the list still counts as one stop.
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(links.nth(1)).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Tab");
  expect(await inToolbar(page)).toBe(true);
  await page.keyboard.press("Shift+Tab");
  await expect(links.nth(1)).toBeFocused();
});

test("every button's spoken name includes the words it shows", async ({ page }) => {
  await openShell(page);
  const buttons = page.locator(".proto-toolbar button, .proto-phone__head button");
  expect(await buttons.count()).toBeGreaterThan(6);
  for (const button of await buttons.all()) {
    const shown = (await button.innerText()).trim().toLowerCase();
    const label = await button.getAttribute("aria-label");
    if (label !== null)
      expect(label.toLowerCase(), `"${shown}" is named "${label}"`).toContain(shown);
  }
  await expect(page.getByRole("button", { name: "Adjust Alex's phone" })).toBeVisible();
  await expect(page.getByRole("button", { name: "+1 h", exact: true })).toHaveAttribute(
    "title",
    "Forward 1 hour",
  );
});

test("Adjust looks like a button with a chevron, and stays held while its menu is open", async ({
  page,
}) => {
  await openShell(page);
  const adjust = page.getByRole("button", { name: "Adjust Alex's phone" });
  const fill = () => adjust.evaluate((el) => getComputedStyle(el).backgroundColor);
  const rest = await fill();
  expect(rest).not.toBe("rgba(0, 0, 0, 0)");
  await expect(adjust.locator("svg")).toHaveCount(1);

  await adjust.click();
  await page.mouse.move(0, 0);
  await expect(page.locator("#alex-controls")).toBeVisible();
  await expect.poll(fill).not.toBe(rest);
  await page.keyboard.press("Escape");
  await expect.poll(fill).toBe(rest);
});

for (const scheme of ["light", "dark"] as const) {
  test(`in ${scheme} mode the controls on the phone menu stand out from it`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await openShell(page);
    await page.getByRole("button", { name: "Adjust Alex's phone" }).click();
    const menu = page.locator("#alex-controls");
    await expect(menu).toBeVisible();
    const surface = await menu.evaluate((el) => getComputedStyle(el).backgroundColor);
    for (const selector of [".ws-segmented__track", "select", ".ws-switch__track"]) {
      const fill = await menu
        .locator(selector)
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(cssContrast(over(fill, surface), surface), selector).toBeGreaterThanOrEqual(1.08);
    }
  });
}

test("the phone menu is a two-column form: names on the left, controls lined up on the right", async ({
  page,
}) => {
  await openShell(page);
  await page.getByRole("button", { name: "Adjust Alex's phone" }).click();
  const menu = page.locator("#alex-controls");
  await expect(menu).toBeVisible();

  const edges = (selector: string) =>
    menu.locator(selector).evaluateAll((all) =>
      all.map((el) => {
        const r = el.getBoundingClientRect();
        return { left: Math.round(r.left), right: Math.round(r.right) };
      }),
    );
  const names = await edges(".proto-field > span, .ws-segmented legend");
  const controls = await edges(".proto-field select, .ws-segmented__track");
  expect(names).toHaveLength(5);
  expect(new Set(names.map((n) => n.left)).size, "names share a left edge").toBe(1);
  expect(new Set(controls.map((c) => c.left)).size, "controls share a left edge").toBe(1);
  expect(new Set(controls.map((c) => c.right)).size, "controls share a right edge").toBe(1);
  expect(Math.max(...names.map((n) => n.right))).toBeLessThanOrEqual(controls[0]?.left ?? 0);

  // Show Lock Screen is a switch, ending where the controls end.
  const lock = menu.getByRole("switch", { name: "Show Lock Screen" });
  await expect(lock).toBeVisible();
  const [track] = await edges(".ws-switch__track");
  expect(track?.right).toBe(controls[0]?.right);
  await lock.check();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as { __protoWorld?: { devices: { alex: { ui: { system: unknown } } } } })
            .__protoWorld?.devices.alex.ui.system,
      ),
    )
    .toBe("lockScreen");
});

test("in the toolbar, View and Phone are named for screen readers only: the options say it", async ({
  page,
}) => {
  await openShell(page, "?view=single");
  for (const name of ["View", "Phone"]) {
    const group = page.getByRole("group", { name, exact: true });
    await expect(group).toBeVisible();
    const legend = await group.locator("legend").boundingBox();
    expect(legend?.width ?? 0, name).toBeLessThanOrEqual(1);
  }
});

test("Play and Pause are the same width, so the toolbar doesn't shift", async ({ page }) => {
  await openShell(page);
  const play = page.getByRole("button", { name: "Play", exact: true });
  const before = (await play.boundingBox())?.width;
  await play.click();
  const pause = page.getByRole("button", { name: "Pause", exact: true });
  await expect(pause).toBeVisible();
  expect((await pause.boundingBox())?.width).toBe(before);
});

test("a filled button answers the press itself, before release", async ({ page }) => {
  await openShell(page);
  const present = page.getByRole("button", { name: "Present", exact: true });
  await present.hover();
  await page.waitForTimeout(200);
  const hovered = await fillOf(page, "Present");
  await page.mouse.down();
  await expect.poll(() => fillOf(page, "Present")).not.toBe(hovered);
  await expect
    .poll(() => present.evaluate((el) => getComputedStyle(el).transform))
    .toBe("matrix(0.97, 0, 0, 0.97, 0, 0)");
  // Let go elsewhere, so nothing is pressed.
  await page.mouse.move(0, 0);
  await page.mouse.up();
});

test("with Reduce Motion a pressed button darkens without shrinking", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openShell(page);
  const present = page.getByRole("button", { name: "Present", exact: true });
  await present.hover();
  await page.waitForTimeout(200);
  const hovered = await fillOf(page, "Present");
  await page.mouse.down();
  await expect.poll(() => fillOf(page, "Present")).not.toBe(hovered);
  expect(await present.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  await page.mouse.move(0, 0);
  await page.mouse.up();
});

test("Present mode keeps the keyboard's place: Exit takes focus, and leaving gives it back", async ({
  page,
}) => {
  await openShell(page);
  await page.getByRole("button", { name: "Present", exact: true }).click();
  await expect(page.getByRole("button", { name: "Exit", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Present", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Exit", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Present", exact: true })).toBeFocused();
});
