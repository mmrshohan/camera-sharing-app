import type { FrameLocator, Page } from "@playwright/test";
import { expect, gotoAndSettle, test } from "./fixtures";

const phone = (page: Page, name: "Alex" | "Sarah"): FrameLocator =>
  page.frameLocator(`iframe[title="${name}'s phone"]`);

async function openShell(page: Page, scenario: string): Promise<void> {
  await gotoAndSettle(page, `/prototype?scenario=${scenario}&play=0`);
  await expect(page.locator(".proto-phone[data-ready]")).toHaveCount(2);
}

const photosOnAlex = (page: Page) =>
  page.evaluate(
    () =>
      (window as { __protoWorld?: { devices: { alex: { hostPhotos: unknown[] } } } }).__protoWorld
        ?.devices.alex.hostPhotos.length,
  );

test("one tap takes one photo; it starts sending and the pill pulses when it has left", async ({
  page,
}) => {
  await openShell(page, "camera-ready");
  const alex = phone(page, "Alex");
  await expect(alex.getByText("Sending to Sarah")).toBeVisible();
  const pulse = alex.locator("[data-pulse]");
  await expect(pulse).toHaveAttribute("data-pulse", "0");
  await alex.getByRole("button", { name: "Take photo" }).click();
  await page.getByRole("button", { name: "Play" }).click();
  await expect(alex.getByRole("button", { name: /1 sending/ })).toBeVisible({ timeout: 2000 });
  await expect(pulse).toHaveAttribute("data-pulse", "1", { timeout: 3000 });
  await page.getByRole("button", { name: "Pause" }).click();
  expect(await photosOnAlex(page)).toBe(1);
});

test("Review Focus 1: a double tap takes one photo and says the camera was busy (R10, D20)", async ({
  page,
}) => {
  await openShell(page, "camera-ready");
  const alex = phone(page, "Alex");
  await alex.getByRole("button", { name: "Take photo" }).dblclick();
  const toast = alex.getByText("Camera busy. That tap didn't take a photo.");
  await expect(toast).toBeVisible();
  expect(await photosOnAlex(page)).toBe(1);
  const toastBox = await toast.boundingBox();
  const shutterBox = await alex.getByRole("button", { name: /photo/i }).last().boundingBox();
  expect(toastBox && shutterBox).toBeTruthy();
  if (toastBox && shutterBox) {
    const apart =
      toastBox.y + toastBox.height <= shutterBox.y ||
      shutterBox.y + shutterBox.height <= toastBox.y ||
      toastBox.x + toastBox.width <= shutterBox.x ||
      shutterBox.x + shutterBox.width <= toastBox.x;
    expect(apart).toBe(true);
  }
});

test("D10: with Wi-Fi only on cellular, photos say they wait for Wi-Fi", async ({ page }) => {
  await openShell(page, "camera-wifi-only-waiting");
  await expect(
    phone(page, "Alex").getByRole("button", { name: /2 waiting for Wi-Fi/ }),
  ).toBeVisible();
});

test("End session asks first, on Keep shooting (D8); the lock then shows what's still sending", async ({
  page,
}) => {
  await openShell(page, "camera-ready");
  const alex = phone(page, "Alex");
  await alex.getByRole("button", { name: "Take photo" }).click();
  await alex.getByText("Sending to Sarah").click();
  const panel = alex.getByRole("dialog", { name: "Sending to Sarah" });
  await expect(panel).toBeVisible();
  await panel.getByRole("button", { name: "End session" }).click();
  const confirm = alex.getByRole("alertdialog", { name: "End session?" });
  await expect(confirm).toContainText("New photos stop. 1 photo keeps sending to Sarah.");
  await expect(confirm.getByRole("button", { name: "Keep shooting" })).toBeFocused();
  await confirm.getByRole("button", { name: "End session" }).click();
  await expect(alex.locator("[data-route]")).toHaveAttribute("data-route", "lock");
  await expect(alex.getByRole("heading", { name: "Phone returned to Alex" })).toBeVisible();
  await expect(alex.getByText("Still on this phone: 1 preparing")).toBeVisible();
});

test("D2: relaunching on the lock stays on the lock", async ({ page }) => {
  await openShell(page, "lock-locked");
  const alex = phone(page, "Alex");
  await page.getByRole("button", { name: "Adjust Alex's phone" }).click();
  await page.getByRole("button", { name: "Relaunch the app" }).click();
  await page.keyboard.press("Escape");
  await expect(alex.locator("[data-route]")).toHaveAttribute("data-route", "lock");
  await expect(alex.getByRole("heading", { name: "Phone returned to Alex" })).toBeVisible();
  await expect(alex.getByRole("button", { name: "Use Face ID" })).toBeVisible();
});

test("a canceled unlock says the phone is still locked, and promises nothing more", async ({
  page,
}) => {
  await openShell(page, "lock-authentication-canceled");
  await expect(phone(page, "Alex").getByText("Still locked.", { exact: true })).toBeVisible();
});

for (const model of ["iphoneSE3", "iphone16pro"] as const) {
  test(`at the largest text the camera's controls keep their size and never collide: ${model}`, async ({
    page,
  }) => {
    await gotoAndSettle(
      page,
      `/prototype?scenario=camera-ready&alexDevice=${model}&text=largest&play=0`,
    );
    await expect(page.locator(".proto-phone[data-ready]")).toHaveCount(2);
    const alex = phone(page, "Alex");
    await expect(alex.getByRole("button", { name: /^Flash/ })).toBeVisible();
    // Each zoom label fits its disc, and no two run together.
    const zoom = await alex.locator(".zoom-control__option").evaluateAll((options) =>
      options.map((option) => {
        const disc = option.getBoundingClientRect();
        const label = option.querySelector(".zoom-control__label");
        return {
          fits: !!label && label.scrollWidth <= (option as HTMLElement).clientWidth,
          right: disc.right,
          left: disc.left,
        };
      }),
    );
    expect(zoom.map((z) => z.fits)).not.toContain(false);
    for (const [i, z] of zoom.slice(1).entries())
      expect(z.left).toBeGreaterThanOrEqual(zoom[i]?.right ?? 0);
    // The pill stays on one line, clear of the flash button.
    const words = alex.locator(".destination-pill__pill > span").last();
    expect(
      await words.evaluate(
        (el) => (el as HTMLElement).offsetHeight < 2 * parseFloat(getComputedStyle(el).lineHeight),
      ),
    ).toBe(true);
    const pill = await alex.locator(".destination-pill__pill").boundingBox();
    const flash = await alex.getByRole("button", { name: /^Flash/ }).boundingBox();
    expect(
      pill && flash && (pill.x >= flash.x + flash.width || pill.x + pill.width <= flash.x),
    ).toBe(true);
  });
}

test("D7: the session panel lists each photo by number and label, never an image", async ({
  page,
}) => {
  await openShell(page, "session-photo-list");
  const panel = phone(page, "Alex").getByRole("dialog", { name: "Sending to Sarah" });
  await expect(panel).toBeVisible();
  await expect(panel.getByText("Photo 1", { exact: true })).toBeVisible();
  await expect(panel.getByText("Delivered").first()).toBeVisible();
  await expect(panel.getByText("Waiting for internet · Will retry")).toBeVisible();
  await expect(panel.locator("img")).toHaveCount(0);
});
