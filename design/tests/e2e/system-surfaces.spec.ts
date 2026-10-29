import type { FrameLocator, Page } from "@playwright/test";
import { expect, gotoAndSettle, test } from "./fixtures";

const phone = (page: Page, name: "Alex" | "Sarah"): FrameLocator =>
  page.frameLocator(`iframe[title="${name}'s phone"]`);

test("Sarah's Lock Screen shows her platform's own surface: a Live Activity, or the notification", async ({
  page,
}) => {
  await gotoAndSettle(
    page,
    "/prototype?scenario=home-live-receiving&sarahDevice=iphone16pro&play=0",
  );
  await expect(page.locator(".proto-phone[data-ready]")).toHaveCount(2);
  const sarah = phone(page, "Sarah");
  await page.getByRole("button", { name: "Sarah's phone settings" }).click();
  await page.getByRole("checkbox", { name: "Show Lock Screen" }).check();
  const activity = sarah.locator(".live-activity--lock");
  await expect(activity).toContainText("Alex’s camera");
  await expect(activity).toContainText("3 photos");
  await expect(activity).toContainText("1 on the way");

  await page.getByRole("combobox", { name: "Phone" }).selectOption("galaxyA15");
  const notification = sarah.locator(".progress-notification");
  await expect(notification).toContainText("Photos from Alex");
  await expect(notification).toContainText("3 photos · 1 on the way");
  await expect(sarah.locator(".live-activity")).toHaveCount(0);

  await page.getByRole("checkbox", { name: "Show Lock Screen" }).uncheck();
  await expect(sarah.locator("[data-route]")).toHaveAttribute("data-route", "home");
  await expect(sarah.locator(".progress-notification")).toHaveCount(0);
});

test("when every photo has arrived, the Live Activity says so", async ({ page }) => {
  await gotoAndSettle(
    page,
    "/prototype?scenario=system-live-activity-done&sarahDevice=iphone16pro&play=0",
  );
  await expect(page.locator(".proto-phone[data-ready]")).toHaveCount(2);
  await expect(phone(page, "Sarah").locator(".live-activity--lock")).toContainText(
    "All photos arrived",
  );
});
