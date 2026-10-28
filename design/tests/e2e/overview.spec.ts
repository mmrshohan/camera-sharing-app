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
const [latest] = parseChangelog(readFileSync(new URL("CHANGELOG.md", root), "utf8"));

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

  const links = page.getByTestId("overview-links");
  for (const name of ["Guideline", "Library", "Lab", "Prototype", "Changelog"]) {
    await expect(links.getByRole("link", { name: new RegExp(`^${name}`) })).toBeVisible();
  }
});
