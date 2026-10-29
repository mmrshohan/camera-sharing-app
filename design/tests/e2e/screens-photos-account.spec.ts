import type { FrameLocator, Page } from "@playwright/test";
import { expect, gotoAndSettle, test } from "./fixtures";

const phone = (page: Page, name: "Alex" | "Sarah"): FrameLocator =>
  page.frameLocator(`iframe[title="${name}'s phone"]`);

async function openShell(page: Page, search: string): Promise<void> {
  await gotoAndSettle(page, `/prototype?${search}&play=0`);
  await expect(page.locator(".proto-phone[data-ready]")).toHaveCount(2);
}

const sending = (page: Page) =>
  page.evaluate(() => {
    const w = (
      window as { __protoWorld?: { devices: { alex: { hostPhotos: { stage: string }[] } } } }
    ).__protoWorld;
    return w?.devices.alex.hostPhotos.map((p) => p.stage);
  });

test("D1, R7: offline photos need both phones; there is no Try again", async ({ page }) => {
  await openShell(page, "scenario=recovery-needs-both");
  const alex = phone(page, "Alex");
  const sarah = phone(page, "Sarah");
  for (const p of [alex, sarah]) {
    await expect(p.getByRole("dialog", { name: "Finish sending offline photos?" })).toBeVisible();
    await expect(p.getByRole("button", { name: "Try again" })).toHaveCount(0);
  }
  await alex.getByRole("button", { name: "Approve on this phone" }).click();
  await expect(alex.getByText("Approved here. Waiting for the other phone.")).toBeVisible();
  expect(await sending(page)).toEqual(["prepared", "prepared"]);
  await page.getByRole("button", { name: "Alex's phone settings" }).click();
  await page.getByRole("radio", { name: "Online" }).check();
  await page.keyboard.press("Escape");
  await sarah.getByRole("button", { name: "Approve on this phone" }).click();
  await expect.poll(() => sending(page)).toEqual(["reserved", "reserved"]);
  await expect(alex.getByText("Still on this phone: 2 sending")).toBeVisible();
});

const photosAccess = (page: Page) =>
  page.evaluate(
    () =>
      (
        window as {
          __protoWorld?: { devices: { sarah: { permissions: { photosAddOnly: string } } } };
        }
      ).__protoWorld?.devices.sarah.permissions.photosAddOnly,
  );

test("a prompt keeps its first answer: a tap on Don’t Allow as it fades changes nothing (code review 3)", async ({
  page,
}) => {
  await openShell(page, "scenario=system-photos-prompt&sarahDevice=iphone16pro");
  const prompt = phone(page, "Sarah").getByRole("alertdialog");
  await expect(prompt).toBeVisible();
  const deny = prompt.getByRole("button", { name: "Don’t Allow" });
  await prompt.getByRole("button", { name: "Allow", exact: true }).click();
  // The prompt is still on screen while it fades out, so a second tap can land on it.
  await deny.dispatchEvent("click");
  await expect(prompt).toBeHidden();
  expect(await photosAccess(page)).toBe("granted");
});

test("D11: with Photos access off, Save explains how to turn it on, and no prompt appears", async ({
  page,
}) => {
  await openShell(page, "scenario=photo-access-off&sarahDevice=iphone16pro");
  const sarah = phone(page, "Sarah");
  await sarah.getByRole("button", { name: "Save to Photos" }).click();
  await expect(sarah.getByText("Photos access is off")).toBeVisible();
  await expect(sarah.getByRole("button", { name: "Open Settings" })).toBeVisible();
  await expect(sarah.getByRole("alertdialog")).toHaveCount(0);
});

test("D9: a save that needs checking offers both ways forward, and stays after leaving", async ({
  page,
}) => {
  await openShell(page, "scenario=photo-needs-checking");
  const sarah = phone(page, "Sarah");
  const check = sarah.getByText(/Check Photos before saving again/);
  await expect(check).toBeVisible();
  await expect(sarah.getByRole("button", { name: "Open Photos" })).toBeVisible();
  await expect(sarah.getByRole("button", { name: "Save another copy" })).toBeVisible();
  await sarah.getByRole("button", { name: "Close" }).click();
  await expect(sarah.locator("[data-route]")).toHaveAttribute("data-route", "home");
  await sarah
    .getByRole("button", { name: /Photos save needs checking/ })
    .first()
    .click();
  await expect(check).toBeVisible();
});

