import type { FrameLocator, Page } from "@playwright/test";
import { expect, gotoAndSettle, test } from "./fixtures";

const phone = (page: Page, name: "Alex" | "Sarah"): FrameLocator =>
  page.frameLocator(`iframe[title="${name}'s phone"]`);

async function openShell(page: Page, scenario: string): Promise<void> {
  await gotoAndSettle(page, `/prototype?scenario=${scenario}&play=0`);
  await expect(page.locator(".proto-phone[data-ready]")).toHaveCount(2);
}

test("Alex lends his camera to Sarah, end to end", async ({ page }) => {
  await openShell(page, "home-photos");
  const alex = phone(page, "Alex");
  const sarah = phone(page, "Sarah");

  await sarah.getByRole("button", { name: "Borrow a camera" }).click();
  await expect(sarah.getByRole("dialog", { name: "Show this to Alex" })).toBeVisible();

  await alex.getByRole("button", { name: "Lend my camera" }).click();
  const prompt = alex.getByRole("alertdialog");
  await expect(prompt).toContainText("Would Like to Access the Camera");
  await prompt.getByRole("button", { name: "Allow", exact: true }).click();
  await expect(alex.locator("[data-route]")).toHaveAttribute("data-route", "scanner");

  await page.getByRole("button", { name: "Simulate scan" }).click();
  await expect(alex.getByRole("dialog", { name: "Lend your camera to Sarah?" })).toBeVisible();
  await expect(sarah.getByRole("dialog", { name: "Use Alex’s camera?" })).toBeVisible();

  await alex.getByRole("button", { name: "Lend camera" }).click();
  await expect(alex.getByText(/Waiting for Sarah · expires in \d:\d\d/)).toBeVisible();
  await sarah.getByRole("button", { name: "Receive on this phone" }).click();
  await expect(alex.locator("[data-route]")).toHaveAttribute("data-route", "camera");
  await expect(alex.getByText("Sending to Sarah")).toBeVisible();
  await expect(sarah.locator("[data-route]")).toHaveAttribute("data-route", "home");
});

test("D15: the username rule stays above the keyboard", async ({ page }) => {
  await openShell(page, "username-not-allowed");
  const sarah = phone(page, "Sarah");
  await sarah.getByRole("textbox", { name: "Username" }).focus();
  const keyboard = sarah.locator(".keyboard");
  await expect(keyboard).toBeVisible();
  const rule = sarah.getByText("Use 3 to 20 lowercase letters", { exact: false });
  await expect(rule).toBeVisible();
  const ruleBox = await rule.boundingBox();
  const keyboardBox = await keyboard.boundingBox();
  expect(ruleBox && keyboardBox && ruleBox.y + ruleBox.height <= keyboardBox.y).toBe(true);
});

test("words that don't match offer only Start again", async ({ page }) => {
  await openShell(page, "connect-words-dont-match");
  for (const name of ["Alex", "Sarah"] as const) {
    const p = phone(page, name);
    await expect(p.getByText("These phones don’t match. Start again.")).toBeVisible();
    await expect(p.getByRole("button", { name: "Start again" })).toBeVisible();
    await expect(p.getByRole("button", { name: "Lend camera" })).toHaveCount(0);
    await expect(p.getByRole("button", { name: "Receive on this phone" })).toHaveCount(0);
    await expect(p.getByRole("button", { name: "Allow" })).toHaveCount(0);
  }
});

test("D19: an offline invitation shows no code and no countdown", async ({ page }) => {
  await openShell(page, "invitation-offline");
  const sarah = phone(page, "Sarah");
  await expect(sarah.getByRole("dialog", { name: "Show this to Alex" })).toBeVisible();
  await expect(sarah.getByRole("img", { name: /Invitation code/ })).toHaveCount(0);
  await expect(sarah.getByText(/Expires in/)).toHaveCount(0);
});

test("an expired invitation can show a new code", async ({ page }) => {
  await openShell(page, "invitation-expired");
  const sarah = phone(page, "Sarah");
  await sarah.getByRole("button", { name: "Show a new code" }).click();
  await expect(sarah.getByRole("img", { name: /Invitation code/ })).toBeVisible();
  await expect(sarah.getByText(/Expires in/)).toBeVisible();
});

test("the scanner's username entry explains each problem", async ({ page }) => {
  await openShell(page, "scanner-username-no-match");
  const alex = phone(page, "Alex");
  await expect(alex.getByText("No account with that exact username")).toBeVisible();
  await alex.getByRole("textbox", { name: "Exact username" }).fill("maya");
  await alex.getByRole("button", { name: "Send request" }).click();
  await expect(alex.getByText("That account isn’t available")).toBeVisible();
});

test("Welcome signs in, then asks for a username", async ({ page }) => {
  await openShell(page, "welcome-ready");
  const sarah = phone(page, "Sarah");
  await sarah.getByRole("button", { name: "Continue with Google" }).click();
  await expect(sarah.locator("[data-route]")).toHaveAttribute("data-route", "username");
});
