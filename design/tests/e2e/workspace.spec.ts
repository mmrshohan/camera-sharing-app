import type { Page } from "@playwright/test";
import { expect, gotoAndSettle, test } from "./fixtures";

// The workspace chrome, as the owner asked on 30 October 2026: white, minimal, and blue only where
// something is chosen.
const white = "rgb(255, 255, 255)";
const clear = "rgba(0, 0, 0, 0)";
const accentText = "rgb(0, 102, 204)";
const accentTint = "rgb(232, 241, 252)";

/** White at any opacity, such as a translucent bar over a white page, or nothing at all. */
const whiteOrClear = (color: string) =>
  color === clear ||
  /^rgba?\(255, 255, 255(, [0-9.]+)?\)$/.test(color) ||
  /^color\(srgb 1 1 1( \/ [0-9.]+)?\)$/.test(color);

const style = (page: Page, selector: string, property: "backgroundColor" | "color") =>
  page
    .locator(selector)
    .first()
    .evaluate((el, p) => getComputedStyle(el)[p], property);

test("every workspace page sits on white", async ({ page }) => {
  for (const path of [
    "/",
    "/guideline",
    "/library",
    "/library/button",
    "/lab",
    "/changelog",
    "/nope",
  ]) {
    await gotoAndSettle(page, path);
    expect(await style(page, "body", "backgroundColor"), path).toBe(white);
    const header = await style(page, ".ws-header", "backgroundColor");
    expect(whiteOrClear(header), `${path}: the header is ${header}`).toBe(true);
  }
});

test("the prototype's scenarios, toolbar and stage are white too", async ({ page }) => {
  await gotoAndSettle(page, "/prototype?play=0");
  for (const selector of [".proto", ".proto-nav", ".proto-toolbar", ".proto-stage"]) {
    const color = await style(page, selector, "backgroundColor");
    expect(whiteOrClear(color), `${selector} is ${color}`).toBe(true);
  }
});

test("in the scenario list, hovering tints a row and the chosen one is blue", async ({ page }) => {
  await gotoAndSettle(page, "/prototype?play=0");
  const chosen = '.proto-nav__list a[aria-current="page"]';
  expect(await style(page, chosen, "color")).toBe(accentText);
  expect(await style(page, chosen, "backgroundColor")).toBe(accentTint);

  // Held by its name: once chosen, it no longer matches :not([aria-current]).
  const name = await page.locator(".proto-nav__list a:not([aria-current])").nth(3).innerText();
  const other = page.locator(".proto-nav").getByRole("link", { name, exact: true });
  expect(await other.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(clear);
  await other.hover();
  await expect
    .poll(() => other.evaluate((el) => getComputedStyle(el).backgroundColor))
    .not.toBe(clear);
  // Hover is a neutral tint: blue means chosen.
  expect(await other.evaluate((el) => getComputedStyle(el).color)).not.toBe(accentText);

  await other.click();
  await expect(other).toHaveAttribute("aria-current", "page");
  await expect.poll(() => other.evaluate((el) => getComputedStyle(el).color)).toBe(accentText);
});

test("the header marks the current section with a fill, not an outline", async ({ page }) => {
  await gotoAndSettle(page, "/library");
  const current = page.locator('.ws-nav a[aria-current="page"]');
  await expect(current).toHaveText("Library");
  const look = await current.evaluate((el) => {
    const s = getComputedStyle(el);
    return { fill: s.backgroundColor, outline: s.boxShadow };
  });
  expect(look.fill).not.toBe(clear);
  expect(look.outline).toBe("none");
});
