import { expect, gotoAndSettle, test } from "./fixtures";

test("the library lists only final components", async ({ page }) => {
  await gotoAndSettle(page, "/library");
  // Nothing is final until the owner approves group 1.
  await expect(page.getByText("No components are final yet.")).toBeVisible();
  await expect(page.getByRole("link", { name: /^Icon/ })).toHaveCount(0);
});

test("the lab lists components in review", async ({ page }) => {
  await gotoAndSettle(page, "/lab");
  const card = page.getByRole("link", { name: /^Icon/ });
  await expect(card).toBeVisible();
  await expect(card).toContainText("In review");
});

test("a component page switches its previews to Android", async ({ page }) => {
  await gotoAndSettle(page, "/lab/icon");
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

test("a component page shows its sections in order", async ({ page }) => {
  await gotoAndSettle(page, "/lab/icon");
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
    "Promotion checklist",
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
  await gotoAndSettle(page, "/lab/progress-ring");
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
