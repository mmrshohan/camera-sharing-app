import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page } from "@playwright/test";

/** Axe violations that matter for release: serious and critical, WCAG 2.2 A/AA rules. */
export async function seriousA11yViolations(page: Page, include?: string): Promise<string[]> {
  let builder = new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22aa",
  ]);
  if (include) builder = builder.include(include);
  const result = await builder.analyze();
  return result.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`);
}

function luminance(rgb: string): number {
  const [r, g, b] = (rgb.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number) as [
    number,
    number,
    number,
  ];
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast between two computed CSS colors like "rgb(29, 29, 31)". */
export function cssContrast(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Serious and critical axe violations inside one phone's screen of the review shell. */
export async function phoneA11yViolations(page: Page, phoneTitle: string): Promise<string[]> {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    // A frame path: the phone's iframe, then the screen inside it.
    .include([`iframe[title="${phoneTitle}"]`, ".device__screen"])
    .analyze();
  return result.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id}: ${v.help} — ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

/**
 * Fails when something essential can't be seen: a control outside the screen that no scroll can
 * bring into view, or text cut short with an ellipsis.
 */
export async function assertNothingEssentialClipped(page: Page, screen: Locator): Promise<void> {
  void page;
  const problems = await screen.evaluate((root) => {
    const found: string[] = [];
    const rootBox = root.getBoundingClientRect();
    const name = (el: Element) =>
      `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 48)}"`;
    const shown = (el: Element) => {
      const style = getComputedStyle(el);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        el.getClientRects().length > 0 &&
        el.closest('[aria-hidden="true"], [inert]') === null
      );
    };
    const within = (box: DOMRect, area: DOMRect) =>
      box.left >= area.left - 1 &&
      box.right <= area.right + 1 &&
      box.top >= area.top - 1 &&
      box.bottom <= area.bottom + 1;
    const scroller = (el: Element): Element | null => {
      for (let p = el.parentElement; p && root.contains(p); p = p.parentElement) {
        const style = getComputedStyle(p);
        const scrolls = /(auto|scroll)/.test(`${style.overflowX} ${style.overflowY}`);
        if (scrolls && (p.scrollHeight > p.clientHeight + 1 || p.scrollWidth > p.clientWidth + 1))
          return p;
      }
      return null;
    };
    const controls = root.querySelectorAll(
      'button, a[href], input, select, textarea, [role="button"], [role="switch"], [role="radio"], [role="link"]',
    );
    for (const el of controls) {
      if (!shown(el)) continue;
      const box = el.getBoundingClientRect();
      if (within(box, rootBox)) continue;
      const area = scroller(el);
      if (area && within(area.getBoundingClientRect(), rootBox)) {
        const areaBox = area.getBoundingClientRect();
        const top = box.top - areaBox.top + area.scrollTop;
        const left = box.left - areaBox.left + area.scrollLeft;
        const reachable =
          top >= -1 &&
          top + box.height <= area.scrollHeight + 1 &&
          left >= -1 &&
          left + box.width <= area.scrollWidth + 1;
        if (reachable) continue;
      }
      found.push(`out of reach: ${name(el)}`);
    }
    for (const el of root.querySelectorAll("*")) {
      if (!shown(el)) continue;
      if (getComputedStyle(el).textOverflow === "ellipsis" && el.scrollWidth > el.clientWidth + 1) {
        found.push(`cut short: ${name(el)}`);
      }
    }
    return found;
  });
  expect(problems).toEqual([]);
}