test("a photo only in this app saves, and deleting it from the app asks first", async ({
  page,
}) => {
  await openShell(page, "scenario=photo-only-in-app");
  const sarah = phone(page, "Sarah");
  await sarah.getByRole("button", { name: "Delete from this app…" }).click();
  const confirm = sarah.getByRole("alertdialog", { name: "Delete from this app?" });
  await expect(confirm).toBeVisible();
  await confirm.getByRole("button", { name: "Cancel" }).click();
  await sarah.getByRole("button", { name: "Save to Photos" }).click();
  await expect(sarah.getByText("Saving to Photos")).toBeVisible();
});

test("D17: a report can block the account", async ({ page }) => {
  await openShell(page, "scenario=report-form");
  const sarah = phone(page, "Sarah");
  await expect(sarah.getByRole("switch", { name: "Block this account" })).toBeVisible();
  await sarah.getByRole("radio", { name: "Unwanted contact" }).click();
  await sarah.getByRole("switch", { name: "Block this account" }).click();
  await sarah.getByRole("button", { name: "Send report" }).click();
  await expect(sarah.getByText("Report sent")).toBeVisible();
});

test("signing out asks first and names what stays locked", async ({ page }) => {
  await openShell(page, "scenario=settings-list");
  const sarah = phone(page, "Sarah");
  await sarah.getByRole("button", { name: "Sign out" }).click();
  const confirm = sarah.getByRole("alertdialog", { name: "Sign out?" });
  await expect(confirm).toContainText("are only in this app");
  await confirm.getByRole("button", { name: "Sign out" }).click();
  await expect(sarah.locator("[data-route]")).toHaveAttribute("data-route", "welcome");
});

test("while lending, Settings can't be reached: the camera and the lock have no way there", async ({
  page,
}) => {
  await openShell(page, "scenario=camera-ready");
  const alex = phone(page, "Alex");
  await expect(alex.getByRole("button", { name: "Settings" })).toHaveCount(0);
  await page.getByRole("link", { name: "Lock: still sending" }).click();
  await expect(alex.locator("[data-route]")).toHaveAttribute("data-route", "lock");
  await expect(alex.getByRole("button", { name: "Settings" })).toHaveCount(0);
});

test("Settings opens each page and comes back", async ({ page }) => {
  await openShell(page, "scenario=settings-list");
  const sarah = phone(page, "Sarah");
  for (const [row, heading] of [
    ["Sign-in methods", "Sign-in methods"],
    ["Devices", "Devices"],
    ["Blocked accounts", "Blocked accounts"],
    ["Storage", "Storage"],
    ["Privacy", "Privacy"],
    ["Help", "Help"],
    ["Report a problem", "Report a problem"],
    ["Delete account", "Delete account"],
  ] as const) {
    await sarah.getByRole("button", { name: row, exact: true }).click();
    await expect(sarah.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    await sarah.getByRole("button", { name: "Back" }).click();
    await expect(sarah.locator("[data-route]")).toHaveAttribute("data-route", "settings");
  }
});

test("over a photo, Android's bars turn dark like the photo: light glyphs, dark buttons", async ({
  page,
}) => {
  await openShell(page, "scenario=photo-only-in-app");
  const sarah = phone(page, "Sarah");
  const buttons = sarah.locator(".home-indicator--buttons");
  await expect(buttons).toBeVisible();
  const background = await buttons.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(background).not.toBe("rgb(255, 255, 255)");
  const time = sarah.locator(".status-bar");
  const color = await time.evaluate((el) => getComputedStyle(el).color);
  expect(color).toBe("rgb(255, 255, 255)");
});

for (const [model, theme] of [
  ["iphone16pro", "light"],
  ["iphone16pro", "dark"],
  ["galaxyA15", "light"],
  ["galaxyA15", "dark"],
] as const) {
  test(`Settings: the bar matches the page, and iPhone's grouped rows stand out: ${model}, ${theme}`, async ({
    page,
  }) => {
    await openShell(page, `scenario=settings-list&sarahDevice=${model}&theme=${theme}`);
    const background = (selector: string) =>
      phone(page, "Sarah")
        .locator(selector)
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundColor);
    const screen = await background(".screen");
    expect(await background(".top-bar")).toBe(screen);
    if (model === "iphone16pro") expect(await background(".grouped-list__items")).not.toBe(screen);
  });
}
