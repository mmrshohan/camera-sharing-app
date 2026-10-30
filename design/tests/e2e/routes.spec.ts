import { readFileSync } from "node:fs";
import { expect, gotoAndSettle, test } from "./fixtures";

const { version } = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
) as {
  version: string;
};

const routes: [path: string, heading: string][] = [
  ["/", "Camera Sharing design system"],
  ["/guideline", "Guideline"],
  ["/library", "Library"],
  ["/lab", "Lab"],
  ["/prototype", "Prototype"],
  ["/changelog", "Changelog"],
];

for (const [path, heading] of routes) {
  test(`${path} renders its heading`, async ({ page }) => {
    await gotoAndSettle(page, path);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  });
}

// A phone that doesn't exist is an unknown address too, not a blank page (code review 9).
for (const path of ["/library/nope", "/lab/nope", "/does-not-exist", "/prototype/phone/nobody"]) {
  test(`${path} shows not found with a way home`, async ({ page }) => {
    await gotoAndSettle(page, path);
    await expect(page.getByRole("heading", { level: 1, name: "Not found" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Go to the overview" })).toHaveAttribute(
      "href",
      "/",
    );
  });
}

test("the top navigation links every section", async ({ page }) => {
  await gotoAndSettle(page, "/");
  const nav = page.getByRole("navigation", { name: "Workspace" });
  for (const name of ["Overview", "Guideline", "Library", "Lab", "Prototype", "Changelog"]) {
    await expect(nav.getByRole("link", { name })).toBeVisible();
  }
  await expect(page.getByRole("banner").getByText(`v${version}`)).toBeVisible();
});
