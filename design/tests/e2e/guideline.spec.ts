import { icons } from "../../src/icons/registry";
import { tokens } from "../../src/tokens/generated/tokens";
import { expect, gotoAndSettle, test } from "./fixtures";
import { cssContrast, seriousA11yViolations } from "./helpers";

test("the color section shows every token with both themes' values", async ({ page }) => {
  await gotoAndSettle(page, "/guideline");
  const section = page.getByTestId("guideline-color");
  for (const [name, light] of Object.entries(tokens.color.light)) {
    const dark = tokens.color.dark[name as keyof typeof tokens.color.dark];
    const row = section.getByTestId(`color-${name}`);
    await expect(row, name).toContainText(name);
    await expect(row, name).toContainText(light);
    await expect(row, name).toContainText(dark);
  }
  await expect(section).toContainText("4.70");
});

test("the icon section lists all 30 icons with SF and Material names", async ({ page }) => {
  await gotoAndSettle(page, "/guideline");
  const rows = page.getByTestId("icon-row");
  await expect(rows).toHaveCount(30);
  for (const [name, spec] of Object.entries(icons)) {
    const row = page.getByTestId("icon-row").filter({ hasText: spec.sf }).first();
    await expect(row, name).toContainText(spec.material);
  }
});

test("the guideline has no serious accessibility violations", async ({ page }) => {
  await gotoAndSettle(page, "/guideline");
  expect(await seriousA11yViolations(page)).toEqual([]);
});

test.describe("with reduced motion and a dark workspace", () => {
  test.use({ colorScheme: "dark" });

  test("nothing animates and text stays readable", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
    await gotoAndSettle(page, "/guideline");
    const running = await page
      .getByTestId("guideline-motion")
      .evaluate((section) =>
        [section, ...section.querySelectorAll("*")].reduce(
          (sum, el) => sum + el.getAnimations().length,
          0,
        ),
      );
    expect(running).toBe(0);
    const { color, background } = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      return { color: body.color, background: body.backgroundColor };
    });
    expect(cssContrast(color, background)).toBeGreaterThanOrEqual(4.5);
  });
});

test("a link to a section opens at that section, clear of the sticky bars", async ({ page }) => {
  await gotoAndSettle(page, "/guideline#motion");
  const heading = page.getByRole("heading", { level: 2, name: "Motion", exact: true });
  await expect(heading).toBeInViewport();
  const bar = await page.getByRole("navigation", { name: "Guideline contents" }).boundingBox();
  const box = await heading.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(bar!.y + bar!.height);
});
