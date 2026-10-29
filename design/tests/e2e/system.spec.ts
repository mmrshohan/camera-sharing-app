import type { Page } from "@playwright/test";
import { expect, gotoAndSettle, test } from "./fixtures";
import { seriousA11yViolations } from "./helpers";

const example = (page: Page, title: string) =>
  page.locator(".ws-example").filter({ has: page.getByText(title, { exact: true }) });

async function ask(page: Page, platform: "ios" | "android", title: string) {
  await gotoAndSettle(page, `/library/permission-prompt?platform=${platform}`);
  const opener = example(page, title).getByRole("button", { name: "Ask" });
  await opener.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  return { opener, dialog };
}

test.describe("PermissionPrompt", () => {
  test("on Android, focus starts on Don’t allow; Escape answers no and returns focus", async ({
    page,
  }) => {
    const { opener, dialog } = await ask(page, "android", "Camera");
    await expect(dialog).toHaveAccessibleName(
      "Allow Camera Sharing to take pictures and record video?",
    );
    await expect(dialog.getByRole("button", { name: "Don’t allow" })).toBeFocused();
    // Once it has faded in. Only the prompt: Radix hides the rest of the page from assistive tech.
    await dialog.evaluate((node) => Promise.all(node.getAnimations().map((a) => a.finished)));
    expect(await seriousA11yViolations(page, ".permission")).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(
      example(page, "Camera").getByText("Answer: not allowed", { exact: true }),
    ).toBeVisible();
    await expect(opener).toBeFocused();
  });

  test("on iOS, the camera prompt shows its purpose and starts on Don’t Allow", async ({
    page,
  }) => {
    const { dialog } = await ask(page, "ios", "Camera");
    await expect(dialog).toContainText(
      "Takes the photos you send to the phone you’re paired with.",
    );
    await expect(dialog.getByRole("button", { name: "Don’t Allow" })).toBeFocused();
    await dialog.getByRole("button", { name: "Allow", exact: true }).click();
    await expect(
      example(page, "Camera").getByText("Answer: allowed", { exact: true }),
    ).toBeVisible();
  });

  test("on iOS, the notification prompt carries the system's own message", async ({ page }) => {
    const { dialog } = await ask(page, "ios", "Notifications");
    await expect(dialog).toContainText(
      "Notifications may include alerts, sounds, and icon badges.",
    );
  });

  test("Android never asks to save photos", async ({ page }) => {
    await gotoAndSettle(page, "/library/permission-prompt?platform=android");
    await expect(example(page, "Saving to Photos")).toContainText("Android doesn’t ask");
    await expect(
      example(page, "Saving to Photos").getByRole("button", { name: "Ask" }),
    ).toHaveCount(0);
  });
});
