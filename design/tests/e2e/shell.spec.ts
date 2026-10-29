import type { FrameLocator, Page } from "@playwright/test";
import { expect, gotoAndSettle, test } from "./fixtures";

const phone = (page: Page, name: "Alex" | "Sarah"): FrameLocator =>
  page.frameLocator(`iframe[title="${name}'s phone"]`);

/** Opens the review shell paused, and waits until both phones show the world. */
async function openShell(page: Page, search = ""): Promise<void> {
  const sep = search ? "&" : "?";
  await gotoAndSettle(page, `/prototype${search}${sep}play=0`);
  await expect(page.locator(".proto-phone[data-ready]")).toHaveCount(
    search.includes("view=single") ? 1 : 2,
  );
}

const route = (page: Page, name: "Alex" | "Sarah") => phone(page, name).locator("[data-route]");

test("the default URL shows both phones: Alex's iPhone and Sarah's Galaxy", async ({ page }) => {
  await openShell(page);
  await expect(phone(page, "Alex").locator(".device")).toBeVisible();
  await expect(phone(page, "Sarah").locator(".device")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Alex" })).toBeVisible();
  await expect(page.locator(".proto-phone__model")).toHaveText(["iPhone 16 Pro", "Galaxy A15"]);
  await expect(route(page, "Sarah")).toHaveAttribute("data-route", "home");
});

test("choosing a scenario loads it and records it in the URL", async ({ page }) => {
  await openShell(page);
  await page.getByRole("link", { name: "Camera: ready" }).click();
  await expect(page).toHaveURL(/scenario=camera-ready/);
  await expect(route(page, "Alex")).toHaveAttribute("data-route", "camera");
  await expect(page.getByRole("link", { name: "Camera: ready" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("a bad URL value falls back to the default, with a notice", async ({ page }) => {
  await openShell(page, "?scenario=nope");
  await expect(page.getByRole("status")).toContainText("nope");
  await expect(route(page, "Sarah")).toHaveAttribute("data-route", "home");
});

test.describe("Review Focus 2: a small browser window", () => {
  test.use({ viewport: { width: 800, height: 600 } });

  test("no sideways scroll, both phones fully visible, and the navigator scrolls", async ({
    page,
  }) => {
    await openShell(page);
    const fits = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    );
    expect(fits).toBe(true);
    for (const frame of await page.locator(".proto-phone iframe").all()) {
      const box = await frame.boundingBox();
      expect(box).not.toBeNull();
      if (!box) continue;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(800);
      expect(box.y + box.height).toBeLessThanOrEqual(600);
    }
    const nav = page.locator(".proto-nav");
    expect(await nav.evaluate((n) => n.scrollHeight > n.clientHeight)).toBe(true);
    await nav.getByRole("link", { name: "Android progress notification" }).scrollIntoViewIfNeeded();
    await expect(nav.getByRole("link", { name: "Android progress notification" })).toBeInViewport();
  });
});

test.describe("a large window", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("phones are never drawn larger than true size", async ({ page }) => {
    await openShell(page);
    const scale = Number(await page.locator(".proto-stage").getAttribute("data-scale"));
    expect(scale).toBeGreaterThan(0);
    expect(scale).toBeLessThanOrEqual(1);
  });
});

test("Review Focus 3: switching theme keeps an open panel, its focus and the world", async ({
  page,
}) => {
  await openShell(page, "?scenario=connect-check-words");
  const sarah = phone(page, "Sarah");
  const panel = sarah.getByRole("dialog");
  await expect(panel).toBeVisible();
  const notNow = panel.getByRole("button", { name: "Not now" });
  await notNow.focus();
  const before = await page.evaluate(() =>
    JSON.stringify((window as { __protoWorld?: unknown }).__protoWorld),
  );
  await page.getByRole("button", { name: "Sarah's phone settings" }).click();
  await page.getByRole("radio", { name: "Dark" }).check();
  await expect(sarah.locator(".device__screen")).toHaveAttribute("data-theme", "dark");
  await expect(panel).toBeVisible();
  // Back on the phone, focus is where it was.
  await sarah.locator("body").evaluate(() => window.focus());
  await expect(notNow).toBeFocused();
  const after = await page.evaluate(() =>
    JSON.stringify((window as { __protoWorld?: unknown }).__protoWorld),
  );
  const withoutTheme = (json: string | null) => {
    const w = JSON.parse(json ?? "{}");
    for (const d of Object.values(w.devices) as { theme?: string }[]) delete d.theme;
    return w;
  };
  expect(withoutTheme(after)).toEqual(withoutTheme(before));
});

test("Review Focus 3: switching phone model takes the keyboard down", async ({ page }) => {
  await openShell(page, "?scenario=username-empty");
  const sarah = phone(page, "Sarah");
  await sarah.getByRole("textbox", { name: "Username" }).focus();
  await expect(sarah.locator(".keyboard")).toBeVisible();
  await page.getByRole("button", { name: "Sarah's phone settings" }).click();
  await page.getByRole("combobox", { name: "Phone" }).selectOption("iphone16pro");
  await expect(sarah.locator(".device__screen")).toHaveAttribute("data-keyboard", "down");
  await expect(sarah.locator(".keyboard")).toHaveCount(0);
});

test("relaunching Alex keeps the camera during a session, and the lock after it", async ({
  page,
}) => {
  await openShell(page, "?scenario=camera-ready");
  await page.getByRole("button", { name: "Alex's phone settings" }).click();
  await page.getByRole("button", { name: "Relaunch the app" }).click();
  await expect(route(page, "Alex")).toHaveAttribute("data-route", "camera");
  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "Lock: still sending" }).click();
  await page.getByRole("button", { name: "Alex's phone settings" }).click();
  await page.getByRole("button", { name: "Relaunch the app" }).click();
  await expect(route(page, "Alex")).toHaveAttribute("data-route", "lock");
});

test("the clock moves only when asked, and Reset puts the scenario back", async ({ page }) => {
  await openShell(page, "?scenario=invitation-showing-code");
  const clock = page.locator(".proto-clock__time");
  await expect(clock).toHaveText("Today 9:41");
  await page.getByRole("button", { name: "Forward 1 hour" }).click();
  await expect(clock).toHaveText("Today 10:41");
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(clock).toHaveText("Today 9:41");
});

test("one phone at a time, and Present mode hides everything but the phones", async ({ page }) => {
  await openShell(page);
  await page.getByRole("radio", { name: "One phone" }).check();
  await expect(page).toHaveURL(/view=single/);
  await expect(page.locator(".proto-phone")).toHaveCount(1);
  await page.getByRole("radio", { name: "Alex" }).check();
  await expect(page).toHaveURL(/focus=alex/);
  await expect(page.getByRole("heading", { level: 2, name: "Alex" })).toBeVisible();
  await page.getByRole("button", { name: "Present" }).click();
  await expect(page.locator(".ws-header")).toBeHidden();
  await expect(page.locator(".proto-nav")).toBeHidden();
  await page.keyboard.press("Escape");
  await expect(page.locator(".proto-nav")).toBeVisible();
});

test.describe("a narrow window in Present mode", () => {
  test.use({ viewport: { width: 640, height: 800 } });

  test("the phones get the whole width: no empty navigator column", async ({ page }) => {
    await openShell(page);
    await page.getByRole("button", { name: "Present" }).click();
    const width = await page.locator(".proto-stage").evaluate((stage) => stage.clientWidth);
    expect(width).toBe(640);
  });
});
