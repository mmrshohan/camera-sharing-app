import { tokens } from "../../src/tokens/generated/tokens";
import { expect, gotoAndSettle, test } from "./fixtures";

test("the library lists the final components, and only those", async ({ page }) => {
  await gotoAndSettle(page, "/library");
  // Group 1 was approved by the owner on 29 October 2026.
  const card = page.getByRole("link", { name: /^Icon\s/ });
  await expect(card).toBeVisible();
  await expect(card).toContainText("Final");
  await expect(page.getByText("In review")).toHaveCount(0);
  await expect(page.getByText("No components are final yet.")).toHaveCount(0);
});

test("the lab never lists a final component", async ({ page }) => {
  await gotoAndSettle(page, "/lab");
  await expect(page.getByRole("link", { name: /^Icon\s/ })).toHaveCount(0);
  await expect(page.locator(".ws-badge--final")).toHaveCount(0);
});

test("a Lab link to a final component opens it in the Library, keeping its settings", async ({
  page,
}) => {
  await gotoAndSettle(page, "/lab/icon?platform=android");
  await expect(page).toHaveURL(/\/library\/icon\?platform=android$/);
  await expect(page.getByRole("heading", { level: 1, name: "Icon" })).toBeVisible();
});

test("a component page switches its previews to Android", async ({ page }) => {
  await gotoAndSettle(page, "/library/icon");
  await expect(page.getByRole("heading", { level: 1, name: "Icon" })).toBeVisible();
  const previews = page.getByTestId("preview");
  await expect(previews.first()).toHaveAttribute("data-platform", "ios");
  await page.getByRole("radio", { name: "Android" }).check();
  const count = await previews.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i += 1) {
    await expect(previews.nth(i)).toHaveAttribute("data-platform", "android");
  }
  await expect(page).toHaveURL(/platform=android/);
});

test("a library component page shows its sections in order", async ({ page }) => {
  await gotoAndSettle(page, "/library/icon");
  const headings = await page.getByRole("heading", { level: 2 }).allTextContents();
  expect(headings).toEqual([
    "States",
    "Anatomy and tokens",
    "Accessibility",
    "Motion",
    "Where used",
    "Versions",
    "Changelog",
    "Native",
  ]);
  await expect(page.getByText("No earlier release yet")).toBeVisible();
});

test("an unknown lab component is not found", async ({ page }) => {
  await gotoAndSettle(page, "/lab/nope");
  await expect(page.getByRole("heading", { level: 1, name: "Not found" })).toBeVisible();
});

test("small components share a row in the states gallery, centered on their stage", async ({
  page,
}) => {
  await gotoAndSettle(page, "/library/progress-ring");
  const examples = page.locator(".ws-example");
  await expect(examples).toHaveCount(4);
  const tops = await examples.evaluateAll((els) =>
    els.map((el) => Math.round(el.getBoundingClientRect().top)),
  );
  expect(new Set(tops).size).toBe(1);
  const offset = await page
    .getByRole("progressbar")
    .first()
    .evaluate((ring) => {
      const stage = ring.closest(".preview")!.getBoundingClientRect();
      const box = ring.getBoundingClientRect();
      return Math.abs(box.left + box.width / 2 - (stage.left + stage.width / 2));
    });
  expect(offset).toBeLessThan(1);
});

test("workspace styles never leak into previewed components", async ({ page }) => {
  await gotoAndSettle(page, "/lab/grouped-list");
  const header = page.locator(".grouped-list__header").first();
  await expect(header).toHaveCSS("font-size", `${tokens.type.ios.default.footnote.size}px`);
  await expect(header).toHaveCSS("margin-bottom", "0px");
});
