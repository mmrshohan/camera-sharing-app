import type { Page } from "@playwright/test";
import { expect, gotoAndSettle, test } from "./fixtures";
import { cssContrast } from "./helpers";

// The workspace chrome, as the owner asked on 30 October 2026: white, minimal, and blue only where
// something is chosen. The header and the sticky strips are solid, so nothing shows through them.
const white = "rgb(255, 255, 255)";
const black = "rgb(0, 0, 0)";
const clear = "rgba(0, 0, 0, 0)";
const accentText = "rgb(0, 102, 204)";
const accentTint = "rgb(232, 241, 252)";

/** White at any opacity, such as a translucent bar over a white page, or nothing at all. */
const whiteOrClear = (color: string) =>
  color === clear ||
  /^rgba?\(255, 255, 255(, [0-9.]+)?\)$/.test(color) ||
  /^color\(srgb 1 1 1( \/ [0-9.]+)?\)$/.test(color);

const style = (page: Page, selector: string, property: "backgroundColor" | "color") =>
  page
    .locator(selector)
    .first()
    .evaluate((el, p) => getComputedStyle(el)[p], property);

/** A computed color as red, green, blue and alpha. */
function channels(color: string): [number, number, number, number] {
  const srgb = /^color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)$/.exec(color);
  if (srgb) {
    const [, r, g, b, a] = srgb;
    return [Number(r) * 255, Number(g) * 255, Number(b) * 255, a === undefined ? 1 : Number(a)];
  }
  const [r = 0, g = 0, b = 0, a = 1] = (color.match(/[\d.]+/g) ?? []).map(Number);
  return [r, g, b, a];
}

/** A translucent color painted over an opaque one, as the screen shows it. */
function over(top: string, bottom: string): string {
  const [r, g, b, a] = channels(top);
  const [br, bg, bb] = channels(bottom);
  const mix = (x: number, y: number) => Math.round(x * a + y * (1 - a));
  return `rgb(${mix(r, br)}, ${mix(g, bg)}, ${mix(b, bb)})`;
}

test("every workspace page sits on white", async ({ page }) => {
  for (const path of [
    "/",
    "/guideline",
    "/library",
    "/library/button",
    "/lab",
    "/changelog",
    "/nope",
  ]) {
    await gotoAndSettle(page, path);
    expect(await style(page, "body", "backgroundColor"), path).toBe(white);
    expect(await style(page, ".ws-header", "backgroundColor"), path).toBe(white);
  }
});

for (const scheme of ["light", "dark"] as const) {
  test(`in ${scheme} mode the header and the sticky strips are solid, with nothing showing through`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: scheme });
    for (const [path, selector] of [
      ["/", ".ws-header"],
      ["/library/button", ".ws-controls"],
      ["/guideline", ".g-contents"],
    ] as const) {
      await gotoAndSettle(page, path);
      const look = await page
        .locator(selector)
        .first()
        .evaluate((el) => {
          const s = getComputedStyle(el);
          return { fill: s.backgroundColor, filter: s.backdropFilter };
        });
      expect(look.fill, selector).toBe(scheme === "light" ? white : black);
      expect(look.filter, selector).toBe("none");
    }
  });
}

test("the prototype's scenarios, toolbar and stage are white too", async ({ page }) => {
  await gotoAndSettle(page, "/prototype?play=0");
  for (const selector of [".proto", ".proto-nav", ".proto-toolbar", ".proto-stage"]) {
    const color = await style(page, selector, "backgroundColor");
    expect(whiteOrClear(color), `${selector} is ${color}`).toBe(true);
  }
});

