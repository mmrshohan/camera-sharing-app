import { test as base, expect, type Page } from "@playwright/test";

// Every end-to-end test fails if the page logs an error or warning, or throws.
export const test = base.extend<{ consoleProblems: string[] }>({
  consoleProblems: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error" || message.type() === "warning") {
          problems.push(`${message.type()}: ${message.text()}`);
        }
      });
      page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
      await use(problems);
      expect(problems, "console errors or warnings").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export async function gotoAndSettle(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}
