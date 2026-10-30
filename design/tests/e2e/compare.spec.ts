import { expect, gotoAndSettle, test } from "./fixtures";

test("with no release built, a component page says there is no earlier release", async ({
  page,
}) => {
  await gotoAndSettle(page, "/library/ring-button");
  await expect(page.getByText("No earlier release yet")).toBeVisible();
});

test("the release index is an empty list until one is built", async ({ request }) => {
  const response = await request.get("/__releases/index.json");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual([]);
});

test("an embedded page shows only itself", async ({ page }) => {
  await gotoAndSettle(page, "/library/ring-button?embed=1");
  await expect(page.locator(".ws-header")).toBeHidden();
  await expect(page.getByRole("heading", { level: 1, name: "RingButton" })).toBeVisible();
});

test("comparing the prototype with a release that isn't built says so", async ({ page }) => {
  await gotoAndSettle(page, "/prototype?compare=9.9.9&play=0");
  await expect(page.getByRole("status")).toContainText("9.9.9");
  await expect(page.locator(".proto-phone[data-ready]")).toHaveCount(2);
});