test("in the scenario list, hovering tints a row and the chosen one is blue", async ({ page }) => {
  await gotoAndSettle(page, "/prototype?play=0");
  const chosen = '.proto-nav__list a[aria-current="page"]';
  expect(await style(page, chosen, "color")).toBe(accentText);
  expect(await style(page, chosen, "backgroundColor")).toBe(accentTint);

  // Held by its name: once chosen, it no longer matches :not([aria-current]).
  const name = await page.locator(".proto-nav__list a:not([aria-current])").nth(3).innerText();
  const other = page.locator(".proto-nav").getByRole("link", { name, exact: true });
  expect(await other.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(clear);
  await other.hover();
  await expect
    .poll(() => other.evaluate((el) => getComputedStyle(el).backgroundColor))
    .not.toBe(clear);
  // Hover is a neutral tint: blue means chosen.
  expect(await other.evaluate((el) => getComputedStyle(el).color)).not.toBe(accentText);

  await other.click();
  await expect(other).toHaveAttribute("aria-current", "page");
  await expect.poll(() => other.evaluate((el) => getComputedStyle(el).color)).toBe(accentText);
});

test("in dark mode the chosen scenario stands out more than a hovered one, and stays readable", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await gotoAndSettle(page, "/prototype?play=0");
  const ground = await style(page, ".proto-nav", "backgroundColor");
  const chosen = page.locator('.proto-nav__list a[aria-current="page"]');
  const chosenFill = over(
    await chosen.evaluate((el) => getComputedStyle(el).backgroundColor),
    ground,
  );

  const name = await page.locator(".proto-nav__list a:not([aria-current])").nth(3).innerText();
  const other = page.locator(".proto-nav").getByRole("link", { name, exact: true });
  await other.hover();
  await expect
    .poll(() => other.evaluate((el) => getComputedStyle(el).backgroundColor))
    .not.toBe(clear);
  await page.waitForTimeout(200);
  const hoverFill = over(
    await other.evaluate((el) => getComputedStyle(el).backgroundColor),
    ground,
  );

  expect(cssContrast(chosenFill, ground)).toBeGreaterThan(cssContrast(hoverFill, ground));
  const words = await chosen.evaluate((el) => getComputedStyle(el).color);
  expect(cssContrast(words, chosenFill)).toBeGreaterThanOrEqual(4.5);
});

test("the header marks the current section with a fill, not an outline", async ({ page }) => {
  await gotoAndSettle(page, "/library");
  const current = page.locator('.ws-nav a[aria-current="page"]');
  await expect(current).toHaveText("Library");
  const look = await current.evaluate((el) => {
    const s = getComputedStyle(el);
    return { fill: s.backgroundColor, outline: s.boxShadow };
  });
  expect(look.fill).not.toBe(clear);
  expect(look.outline).toBe("none");
});

/** How far the header's sections fade out at their left and right edges, in pixels. */
const fades = (page: Page) =>
  page.locator(".ws-nav").evaluate((el) => {
    const s = getComputedStyle(el);
    return [s.getPropertyValue("--ws-fade-start"), s.getPropertyValue("--ws-fade-end")];
  });

test("at full width the header's sections don't fade", async ({ page }) => {
  await gotoAndSettle(page, "/changelog");
  expect(await fades(page)).toEqual(["0px", "0px"]);
});

for (const width of [700, 375]) {
  test.describe(`a ${width} px window`, () => {
    test.use({ viewport: { width, height: 800 } });

    test("the header stays one row, every section is reachable, and strips stay below it", async ({
      page,
    }) => {
      await gotoAndSettle(page, "/library/button");
      const header = page.locator(".ws-header");
      expect((await header.boundingBox())?.height).toBe(56);
      await expect(page.locator(".ws-brand span")).toBeHidden();

      const links = page.locator(".ws-nav a");
      const tops = await links.evaluateAll((all) => all.map((a) => a.getBoundingClientRect().top));
      expect(new Set(tops).size, "one row of sections").toBe(1);

      // Each section can be reached, its focus ring isn't cut off, and it sits clear of any fade.
      const nav = await page.locator(".ws-nav").boundingBox();
      if (!nav) throw new Error("no layout");
      for (const link of await links.all()) {
        await link.focus();
        await expect
          .poll(async () => {
            const box = await link.boundingBox();
            const [start = 0, end = 0] = (await fades(page)).map(Number.parseFloat);
            if (!box) return "no layout";
            const room = {
              left: box.x - nav.x,
              right: nav.x + nav.width - (box.x + box.width),
              top: box.y - nav.y,
              bottom: nav.y + nav.height - (box.y + box.height),
            };
            return room.left >= Math.max(4, start) - 0.5 &&
              room.right >= Math.max(4, end) - 0.5 &&
              room.top >= 3.5 &&
              room.bottom >= 3.5
              ? "clear"
              : JSON.stringify({ room, start, end });
          })
          .toBe("clear");
      }

      // Scrolled, the preview settings stick under the header, never behind it.
      const strip = page.locator(".ws-controls");
      await page.mouse.wheel(0, 900);
      await expect.poll(async () => (await strip.boundingBox())?.y).toBe(56);
      const bar = await header.boundingBox();
      expect((await strip.boundingBox())?.y).toBeGreaterThanOrEqual(
        (bar?.y ?? 0) + (bar?.height ?? 0),
      );
    });

    test("sections running past an edge fade out there, rather than end in a hard cut", async ({
      page,
    }) => {
      await gotoAndSettle(page, "/library/button");
      const nav = page.locator(".ws-nav");
      await nav.evaluate((el) => el.scrollTo(0, 0));
      await expect.poll(() => fades(page)).toEqual(["0px", "24px"]);
      await nav.evaluate((el) => el.scrollTo(el.scrollWidth, 0));
      await expect.poll(() => fades(page)).toEqual(["24px", "0px"]);
    });
  });
}

