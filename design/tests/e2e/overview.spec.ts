import { readdirSync, readFileSync } from "node:fs";
import { parseChangelog } from "../../src/workspace/changelog";
import { expect, gotoAndSettle, test } from "./fixtures";

const root = new URL("../../", import.meta.url);
const version = (
  JSON.parse(readFileSync(new URL("package.json", root), "utf8")) as { version: string }
).version;
const componentCount = readdirSync(new URL("src/components/", root), {
  withFileTypes: true,
}).filter((entry) => entry.isDirectory()).length;
// The latest release with entries: an empty Unreleased section is skipped.
const latest = parseChangelog(readFileSync(new URL("CHANGELOG.md", root), "utf8")).find((release) =>
  Object.values(release.sections).some((items) => items.length > 0),
);

test("the overview shows the version, components by status, latest changes and links", async ({
  page,
}) => {
  await gotoAndSettle(page, "/");
  await expect(page.getByTestId("overview-version")).toHaveText(`v${version}`);

  let total = 0;
  for (const status of ["draft", "review", "final"]) {
    total += Number(await page.getByTestId(`count-${status}`).locator("dd").textContent());
  }
  expect(total).toBe(componentCount);

  const firstAdded = latest!.sections.Added[0]!.replaceAll("`", "");
  await expect(page.getByTestId("overview-latest")).toContainText(firstAdded);
  // A release shows its version; the Unreleased section shows its name.
  const label = latest!.date === null ? latest!.version : `v${latest!.version}`;
  await expect(page.getByTestId("overview-latest")).toContainText(label);

  const links = page.getByTestId("overview-links");
  for (const name of ["Guideline", "Library", "Lab", "Prototype", "Changelog"]) {
    await expect(links.getByRole("link", { name: new RegExp(`^${name}`) })).toBeVisible();
  }
});