for (const scheme of ["light", "dark"] as const) {
  test(`in ${scheme} mode the preview settings' tracks stand out from the page`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await gotoAndSettle(page, "/library/button");
    const ground = await style(page, "body", "backgroundColor");
    const track = await style(page, ".ws-controls .ws-segmented__track", "backgroundColor");
    expect(cssContrast(over(track, ground), ground)).toBeGreaterThanOrEqual(1.08);
  });
}

test("a segmented control's name sits beside its track, not inside it", async ({ page }) => {
  await gotoAndSettle(page, "/library/button");
  const sets = await page.locator(".ws-controls .ws-segmented").all();
  expect(sets.length).toBeGreaterThan(1);
  for (const set of sets) {
    const legend = await set.locator("legend").boundingBox();
    const track = await set.locator(".ws-segmented__track").boundingBox();
    if (!legend || !track) throw new Error("no layout");
    expect(legend.x + legend.width).toBeLessThanOrEqual(track.x);
    // The options share the track equally, as Apple's segmented controls do.
    const widths = await set
      .locator(".ws-segmented__track label")
      .evaluateAll((all) => all.map((l) => Math.round(l.getBoundingClientRect().width)));
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);
  }
});

test("the guideline's headings and corners match the rest of the workspace", async ({ page }) => {
  await gotoAndSettle(page, "/guideline");
  const heading = await page
    .locator(".g-section > h2")
    .first()
    .evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        weight: s.fontWeight,
        tracking: Number.parseFloat(s.letterSpacing) / Number.parseFloat(s.fontSize),
      };
    });
  expect(heading.weight).toBe("600");
  expect(heading.tracking).toBeCloseTo(-0.02, 3);
  for (const selector of [".g-card", ".g-table-wrap", ".g-demo", ".g-icons li", ".g-anatomy"]) {
    const radius = await page
      .locator(selector)
      .first()
      .evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
    expect(radius, selector).toBe("12px");
  }
});

test("release notes run at a comfortable measure: 45 to 75 characters a line", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const path of ["/", "/changelog"]) {
    await gotoAndSettle(page, path);
    const perLine = await page
      .locator(".ws-notes li")
      .first()
      .evaluate((li) => {
        // Characters are counted as typographers count them, by the lowercase alphabet in the
        // notes' own type, so the measure doesn't depend on what this release's notes say.
        const probe = document.createElement("span");
        probe.style.cssText = "position: absolute; visibility: hidden; white-space: nowrap";
        probe.textContent = "abcdefghijklmnopqrstuvwxyz";
        li.append(probe);
        const average = probe.getBoundingClientRect().width / 26;
        probe.remove();
        return li.getBoundingClientRect().width / average;
      });
    expect(perLine, `${path}: characters a line`).toBeLessThanOrEqual(75);
    expect(perLine, `${path}: characters a line`).toBeGreaterThanOrEqual(45);
  }
});

for (const width of [1280, 375]) {
  test(`at ${width} px the first Tab lands on the brand, whichever section is open`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    for (const path of ["/", "/library", "/changelog", "/prototype?play=0"]) {
      await gotoAndSettle(page, path);
      await page.keyboard.press("Tab");
      await expect(page.locator(".ws-brand"), path).toBeFocused();
    }
  });
}
