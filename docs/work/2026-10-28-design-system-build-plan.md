# Design System Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the local design-system workspace in `design/`: Guideline, Lab, Library, Prototype and Changelog. It is driven by one token source, uses Library components for every prototype screen, and enforces product rules R1–R11 and fixes D1–D21 with tests.

**Architecture:** One Vite + React + TypeScript single-page app.
- **Tokens:** design tokens in W3C DTCG JSON generate CSS custom properties and typed constants.
- **Components:** each component lives in its own folder with an implementation, styles, metadata and examples. The workspace discovers them with `import.meta.glob`.
- **Prototype:** a pure `reduce(world, event)` model of Alex's and Sarah's phones, a simulated relay and a simulated clock. Scenarios are pure functions that build whole worlds.
- **Screens:** screens read their phone's view of the world through selectors and use only Library components.

**Tech Stack:**
- Already installed: Node 24.12.0, npm 11.6.2, React 19.2.7, TypeScript 7.0.2 (strict), Vite 8.1.3, `@vitejs/plugin-react` 6.0.3, `motion` 12.42.2, Radix Dialog 1.1.19 and Dropdown Menu 2.1.20, `@use-gesture/react` 10.3.1, `qrcode` 1.5.4, `@fontsource/roboto` 5.2.10, Prettier 3.9.10, Playwright 1.61.1.
- New: `react-router`, `vitest`, `@axe-core/playwright`, and a vendored subset of Material Symbols Rounded SVG paths from `@material-symbols/svg-400`. Exact versions are pinned in Task 2.

**Spec:** `docs/design/2026-10-28-design-system-design.md` (approved by the owner on 28 October 2026). Section references (§) point there.

## Global Constraints

- Work on branch `design/system-v1`, cut from `origin/main` (`ebf8edf`). Use Conventional Commits, ending each message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. The owner merges the PR. Never push to `main`.
- Everything lives under `design/`, except `docs/design/**`, `docs/decisions/**`, `docs/work/**` and the one-line `docs/governance/repository-plan.md` change.
- Node 24.12.0 (`.nvmrc`; `engines: {"node": ">=24.12 <25"}`). Every dependency is pinned exactly (no `^` or `~`), with a reviewed entry in `design/DEPENDENCIES.md` before install. Commit `package-lock.json`.
- The dev server listens on `127.0.0.1:4300` and end-to-end tests on `127.0.0.1:4301`, both with `strictPort`. No runtime network access: no remote fonts, scripts or images.
- TypeScript runs `strict` plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`. Prettier formatting is enforced by `npm run check`.
- Colors, font sizes and durations come only from tokens. `scripts/check-literals.ts` fails if it finds a hex, `rgb(`, `hsl(` color, a `font-size` or a `ms`/`s` duration anywhere in `src/components/**` or `src/prototype/**` (CSS or TSX) except through `var(--…)` or the `tokens` import.
- Contrast must reach 4.5:1 for text, and 3:1 for large text (at least 24 px, or bold at least 18.66 px), icons and control boundaries.
- Minimum sizes:
  - Text: 13 pt (iOS) and 14 sp (Android).
  - Touch targets: 44 pt (iOS) and 48 dp (Android).
  - Margins: 20 pt (iOS) and 16 dp (Android).
- Per screen: at most one filled button and one live dot.
- Copy: sentence case, no exclamation marks, numerals for counts, correct singular ("1 photo").
  - Device UI strings never contain "prototype", "simulated", "sample" or "demo"; those words belong only in the review shell.
  - Names, not roles: say "Sarah's phone", not "recipient device".
- Images are synthetic only. The one sample image is `coast.jpg`, derived from the 27 October synthetic fixture; its provenance is recorded in `design/ASSETS.md`.
- No Apple SF Symbols artwork in the repository. Icons are drawn from Material Symbols Rounded, and each one records its SF Symbol name.
- Reduce Motion (the operating-system setting, or the workspace toggle) replaces all spatial motion with a 200 ms cross-fade.

## Review Focus

1. **Double taps while an action is in flight** (shutter, rings, Allow/Approve, Save) must produce exactly one effect. Tested in Tasks 10, 21 and 25.
2. **The workspace in a small browser window** (down to 800 × 600): devices scale to fit, with no horizontal page scroll and every control reachable. Tested in Task 23.
3. **Switching device, theme or text size mid-flow**, with a panel open or the keyboard up, keeps the world state and keyboard focus and closes the keyboard. Tested in Task 23.
4. **Unknown routes and bad URL parameters** (`/library/nope`, `?scenario=nope`, `?alexDevice=foo`) show a not-found view, or defaults plus a notice. They never crash. Tested in Tasks 3 and 22.
5. **Reduce Motion with a dark workspace chrome:** no animation runs, and everything stays legible. Tested in Tasks 7 and 28.

---

## File structure

```text
design/
  package.json · package-lock.json · .nvmrc · tsconfig.json · vite.config.ts · vitest.config.ts · playwright.config.ts
  .prettierrc.json · .prettierignore · .gitignore · index.html
  README.md · CHANGELOG.md · DEPENDENCIES.md · ASSETS.md
  public/images/coast.jpg                       synthetic sample photo (1050 × 1400)
  tokens/color.light.tokens.json · color.dark.tokens.json
  tokens/type.ios.tokens.json · type.android.tokens.json · space.tokens.json · shape.tokens.json · motion.tokens.json
  tokens/contrast-pairs.json                    every fg/bg pair the UI uses, with its threshold
  scripts/build-tokens.ts · build-usage.ts · check-literals.ts · vendor-icons.ts · release-fetch.ts
  src/main.tsx · src/App.tsx (routes) · src/styles/base.css
  src/tokens/index.ts                           helpers + re-export of generated/tokens.ts
  src/tokens/generated/                         (git-ignored) tokens.css · tokens.ts
  src/icons/registry.ts · material-paths.ts (vendored) · LICENSE-material-symbols.txt
  src/shared/types.ts                           domain types shared by components and the model (Party, Words, SampleImage, DeviceModel, CameraCounts, TileStatus)
  src/components/<Name>/<Name>.tsx · <Name>.css · <Name>.meta.ts · <Name>.examples.tsx
  src/workspace/types.ts · registry.ts · approvals.ts · PreviewScope.tsx · WorkspaceLayout.tsx · changelog.ts · releases.ts
  src/workspace/pages/Overview · Guideline · LibraryIndex · LibraryComponent · LabIndex · LabComponent · Changelog · NotFound (.tsx)
  src/workspace/guideline/<Section>.tsx         one file per Guideline section
  src/workspace/generated/usage.json            (git-ignored) where-used map
  src/prototype/model/types.ts · world.ts · photos.ts · session.ts · selectors.ts · fixtures.ts
  src/prototype/copy/plural.ts · <screen>.ts    strings per screen + trust-sensitive keys
  src/prototype/scenarios/types.ts · build.ts · catalog.ts · url.ts
  src/prototype/shell/PrototypePage.tsx · Navigator.tsx · DeviceControls.tsx · ClockControls.tsx · Stage.tsx · DeviceHost.tsx
  src/prototype/screens/<Screen>.tsx            Welcome · Username · Home · Scanner · Camera · Lock · Photo · Settings · settings/<Page>.tsx
  src/prototype/panels/<Panel>.tsx              Invitation · Connect · Session · Recovery
  tests/unit/*.test.ts · tests/e2e/*.spec.ts
docs/decisions/0001-owner-approval-design-system.md
docs/design/boards/2026-10-28/{structure,visual-language,guideline-v0.2}.html + coast.jpg
```

Path aliases (`tsconfig.json`, `vite.config.ts` and `vitest.config.ts`): `@tokens` → `src/tokens`, `@icons` → `src/icons`, `@components/*` → `src/components/*`, `@workspace/*` → `src/workspace/*` and `@prototype/*` → `src/prototype/*`. Screens must import components through `@components/<Name>`; `build-usage.ts` relies on that.

## Ordering and owner checkpoints

- Tasks 1–8 build the foundations: repository setup, scaffold, tokens, icons and the workspace pages.
- Component groups and owner checkpoints:
  - Group 1: Tasks 9–10, then **Checkpoint G1**.
  - Group 2: Tasks 11–12, then **G2**.
  - Group 3: Tasks 13–16, then **G3**.
  - Group 4: Tasks 17–19, then **G4**.
- At each checkpoint the owner reviews the group in `/lab`. Approval is recorded in `src/workspace/approvals.ts`, and the group's components move from `review` to `final` at version 1.0.0.
- Building continues while a group is in review. The model tasks (20–22) and the shell (23) do not depend on approvals.
- A screen task (24–26) may start only when every component group it imports is final.
- Task 28 is the full test matrix, Task 29 adds release comparison, and Task 30 is the independent reviews and the PR.

---

### Task 1: Branch, approval record, spec fix, boards archive

**Files:**
- Create: `docs/decisions/0001-owner-approval-design-system.md`
- Create: `docs/design/boards/2026-10-28/structure.html`, `visual-language.html`, `guideline-v0.2.html`, `coast.jpg`
- Modify: `docs/governance/repository-plan.md` (the layout tree)
- Add (already written): `docs/design/2026-10-28-design-system-design.md` and this plan

**Interfaces:** Produces the branch `design/system-v1`. The approval record ID is `0001`.

- [ ] **Step 1:** `git fetch origin`, then `git switch -c design/system-v1 origin/main`. Verify that `git log -1 --format=%h` prints `ebf8edf`, or the newer `main` tip if it moved; if it moved, read the new commits for conflicts with `docs/design/`.
- [ ] **Step 2: Write the approval record** using the "Owner approval record" template in `docs/governance/templates.md`. Fields:
  - **ID / date:** 0001, 28 October 2026.
  - **Human approver:** the owner (co-founder), in the Claude Code session chat on 28 October 2026. Quote: "Approved. Write the build plan and start." Earlier scoped instructions: "do it very properly", "build each component… prototyping… finalize… keep it like previous and now", and "four group reviews". Review-cadence and authorization answers were given through the session's question prompt.
  - **Approved artifact:** `docs/design/2026-10-28-design-system-design.md`.
  - **Scope:** other development (design workspace).
  - **Permitted actions:** spec §14: create `design/`, install the §12 dependencies after recorded reviews, run on 127.0.0.1, commit on a branch, open a PR.
  - **Exclusions:** native apps, backend, deployment or hosting, paid services, and direct changes to `main`.
  - **Expiry:** merge of the design-system 1.0 PR.
  - **Recording actor:** Claude (AI agent), from the session transcript. This is not a signature; the owner may confirm by merging.
- [ ] **Step 3: Archive the boards.**
  - Copy the three board files from `.superpowers/brainstorm/s1-design/content/` (`structure.html`, `visual-language.html`, `guideline-v2.html` saved as `guideline-v0.2.html`) and `coast.jpg`.
  - In each board, prepend a standalone `<!doctype html><meta charset="utf-8"><title>…</title>` header, plus a `<style>` that defines the frame variables the fragments use. Light values: `--bg-primary:#f5f5f7; --bg-secondary:#fff; --border:#d1d1d6; --text-primary:#1d1d1f; --text-secondary:#86868b; --text-tertiary:#aeaeb2`.
  - Replace every `/files/coast.jpg` with `coast.jpg`. In `guideline-v0.2.html`, keep the Google Fonts `<link>`, since this is an archive and not runtime code. Note this in the file's header comment.
- [ ] **Step 4: Repository plan.** Under the `/` tree in `docs/governance/repository-plan.md`, add a line after `apps/`: `design/                      # design-system workspace (tokens, Library, prototype); web, localhost only` . In "Source-of-truth rules", add the row: `| Design tokens, components and prototype | design/ (approved design system; tokens/ is the single value source) | Re-typing values in native code instead of generating from tokens |`.
- [ ] **Step 5: Verify.** Open each archived board in the browser pane (any static server rooted at `docs/design/boards/2026-10-28/`) and confirm it renders with its image.
- [ ] **Step 6: Commit**

```bash
git add docs/design docs/decisions docs/work docs/governance/repository-plan.md
git commit -m "docs(design): approve design-system spec, plan and boards archive"
```

### Task 2: Dependency reviews and install

**Files:**
- Create: `design/DEPENDENCIES.md`, `design/ASSETS.md`, `design/package.json`, `design/package-lock.json`, `design/.nvmrc`, `design/.gitignore`

**Interfaces:** Produces the installed toolchain. Scripts are defined in Task 3.

- [ ] **Step 1: Pin the new versions.** Read the current versions with `npm view react-router version`, `npm view vitest version`, `npm view @axe-core/playwright version` and `npm view @material-symbols/svg-400 version`. Record each exact version.
- [ ] **Step 2: Write `DEPENDENCIES.md`.** It has one section per package: the 13 carried-over runtime and dev packages listed in the Tech Stack, plus the 4 new ones. Each section has these fields:
  - Purpose.
  - Alternatives considered (each with a reason).
  - License, from `npm view <pkg> license`.
  - Maintenance (last publish date, from `npm view <pkg> time.modified`).
  - Known advisories, from `npm audit --omit=dev` and the full `npm audit` after install, with the results quoted.
  - Transitive footprint (package count added).
  - Update owner ("design-system maintainer, reviewed at each release").

  `@material-symbols/svg-400` is a **source of vendored files only**: it is never a runtime dependency, never added to `package.json`, and is downloaded with `npm pack` in Task 5.
- [ ] **Step 3: Write `ASSETS.md`.**
  - `coast.jpg`: synthetic, generated for the 27 October prototype, no people, re-encoded to 1050 × 1400 JPEG quality 82.
  - Material Symbols paths: Apache-2.0, with the license file path.
- [ ] **Step 4: Write `package.json`.** Fields:
  - `"name": "camera-sharing-design"`, `"version": "0.1.0"`, `"private": true`, `"type": "module"`.
  - `engines` as in Global Constraints.
  - Dependencies, exact versions only:
    - Runtime: `react`, `react-dom`, `react-router`, `motion`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@use-gesture/react`, `qrcode`, `@fontsource/roboto`.
    - Development: `typescript`, `vite`, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`, `@types/qrcode`, `@types/node`, `prettier`, `vitest`, `@playwright/test`, `@axe-core/playwright`.
  - Pin `@types/*` to the versions already installed for the 27 October prototype, where present.
- [ ] **Step 5: Install.** Run `cd design && npm install`, then `npm audit`. Expected: lockfile created, no high or critical advisories. If any appear, stop and report them.
- [ ] **Step 6:** `.gitignore`: `node_modules/`, `dist/`, `.releases/`, `src/tokens/generated/`, `src/workspace/generated/`, `test-results/`, `playwright-report/`. Write `.nvmrc` = `24.12.0`.
- [ ] **Step 7: Commit:** `chore(design): add reviewed dependencies and lockfile`.

### Task 3: Workspace scaffold, routes and checks

**Files:**
- Create: `design/tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `.prettierrc.json`, `.prettierignore`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/styles/base.css`, `src/workspace/WorkspaceLayout.tsx`
- Create: `src/workspace/pages/{Overview,Guideline,LibraryIndex,LibraryComponent,LabIndex,LabComponent,Changelog,NotFound}.tsx` (placeholders with real headings)
- Create: `src/prototype/shell/PrototypePage.tsx` (placeholder)
- Create: `scripts/check-literals.ts`
- Test: `tests/unit/check-literals.test.ts`, `tests/e2e/routes.spec.ts`

**Interfaces:**
- **Routes:** `/` Overview · `/guideline` · `/library` · `/library/:id` · `/lab` · `/lab/:id` · `/prototype` · `/changelog` · `*` NotFound.
- **Scripts in `package.json`:**
  - `dev`: tokens, usage, then `vite --host 127.0.0.1 --port 4300 --strictPort`.
  - `build`: tokens, usage, then `tsc --noEmit && vite build`.
  - `test:unit`: `vitest run`.
  - `test:e2e`: `playwright test`.
  - `format` and `format:check`.
  - `check`: tokens, usage, `tsc --noEmit`, `format:check`, check-literals, `test:unit`, `test:e2e`.
  - `tokens` and `usage` are added in Tasks 4 and 8. Until then they are no-op scripts that print "pending".
- **`check-literals.ts` export:** `findLiterals(fileText: string, filePath: string): { line: number; match: string }[]`.

- [ ] **Step 1: Write failing unit tests for `findLiterals`.**
  - `"color: #0071E3;"` → 1 match.
  - `"color: var(--color-accent);"` → 0 matches.
  - `"font-size: 17px"` → 1 match.
  - `"transition: opacity 200ms"` → 1 match.
  - `"transition: opacity var(--motion-fade-duration)"` → 0 matches.
  - TSX `style={{ color: '#fff' }}` → 1 match.
  - `"width: 72px"` → 0 matches (layout sizes are allowed in this check; token use for them is enforced by review).
- [ ] **Step 2:** Run `npx vitest run tests/unit/check-literals.test.ts`. Expected: FAIL (module missing).
- [ ] **Step 3: Implement `findLiterals`** with regexes for `#[0-9a-fA-F]{3,8}\b`, `\brgba?\(`, `\bhsla?\(`, `font-size\s*:\s*[0-9.]+(px|pt|rem|em)` and `\b[0-9.]+m?s\b` inside `transition`/`animation` declarations. Add a CLI entry that scans `src/components/**` and `src/prototype/**`, prints `file:line match` and exits 1 when anything is found.
- [ ] **Step 4:** Run the unit tests. Expected: PASS.
- [ ] **Step 5: Write `tests/e2e/routes.spec.ts`.**
  - Each route renders its `h1`: "Camera Sharing design system", "Guideline", "Library", "Lab", "Prototype", "Changelog".
  - `/library/nope` and `/does-not-exist` render "Not found" with a link to `/`.
  - The page has no console errors.
- [ ] **Step 6: Implement the config and pages.**
  - `vite.config.ts`: `server: { host: '127.0.0.1', port: 4300, strictPort: true }`, and `preview` the same.
  - `playwright.config.ts`: `webServer: { command: 'npx vite --host 127.0.0.1 --port 4301 --strictPort', url: 'http://127.0.0.1:4301', reuseExistingServer: false }`, `use.baseURL` to match, and project `chromium` only.
  - `WorkspaceLayout` has a top navigation with these six links and a version badge read from `package.json`.
- [ ] **Step 7:** Run `npm run check`. Expected: PASS. Visit http://127.0.0.1:4300 in the browser pane.
- [ ] **Step 8: Commit:** `feat(design): scaffold workspace with routes and checks`.

### Task 4: Tokens and generator

**Files:**
- Create: `design/tokens/*.tokens.json` (7 files) and `design/tokens/contrast-pairs.json`
- Create: `scripts/build-tokens.ts`, `src/tokens/index.ts`
- Test: `tests/unit/tokens.test.ts`

**Interfaces:**

Types:

```ts
export type Platform = 'ios' | 'android';
export type Theme = 'light' | 'dark';
export type TextSize = 'default' | 'largest';
export type ColorName = 'accent' | 'accentText' | 'accentTint' | 'ink' | 'ink2' | 'ink3' | 'background' | 'surface'
  | 'separator' | 'fieldBorder' | 'success' | 'waiting' | 'danger' | 'live' | 'cameraScrim' | 'cameraScrimSelected';
export type LabelKind = 'live' | 'sending' | 'saved' | 'waiting' | 'neutral';
export type TypeStyle = 'numeral' | 'largeTitle' | 'title2' | 'title3' | 'headline' | 'body' | 'subheadline' | 'footnote' | 'label' | 'ringLabel';
export interface TypeSpec { family: string; size: number; line: number; weight: 400 | 500 | 600 | 700; tracking: number }
export interface Spring { response: number; dampingFraction: number }
export type SpringName = 'navigate' | 'panel' | 'press' | 'drop';
```

Exports from `src/tokens/index.ts`:

```ts
export const tokens: {
  color: Record<Theme, Record<ColorName, string>>;
  label: Record<Theme, Record<LabelKind, { fg: string; bg: string }>>;
  type: Record<Platform, Record<TextSize, Record<TypeStyle, TypeSpec>>>;
  space: Record<'1' | '2' | '3' | '4' | '5' | '6' | '8' | '12', number>;
  margin: Record<Platform, number>;
  target: Record<Platform, number>;
  shape: Record<string, number>;
  motion: {
    spring: Record<SpringName, Spring>;
    pressScale: { ring: number; button: number };
    pressDownMs: number;
    dip: { peak: number; ms: number };
    develop: { blur: number; saturation: number; ms: number; easing: [number, number, number, number] };
    pulse: { scale: number; ms: number };
    live: { min: number; periodMs: number };
    fadeMs: number;
  };
};
export function contrastRatio(fg: string, bg: string): number;            // hex #RRGGBB, WCAG 2.x formula
export function springToMotion(s: Spring): { type: 'spring'; stiffness: number; damping: number; mass: 1 };
export function androidLargestSp(sp: number): number;                      // AOSP scale 2.0 table, linear interpolation
```

- **CSS variables:**
  - Colors: `--color-<kebab>`, labels `--label-<kind>-fg|bg`, type `--type-<kebab>-size|line|weight|tracking|family`.
  - Space and touch: `--space-<n>`, `--margin`, `--target`.
  - Shape: `--radius-thumb`, `--radius-field`, `--radius-card`, `--radius-panel`, `--button-height`, `--text-button-height`, `--field-height`.
  - Rings: `--ring-size`, `--ring-stroke`, `--ring-gap`, `--ring-disc`, `--ring-icon`, `--shutter-size`, `--shutter-stroke`, `--shutter-disc`, `--progress-ring-size`, `--progress-ring-stroke`, `--live-dot-size`, `--live-dot-size-in-label`.
  - Labels and grid: `--grid-gap`, `--label-height`, `--label-pad-x`.
  - Motion: `--motion-<name>-duration` and `--motion-<name>-easing`.
- **Selectors:**
  - `:root,[data-theme="light"]` and `[data-theme="dark"]` for colors.
  - `[data-platform="ios"]` and `[data-platform="android"]` for type, margin and target.
  - `[data-platform="ios"][data-text-size="largest"]`, and the same for Android, for the largest type.

Values: copy them verbatim from spec §7.1 (colors and labels), §7.2 (type, default), §7.3 (space and shape), §7.4 (ring) and §7.5 (motion). Fonts:
- iOS family: `-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif`, using `"SF Pro Display"` first for `numeral`, `largeTitle` and `title2`.
- Android family: `Roboto, system-ui, sans-serif`.
- `label`: iOS 13/18 semibold; Android 14/20 medium.
- `ringLabel`: iOS 15/20 semibold; Android 14/20 medium.

Largest text size:
- **iOS** uses Apple's AX5 values (HIG Dynamic Type table, verified 28 Oct 2026):
  - largeTitle 60/70, title2 56/66, title3 55/65, headline 53/62, body 53/62.
  - subheadline 49/58, footnote 44/52, label 44/52, ringLabel 49/58.
  - numeral stays 80/80, because already-large text does not scale (my call, §7.2 note to add).
- **Android** applies `androidLargestSp` to each size and line height. Table for scale 2.0 from AOSP `FontScaleConverterFactory`: fromSp `[8,10,12,14,18,20,24,30,100]` → toDp `[16,20,24,26,30,34,36,38,100]`.

- [ ] **Step 1: Write failing tests** in `tests/unit/tokens.test.ts`:
  - `contrastRatio('#FFFFFF','#0071E3')` → `toBeCloseTo(4.70, 2)`.
  - `contrastRatio('#FFFFFF','#007AFF')` → `toBeCloseTo(4.02, 2)`.
  - `springToMotion({response:0.3,dampingFraction:0.7})` → stiffness `toBeCloseTo(438.65,1)`, damping `toBeCloseTo(29.32,1)`.
  - `androidLargestSp(14)===26`, `androidLargestSp(16)===28`, `androidLargestSp(8)===16`, `androidLargestSp(32)` `toBeCloseTo(39.77,2)`, `androidLargestSp(100)===100`.
  - `tokens.type.ios.largest.body` → `{size:53,line:62}`.
  - `tokens.type.ios.largest.title3` → `{size:55,line:65}`.
  - `tokens.color.light.accent==='#0071E3'` and `tokens.color.dark.accentText==='#2997FF'`.
  - **Every entry in `contrast-pairs.json` meets its `min` in both themes.** Each entry has the shape `{ fg: ColorName | 'label.<kind>.fg' | '#FFFFFF', bg: …, min: 4.5 | 3, note }`.
    - At least these pairs: accentText/background, accentText/surface, ink2/background, ink2/surface, white/accent, fieldBorder/background (3), success/background (3), waiting/background (3), danger/background, live/background (3), and each label fg/bg.
    - Do not include the forbidden pair ink2/accentTint. Instead assert that it fails: `contrastRatio(ink2, accentTint) < 4.5`.
  - The generated `tokens.css` contains `--color-accent: #0071E3;` and a `[data-theme="dark"]` block with `--color-accent-text: #2997FF;`.
- [ ] **Step 2:** Run `npx vitest run tests/unit/tokens.test.ts`. Expected: FAIL.
- [ ] **Step 3: Write the 7 DTCG files** (`$type`/`$value`; dimensions as `{ "value": 17, "unit": "px" }`; springs as `$type: "transition"` with `$extensions["camera-sharing.spring"]`).
- [ ] **Step 4: Implement the generator and helpers.** `build-tokens.ts` reads `tokens/*.tokens.json`, validates that every token path exists in both themes and both platforms, and writes `src/tokens/generated/tokens.css` and `tokens.ts`. `src/tokens/index.ts` re-exports the generated tokens and implements the 3 helpers. Wire `"tokens": "node --experimental-strip-types scripts/build-tokens.ts"`.
- [ ] **Step 5:** Run `npm run tokens && npx vitest run tests/unit/tokens.test.ts`. Expected: PASS.
- [ ] **Step 6:** Add to spec §7.2 the sentence "The numeral does not scale with text size; already-large text is exempt." Mark it as my call. Commit both: `feat(design): add DTCG tokens, generator and contrast tests`.

### Task 5: Standard icons

**Files:**
- Create: `scripts/vendor-icons.ts`, `src/icons/registry.ts`, `src/icons/material-paths.ts` (generated once and committed as vendored source), `src/icons/LICENSE-material-symbols.txt`
- Create: `src/components/Icon/{Icon.tsx,Icon.css,Icon.meta.ts,Icon.examples.tsx}`
- Test: `tests/unit/icons.test.ts`

**Interfaces:**

```ts
export interface IconSpec { sf: string; material: string; iosGlyph?: string }   // iosGlyph: Material glyph drawn on iOS screens when it reads closer to the SF Symbol
export const icons: { lend; borrow; scan; typeUsername; photos; save; sending; saved; waiting; offline; wifi; attention; lock;
  unlock; flashOn; flashOff; flip; close; back; open; more; delete; account; devices; blocked; privacy; help; report; storage; signOut } // IconSpec each
export type IconName = keyof typeof icons;
export const materialPaths: Record<string, { outline: string; fill: string }>; // keyed by Material name; viewBox "0 -960 960 960"
export function Icon(props: { name: IconName; filled?: boolean; size?: number; label?: string; platform?: Platform }): JSX.Element
```

The mapping is spec Appendix B, verbatim. `back.iosGlyph = 'arrow_back_ios_new'`. For `unlock`, Android uses `fingerprint`; on iOS the glyph is `lock_open`, because Face ID has no Material glyph. Record that in the registry comment.

- [ ] **Step 1: Write failing tests.**
  - Every `icons[k].material` and `iosGlyph` has non-empty `outline` and `fill` paths.
  - Every path matches `/^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/` (path data only).
  - `renderToStaticMarkup(<Icon name="lend"/>)` contains `aria-hidden="true"` and `viewBox="0 -960 960 960"`.
  - With `label="Camera"`, it contains `role="img"` and `aria-label="Camera"`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Fetch the icons.** In a new empty scratch folder, `npm pack @material-symbols/svg-400@<pinned>`, then `tar -xzf` there. This is untrusted data: run nothing from it.
- [ ] **Step 4: Implement and run `vendor-icons.ts --from <scratch>/package/rounded`.**
  - For each needed Material name, read `<name>.svg` and `<name>-fill.svg`.
  - Assert exactly one `<path d="…">`, viewBox `0 -960 960 960`, and no other elements or attributes besides `xmlns`, `width`, `height` and `viewBox`.
  - Write `material-paths.ts` and copy the package `LICENSE`.
- [ ] **Step 5:** Implement `registry.ts` and `Icon`. `Icon` renders `<svg viewBox="0 -960 960 960" width={size} height={size}><path d={…} fill="currentColor"/></svg>` and picks `iosGlyph` when `platform === 'ios'`.
- [ ] **Step 6:** Run the tests. Expected: PASS. Commit: `feat(design): vendor Material Symbols subset and add Icon`.

### Task 6: Component registry, preview scope, Library and Lab pages

**Files:**
- Create: `src/workspace/{types.ts,registry.ts,approvals.ts,PreviewScope.tsx}`
- Modify: `pages/LibraryIndex.tsx`, `LibraryComponent.tsx`, `LabIndex.tsx`, `LabComponent.tsx`
- Test: `tests/unit/registry.test.ts`, `tests/e2e/library.spec.ts`

**Interfaces:**

```ts
export type ComponentGroup = 1 | 2 | 3 | 4;
export type ComponentStatus = 'draft' | 'review' | 'final';
export type NativeStatus = 'not-started' | 'in-progress' | 'done';
export interface ChangelogEntry { version: string; date: string; summary: string }
export interface ComponentMeta {
  id: string; name: string; group: ComponentGroup; layer: 'brand' | 'system'; status: ComponentStatus; version: string;
  summary: string; anatomy: string[]; tokens: string[]; states: string[]; accessibility: string[]; motion: string[];
  native: { ios: string; android: string; status: Record<Platform, NativeStatus> }; changelog: ChangelogEntry[];
}
export interface PreviewContext { platform: Platform; theme: Theme; textSize: TextSize; reduceMotion: boolean }
export interface Example { id: string; title: string; state: string; render: (ctx: PreviewContext) => React.ReactNode }
export interface ComponentEntry { meta: ComponentMeta; examples: Example[] }
export const componentEntries: ComponentEntry[];        // import.meta.glob('../components/*/*.meta.ts' + '*.examples.tsx', { eager: true })
export function getComponent(id: string): ComponentEntry | undefined;
export const groupApprovals: { group: ComponentGroup; date: string; note: string }[];  // approvals.ts, starts []
export function PreviewScope(props: PreviewContext & { children: React.ReactNode; className?: string }): JSX.Element; // sets data-platform/-theme/-text-size/-reduce-motion
export function usePreview(): PreviewContext;
```

The Library component page shows the sections in spec §6, in this order:
1. Header: name, version, status, layer, group.
2. Controls: platform, theme, text size and reduce motion.
3. States gallery: every example rendered in a `PreviewScope`.
4. Anatomy and tokens.
5. Accessibility.
6. Motion.
7. "Where used", read from `usage.json`; Task 8 fills it.
8. Versions and compare; Task 29 fills it, and until then it shows "No earlier release yet".
9. Changelog.
10. Native.

The Lab page shows the same sections plus a promotion checklist, rendered from `meta`:
- States complete (more than one example and every `meta.states` entry covered).
- Both platforms and both themes viewed.
- Accessibility notes present.
- Motion specified, or "none".
- Group approved (present in `groupApprovals`).

- [ ] **Step 1: Write failing tests.**
  - Every `meta.version` is semver.
  - Every `meta.states` entry has at least one example whose `state` equals it.
  - A meta with `status:'final'` must have its `group` in `groupApprovals`. Name this test "promotion requires owner approval".
  - Ids are unique and kebab-case.
  - e2e: `/library` lists only final components; `/lab` lists draft and review components; toggling platform on a component page sets `data-platform="android"` on its preview containers; `/lab/nope` renders Not found.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement types, registry, `PreviewScope` and the four pages. The Icon component (Task 5) is the first entry, with `group: 1, status: 'review'`.
- [ ] **Step 4:** Run unit and e2e tests. Expected: PASS.
- [ ] **Step 5:** Commit: `feat(design): component registry, preview scope, Library and Lab pages`.

### Task 7: Guideline page (token-driven sections)

**Files:**
- Create: `src/workspace/guideline/{Principles,Color,Labels,Type,Space,Shape,Motion,Icons,Platforms,Writing,Accessibility}.tsx`
- Modify: `pages/Guideline.tsx`
- Test: `tests/e2e/guideline.spec.ts`

**Interfaces:**
- **Consumes:** `tokens`, `contrastRatio`, `icons`, `Icon`, `PreviewScope`.
- **Produces:** `GuidelineSection` slot props for the ring, labels, numeral and motion demos that later tasks add: `export function RingSection(): JSX.Element` (Task 10) and `NumeralSection` (Task 12).
- Every value shown is read from `tokens`, never typed into the page.
- The color table computes contrast live with `contrastRatio` and shows ✓ or ✗ against each pair's threshold.
- The Platforms section renders spec §6's platform table plus §7.9 as data from `src/workspace/guideline/platforms.ts`.
- Motion demos honor `reduceMotion`.

- [ ] **Step 1: Write failing e2e tests.**
  - `/guideline` shows every `ColorName` with its light and dark hex values from `tokens`, and the text "4.70".
  - Every row in the Icons grid shows both SF and Material names, 30 rows in total.
  - Axe finds no serious or critical violations.
  - With `page.emulateMedia({ reducedMotion: 'reduce' })` and the workspace dark color scheme (`colorScheme: 'dark'`), no element in the Motion section has a running animation (`el.getAnimations().length === 0`), and body text contrast is at least 4.5:1. This covers Review Focus 5.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement the sections. The visual layout follows the archived `guideline-v0.2.html` board: same order, card style and spacing scale, rebuilt from tokens.
- [ ] **Step 4:** Run. Expected: PASS. Commit: `feat(design): token-driven Guideline page`.

### Task 8: Overview, Changelog and where-used

**Files:**
- Create: `scripts/build-usage.ts`, `src/workspace/changelog.ts`, `design/CHANGELOG.md`
- Modify: `pages/Overview.tsx`, `pages/Changelog.tsx`, `pages/LibraryComponent.tsx` (where-used section)
- Test: `tests/unit/usage.test.ts`, `tests/unit/changelog.test.ts`

**Interfaces:**
- `scanUsage(files: { path: string; text: string }[]): Record<string, string[]>` maps component id to screen ids. It matches `from '@components/<Name>'` and converts the name to the component's kebab id. Screen id is the file path under `src/prototype/` without its extension.
- `parseChangelog(md: string): { version: string; date: string | null; sections: Record<'Added' | 'Changed' | 'Fixed' | 'Removed', string[]> }[]` reads the Keep a Changelog format (`## [x.y.z] - YYYY-MM-DD`, `## [Unreleased]`).
- `CHANGELOG.md` starts with `## [Unreleased]` and lists what exists.

- [ ] **Step 1: Write failing unit tests.**
  - `scanUsage` on a fixture with `import { RingButton } from '@components/RingButton'` in `screens/Home.tsx` returns `{ 'ring-button': ['screens/Home'] }`.
  - `parseChangelog` on a two-release fixture returns versions in file order, with "Unreleased" having date `null`.
- [ ] **Step 2:** Run. Expected: FAIL. **Step 3:** Implement, and wire `"usage": "node --experimental-strip-types scripts/build-usage.ts"`.
- [ ] **Step 4:** The Overview shows the version, the component count by status, the latest changelog entry and links. Run the tests. Expected: PASS. Commit: `feat(design): overview, changelog and where-used`.

### Task 9: Group 1 — Text, LiveDot, ProgressRing

**Files:**
- Create: `src/components/{Text,LiveDot,ProgressRing}/*` (tsx, css, meta, examples)
- Test: `tests/unit/group1.test.ts`

**Interfaces:**

```ts
export function Text(p: { style: TypeStyle; as?: 'p' | 'span' | 'h1' | 'h2' | 'h3'; tone?: 'ink' | 'ink2' | 'accentText' | 'danger'; children: React.ReactNode }): JSX.Element;
export function LiveDot(p: { size?: 'default' | 'inLabel'; label?: string /* default "Live" */ }): JSX.Element;      // role="img", breathing via --motion-live-*
export function ProgressRing(p: { value: number /* 0..1 */; label: string; size?: number }): JSX.Element;            // role="progressbar", aria-valuenow 0–100
```

Every meta starts at `status: 'review'`, `group: 1`, `version: '1.0.0'`. The states come from spec §7.4:
- LiveDot: `breathing` and `steady (reduce motion)`.
- ProgressRing: `0%`, `25%`, `75%`, `100%`.
- Text: one example per `TypeStyle`.

- [ ] **Step 1: Write failing tests** with `renderToStaticMarkup`:
  - `ProgressRing value=0.25` yields `aria-valuenow="25"`.
  - `value=1.4` clamps to 100 and `-1` clamps to 0.
  - `LiveDot` has `role="img"` and `aria-label="Live"`.
  - `Text style="footnote"` uses class `text--footnote` and no inline font-size.
- [ ] **Step 2:** Run (FAIL). **Step 3:** Implement with CSS from tokens; the arc is SVG `stroke-dasharray` driven by `value`. **Step 4:** Run (PASS). Visit `/lab`.
- [ ] **Step 5:** Commit: `feat(design): Text, LiveDot and ProgressRing`.

### Task 10: Group 1 — RingButton and Shutter (+ Guideline ring section)

**Files:**
- Create: `src/components/{RingButton,Shutter}/*`, `src/workspace/guideline/Ring.tsx`
- Test: `tests/unit/rings.test.ts`, `tests/e2e/rings.spec.ts`

**Interfaces:**

```ts
export function RingButton(p: { variant: 'filled' | 'tinted'; icon: IconName; label: string; state?: 'rest' | 'waiting' | 'unavailable';
  unavailableReason?: string; onPress?: () => void }): JSX.Element;
export function Shutter(p: { state: 'ready' | 'preparing' | 'blocked'; onCapture: () => void }): JSX.Element;
```

- **RingButton** is a native `<button>`. Its label is visible text below the ring and is also the accessible name.
  - `waiting` sets `aria-busy="true"`, ignores presses and shows the moving arc.
  - `unavailable` sets `aria-disabled="true"`, links `unavailableReason` through `aria-describedby`, and ignores presses.
  - Press: disc scale `tokens.motion.pressScale.ring` on pointer down; release with `springToMotion(tokens.motion.spring.press)`; fires `onPress` on release only, and only if the pointer is still inside the button.
- **Shutter** has `aria-label` "Take photo" (ready) or "Preparing photo" (preparing). `blocked` is `aria-disabled="true"` with `onCapture` not called.
- **Single effect while busy:** RingButton ignores presses while `state !== 'rest'`. The Shutter calls `onCapture` once per press; the model rejects taps while preparing (Task 21). This covers Review Focus 1.

- [ ] **Step 1: Write failing tests.**
  - Unit: markup checks for the `aria-busy` and `aria-disabled` cases.
  - e2e on `/lab/ring-button`: clicking the rest example increments its example counter by 1; a double-click increments it by 2, because there are two discrete presses at rest; clicking the waiting example leaves its counter unchanged; keyboard Space and Enter each fire once.
  - The ring meets 3:1 against the background: compute it from tokens in the unit test.
- [ ] **Step 2:** Run (FAIL). **Step 3:** Implement. Add `RingSection` to the Guideline (anatomy figure, family, states, live press demo). **Step 4:** Run (PASS).
- [ ] **Step 5:** Commit: `feat(design): RingButton and Shutter`.

**Checkpoint G1.** Ask the owner to review `/lab` group 1: Icon, Text, LiveDot, ProgressRing, RingButton, Shutter. On approval:
- Append `{ group: 1, date, note: "<owner's words>" }` to `approvals.ts`.
- Set the six metas to `status: 'final'`, and add a `CHANGELOG.md` Unreleased "Added" line per component.
- Commit: `feat(design): promote group 1 to Library 1.0.0`.

### Task 11: Group 2 — Button, IconButton, Toggle, TextField, ChoiceChips

**Files:**
- Create: `src/components/{Button,IconButton,Toggle,TextField,ChoiceChips}/*`
- Test: `tests/unit/actions.test.ts`, `tests/e2e/actions.spec.ts`

**Interfaces:**

```ts
export function Button(p: { variant: 'filled' | 'tinted' | 'plain' | 'destructive'; children: React.ReactNode; onPress?: () => void;
  disabled?: boolean; loading?: boolean; fullWidth?: boolean }): JSX.Element;
export function IconButton(p: { icon: IconName; label: string; onPress?: () => void; tone?: 'onLight' | 'onCamera' }): JSX.Element;
export function Toggle(p: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }): JSX.Element;
export function TextField(p: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; prefix?: string;
  state?: 'idle' | 'checking' | 'valid' | 'invalid'; message?: string; onSubmit?: () => void; autoFocus?: boolean }): JSX.Element;
export function ChoiceChips<T extends string>(p: { label: string; options: { id: T; label: string }[]; value: T | null; onChange: (v: T) => void }): JSX.Element;
```

- **Button.** Filled and tinted are capsules at `--button-height`; plain and destructive are at `--text-button-height`. `loading` sets `aria-busy` and ignores presses.
- **Layer.** Button and IconButton are brand components. Toggle, TextField and ChoiceChips are system components (spec §7.9):
  - Toggle uses the iOS switch geometry (51 × 31 pt) or Material 3 (52 × 32 dp, with a thumb that grows when on). It has `role="switch"` and `aria-checked`.
  - TextField on iOS is the brand field (50 pt, radius 12, 1 pt `fieldBorder`, accent focus ring). On Android it is the Material outlined field (56 dp, floating label).
  - TextField `invalid` sets `aria-invalid="true"`. The message element has an id referenced by `aria-describedby`, and sits inside an `aria-live="polite"` region.
  - ChoiceChips is a `role="radiogroup"` with roving tabindex.

- [ ] **Step 1: Write failing tests.**
  - Unit markup: Button `loading` has `aria-busy="true"`; TextField `invalid` has `aria-invalid` and `aria-describedby`; Toggle has `role="switch"` and `aria-checked="true"`.
  - e2e `/lab/text-field` (Android): the field height is 56 px inside `PreviewScope`. On iOS it is 50 px. Measure with `boundingBox` divided by the scope scale, which is 1 in Lab.
  - e2e `/lab/choice-chips`: arrow keys move selection.
  - IconButton's hit area is at least the platform target in both platforms.
- [ ] **Step 2:** Run (FAIL). **Step 3:** Implement. **Step 4:** Run (PASS). **Step 5:** Commit: `feat(design): Button, IconButton, Toggle, TextField and ChoiceChips`.

### Task 12: Group 2 — StatusLabel, Numeral, InlineMessage, Toast (+ Guideline sections)

**Files:**
- Create: `src/components/{StatusLabel,Numeral,InlineMessage,Toast}/*`, `src/workspace/guideline/{LabelsLive,NumeralSection}.tsx`
- Test: `tests/unit/status.test.ts`

**Interfaces:**

```ts
export function StatusLabel(p: { kind: LabelKind; children: React.ReactNode; icon?: IconName }): JSX.Element;    // default icons: live→LiveDot, sending→sending, saved→saved, waiting→waiting, neutral→devices
export function Numeral(p: { value: number; caption: string; detail?: string; live?: boolean }): JSX.Element;     // aria-label e.g. "14 photos, 2 on the way, live"
export function InlineMessage(p: { tone: 'neutral' | 'waiting' | 'problem'; title: string; body?: string;
  action?: { label: string; onPress: () => void } }): JSX.Element;                                                 // role="status"; problem → role="alert"
export function Toast(p: { message: string | null; placement: 'top' | 'aboveControls' }): JSX.Element;          // role="status"; pointer-events none
```

- [ ] **Step 1: Write failing tests.**
  - `Numeral value=14 caption="photos" detail="2 on the way" live` has `aria-label="14 photos, 2 on the way, live"` and contains exactly one LiveDot.
  - `StatusLabel kind="saved"` text and background come from `--label-saved-fg` and `--label-saved-bg` (class check).
  - `InlineMessage tone="problem"` has `role="alert"`.
  - `Toast message={null}` renders nothing visible (`hidden`).
- [ ] **Step 2:** Run (FAIL). **Step 3:** Implement, and add the Guideline Labels and Numeral sections. **Step 4:** Run (PASS). **Step 5:** Commit: `feat(design): StatusLabel, Numeral, InlineMessage and Toast`.

**Checkpoint G2.** Same as G1, for group 2: Button, IconButton, Toggle, TextField, ChoiceChips, StatusLabel, Numeral, InlineMessage, Toast.

### Task 13: Group 3 — TopBar, SectionHeader, ListRow, GroupedList, EmptyState, Avatar

**Files:**
- Create: `src/components/{TopBar,SectionHeader,ListRow,GroupedList,EmptyState,Avatar}/*`
- Test: `tests/unit/structure.test.ts`

**Interfaces:**

```ts
export function TopBar(p: { title: string; leading?: React.ReactNode; trailing?: React.ReactNode; collapsed?: boolean }): JSX.Element;
export function SectionHeader(p: { title: string; detail?: string }): JSX.Element;
export type RowTrailing = { kind: 'chevron' } | { kind: 'value'; text: string } | { kind: 'toggle'; checked: boolean; onChange: (v: boolean) => void } | { kind: 'label'; label: React.ReactNode };
export function ListRow(p: { title: string; subtitle?: string; icon?: IconName; trailing?: RowTrailing; onPress?: () => void; destructive?: boolean }): JSX.Element;
export function GroupedList(p: { header?: string; footer?: string; children: React.ReactNode }): JSX.Element;
export function EmptyState(p: { title: string; body?: string; action?: { label: string; onPress: () => void } }): JSX.Element;
export function Avatar(p: { name: string; size?: 36 | 40 | 44; decorative?: boolean }): JSX.Element;
```

- **TopBar** is the iOS large-title bar (34/41 bold) or the Material 3 large top app bar (32/40). `collapsed` shows the small inline title.
- **ListRow** with a `toggle` trailing makes the whole row the switch's label, so the whole row is tappable, and its minimum height is the target (44 pt or 48 dp).
- **Avatar** is `decorative` → `aria-hidden`.

- [ ] **Step 1: Write failing tests.**
  - A ListRow with a toggle renders one `role="switch"` whose accessible name is the row title.
  - A destructive row uses the `--color-danger` class.
  - `Avatar name="Sarah"` shows "S".
  - `EmptyState` with an action renders exactly one Button.
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS). **Step 5:** Commit: `feat(design): TopBar, SectionHeader, ListRow, GroupedList, EmptyState and Avatar`.

### Task 14: Group 3 — Panel and ConfirmDialog

**Files:**
- Create: `src/components/{Panel,ConfirmDialog}/*`
- Test: `tests/e2e/panels.spec.ts`

**Interfaces:**

```ts
export function Panel(p: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; container: HTMLElement | null;
  detent?: 'medium' | 'large'; dismissible?: boolean; initialFocus?: React.RefObject<HTMLElement | null> }): JSX.Element;
export function ConfirmDialog(p: { open: boolean; title: string; message: string; confirmLabel: string; cancelLabel: string;
  destructive?: boolean; onConfirm: () => void; onCancel: () => void; container: HTMLElement | null }): JSX.Element;
```

- **Panel** is built on Radix Dialog, portaled into `container` (the device screen).
  - Rise motion uses `springToMotion(spring.panel)`, behind a dim to 40%.
  - Dragging the grabber or handle down more than 76 pt, or flinging faster than 0.45 pt/ms, dismisses it when `dismissible`.
  - On iOS it is the system sheet look with grabber and top radius `--radius-panel`. On Android it is the Material modal bottom sheet with drag handle.
- **ConfirmDialog** is Radix Dialog with `role="alertdialog"`.
  - **Initial focus is always the cancel (safe) action (D8).**
  - Focus returns to the element that opened it (D12).
  - On iOS, destructive confirmations render as an action sheet and others as an alert. On Android they render as a Material alert dialog.
- **Visible focus** in panels uses the accent ring `outline: 2px solid var(--color-accent)` with offset 2px, applied inside portals (D12).
- Add the Guideline Motion section's "Panel" demo here, using a live Panel in a small `PreviewScope`.

- [ ] **Step 1: Write failing e2e tests** on Lab examples.
  - Opening ConfirmDialog focuses the "Keep" button.
  - Tab cycles only inside the dialog.
  - Escape closes it and focus returns to the opener.
  - The focused button has a computed `outline-style` of `solid`.
  - The Panel drag-dismiss example closes after a 120 px downward drag on the handle.
  - Axe finds no violations with the panel open.
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS). **Step 5:** Commit: `feat(design): Panel and ConfirmDialog with safe focus`.

### Task 15: Group 3 — PersonPair, VerificationWords, InvitationCode, Viewfinder

**Files:**
- Create: `src/components/{PersonPair,VerificationWords,InvitationCode,Viewfinder}/*`
- Test: `tests/unit/pairing.test.ts`

**Interfaces:**

```ts
// src/shared/types.ts (create; later tasks add to it)
export interface Party { name: string; handle: string; device: string }
export type Words = readonly [string, string, string, string, string, string];
// components
export function PersonPair(p: { from: Party; to: Party; fromTitle: string; toTitle: string }): JSX.Element;
export function VerificationWords(p: { words: Words; prompt: string }): JSX.Element;            // 2 rows × 3, Title 3
export function InvitationCode(p: { payload: string; handle: string; device: string; state: 'active' | 'expired' | 'offline'; secondsLeft: number | null }): JSX.Element;
export function Viewfinder(p: { state: 'scanning' | 'invalid' | 'denied' | 'unavailable' }): JSX.Element;
```

InvitationCode renders the QR (`qrcode` to SVG string to `<path>` data, no `innerHTML`) and the countdown **only when `state==='active'` (D19)**.

- [ ] **Step 1: Write failing tests.**
  - `InvitationCode state="offline"` markup contains no `<svg` and no countdown text.
  - `state="expired"` contains no `<svg`.
  - `state="active" secondsLeft={95}` shows "1:35".
  - `VerificationWords` renders 6 words in reading order.
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS). **Step 5:** Commit: `feat(design): pairing components`.

### Task 16: Group 3 — DestinationPill, ZoomControl, LastShotWell, CameraStatusLine

**Files:**
- Create: `src/components/{DestinationPill,ZoomControl,LastShotWell,CameraStatusLine}/*`, `src/prototype/copy/plural.ts`
- Test: `tests/unit/camera-components.test.ts`

**Interfaces:**

```ts
export function DestinationPill(p: { name: string; onPress: () => void; pulseKey: number }): JSX.Element;              // "Sending to Sarah"; pulses on pulseKey change
export function ZoomControl(p: { options: readonly number[]; value: number; onChange: (v: number) => void }): JSX.Element; // labels ".5", "1×", "2", "5"
export function LastShotWell(p: { image: SampleImage | null; onOpen: () => void; dropKey: number }): JSX.Element;
export interface CameraCounts { sent: number; sending: number; waitingInternet: number; waitingWifi: number; preparing: number }
export function CameraStatusLine(p: { counts: CameraCounts; onPress: () => void }): JSX.Element;
export function photos(n: number): string;                       // plural.ts: "1 photo", "3 photos"
export function cameraStatusText(c: CameraCounts): string;       // e.g. "4 sent · 1 sending · 2 waiting for Wi-Fi"; omits zero parts; "No photos yet" when all zero
```

Add `SampleImage = { src: string; position: string; zoom: number }` and `CameraCounts` to `src/shared/types.ts`. Samples are defined in `src/prototype/model/fixtures.ts` (Task 20). Add the Guideline Motion section's "Send" demo here: DestinationPill pulse plus LastShotWell drop, using `spring.drop`.

- [ ] **Step 1: Write failing tests.**
  - `photos(1)==='1 photo'`, `photos(0)==='0 photos'`, `photos(3)==='3 photos'`.
  - `cameraStatusText({sent:4,sending:1,waitingInternet:0,waitingWifi:2,preparing:0})==='4 sent · 1 sending · 2 waiting for Wi-Fi'` (D10, D16).
  - All zero → `'No photos yet'`.
  - The zoom labels for `[0.5,1,2]` are `['.5','1×','2']`, with the selected one marked `aria-pressed="true"`.
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS). **Step 5:** Commit: `feat(design): camera components and plural rules`.

**Checkpoint G3.** Same as G1, for group 3: the 16 components from Tasks 13–16.

### Task 17: Group 4 — PhotoTile, PhotoGrid, PhotoViewer

**Files:**
- Create: `src/components/{PhotoTile,PhotoGrid,PhotoViewer}/*`
- Test: `tests/unit/photos.test.ts`, `tests/e2e/photos.spec.ts`

**Interfaces:**

```ts
export type TileStatus = 'arriving' | 'onlyInApp' | 'saving' | 'saved' | 'needsChecking' | 'expired';   // in src/shared/types.ts
export function PhotoTile(p: { image: SampleImage; status: TileStatus; progress?: number; develop?: boolean; label: string; onOpen?: () => void }): JSX.Element;
export function PhotoGrid(p: { sections: { id: string; title: string; detail: string; tiles: React.ComponentProps<typeof PhotoTile>[] }[] }): JSX.Element;
export function PhotoViewer(p: { image: SampleImage; title: string; status: React.ReactNode; footer: React.ReactNode; onClose: () => void }): JSX.Element;
```

- **Tile badges:**
  - `saved`: none.
  - `onlyInApp`: neutral badge with the `devices` icon.
  - `saving`: ProgressRing.
  - `needsChecking`: `attention` icon in `--color-danger`.
  - `expired`: dimmed tile with the `waiting` icon.
  - `arriving`: ProgressRing over a blurred image.
- **Develop** plays once when `develop` turns true, using `tokens.motion.develop`. Under reduce motion it is a 200 ms fade.
- The tile's accessible name is `label` plus the status words.

- [ ] **Step 1: Write failing tests.**
  - The `saved` tile has no badge element.
  - The `needsChecking` tile's accessible name ends with "Photos save needs checking".
  - e2e: a develop example has a running animation; with reduced motion, `getAnimations()` returns only opacity animations of 200 ms or none.
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS). **Step 5:** Commit: `feat(design): photo components with develop`.

### Task 18: Group 4 — DeviceFrame, StatusBar, HomeIndicator, Keyboard

**Files:**
- Create: `src/components/{DeviceFrame,StatusBar,HomeIndicator,Keyboard}/*`, `src/components/DeviceFrame/devices.ts`
- Test: `tests/unit/devices.test.ts`, `tests/e2e/devices.spec.ts`

**Interfaces:**

```ts
export type DeviceModel = 'iphone16pro' | 'iphoneSE3' | 'galaxyA15' | 'androidCompact';   // in src/shared/types.ts
export interface DeviceSpec { model: DeviceModel; name: string; platform: Platform; width: number; height: number; safeTop: number; safeBottom: number;
  statusBar: number; cornerRadius: number; cutout: { kind: 'island'; width: number; height: number; top: number } | { kind: 'punchHole'; diameter: number; top: number } | { kind: 'none' };
  bottom: 'homeIndicator' | 'homeButton' | 'gestureBar' | 'threeButton'; biometric: 'faceId' | 'touchId' | 'fingerprint'; approximate: string[] }
export const devices: Record<DeviceModel, DeviceSpec>;
export function DeviceFrame(p: { model: DeviceModel; theme: Theme; textSize: TextSize; reduceMotion: boolean; children: React.ReactNode;
  screenRef?: React.Ref<HTMLDivElement>; scale?: number }): JSX.Element;
export function Keyboard(p: { platform: Platform; visible: boolean }): JSX.Element;
```

Device values (spec §10; iPhone 16 Pro verified 28 Oct):

| Device | Values | Approximate |
| --- | --- | --- |
| `iphone16pro` | 402 × 874, safeTop 62, safeBottom 34, statusBar 54, cornerRadius 62, island 126 × 37 at top 11, homeIndicator, faceId | `['cornerRadius','island']` |
| `iphoneSE3` | 375 × 667, safeTop 20, safeBottom 0, statusBar 20, cornerRadius 0, cutout none, homeButton, touchId | `[]` |
| `galaxyA15` | 412 × 891, safeTop 32, safeBottom 48, statusBar 32, cornerRadius 32, punchHole 22 at top 10, threeButton, fingerprint | `['width','height','safeTop','safeBottom','cornerRadius','punchHole']` |
| `androidCompact` | 360 × 800, safeTop 24, safeBottom 24, statusBar 24, cornerRadius 24, cutout none, gestureBar, fingerprint | `['cornerRadius']` |

- **DeviceFrame** sets `data-platform`, `data-theme`, `data-text-size` and `data-reduce-motion` on the screen element. It renders the StatusBar ("9:41"; the platform's signal, Wi-Fi and battery glyphs; iOS glyphs drawn as inline SVG paths in StatusBar, not SF Symbols) and the bottom affordance. It applies `transform: scale(scale)`.
- **Keyboard visibility is owned by DeviceFrame.** The keyboard shows while a text input inside the screen has focus. It hides **synchronously** when the focused input disconnects or blurs, or when the frame's `routeKey` prop changes (D21). Add `routeKey?: string` to the DeviceFrame props.

- [ ] **Step 1: Write failing tests.**
  - Unit: `devices.iphone16pro` equals `{width:402,height:874,safeTop:62,safeBottom:34}`; every `approximate` entry names a real key; Android devices have `platform:'android'`.
  - e2e on `/lab/device-frame`: focusing the example TextField shows the keyboard. Changing `routeKey` hides it within the same animation frame: assert `keyboard.isHidden()` immediately after the change.
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS). **Step 5:** Commit: `feat(design): device frames, status bars and keyboard`.

### Task 19: Group 4 — PermissionPrompt, LiveActivity, ProgressNotification

**Files:**
- Create: `src/components/{PermissionPrompt,LiveActivity,ProgressNotification}/*`
- Test: `tests/unit/system.test.ts`

**Interfaces:**

```ts
export function PermissionPrompt(p: { platform: Platform; kind: 'camera' | 'photosAddOnly' | 'notifications'; appName: string; purpose: string;
  onAllow: () => void; onDeny: () => void; container: HTMLElement | null }): JSX.Element;
export function LiveActivity(p: { variant: 'lockScreen' | 'island'; from: string; received: number; arriving: number; state: 'connected' | 'arriving' | 'done' }): JSX.Element;
export function ProgressNotification(p: { from: string; received: number; arriving: number; progress: number | null }): JSX.Element;
```

- **PermissionPrompt titles:**
  - iOS: "“Camera Sharing” Would Like to Access the Camera", "“Camera Sharing” Would Like to Add to Your Photos" and "“Camera Sharing” Would Like to Send You Notifications", with buttons "Don’t Allow" / "Allow" (Photos: "Don’t Allow" / "Allow"; notifications: "Don’t Allow" / "Allow").
  - Android: "Allow Camera Sharing to take pictures and record video?" with "While using the app" / "Only this time" / "Don’t allow"; "Allow Camera Sharing to send you notifications?" with "Allow" / "Don’t allow".
  - Android has no Photos add-only prompt; MediaStore needs no permission. Rendering `kind="photosAddOnly"` on Android throws in development and renders nothing in production builds.
- **Purpose strings** come from the copy in Task 24.
- **LiveActivity** copy: "Alex’s camera" · "14 photos" · "2 on the way"; done: "All photos arrived".

- [ ] **Step 1: Write failing tests.**
  - The iOS camera prompt contains "Would Like to Access the Camera".
  - The Android `photosAddOnly` prompt throws `Error('Android saves to MediaStore without a permission prompt')` under `import.meta.env.DEV`.
  - LiveActivity `done` shows "All photos arrived".
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS). **Step 5:** Commit: `feat(design): system surfaces`.

**Checkpoint G4.** Same as G1, for group 4: the 10 components from Tasks 17–19.

### Task 20: Model — types, fixtures, photo lifecycle and labels

**Files:**
- Create: `src/prototype/model/{types.ts,fixtures.ts,photos.ts,selectors.ts}`
- Test: `tests/unit/photos-model.test.ts`

**Interfaces:**

```ts
export type DeviceId = 'alex' | 'sarah';
export type PhotoId = string; export type SessionId = string;
export type Network = 'online' | 'slow' | 'offline';
export type Connection = 'wifi' | 'cellular';
export type Permission = 'notDetermined' | 'granted' | 'denied';
// Party, Words, SampleImage, DeviceModel, CameraCounts and TileStatus are imported from src/shared/types.ts
export type HostStage = 'preparing' | 'prepared' | 'reserved' | 'uploading' | 'uploaded' | 'delivered' | 'expired' | 'canceled';
export type RecipientStage = 'arriving' | 'stored' | 'exportPending' | 'saved' | 'exportUncertain' | 'actionRequired' | 'expired' | 'canceled';
export interface HostPhoto { id: PhotoId; sessionId: SessionId; stage: HostStage; reserved: boolean; retry: boolean; capturedAt: number; expiresAt: number; sample: string }
export interface CloudObject { photoId: PhotoId; sessionId: SessionId; stage: 'verified' | 'downloading' | 'receipted' | 'expired' | 'canceled'; expiresAt: number }
export interface RecipientPhoto { id: PhotoId; sessionId: SessionId; fromName: string; stage: RecipientStage; progress: number; retry: boolean; arrivedAt: number; sample: string }
export type HostLabel = 'Preparing' | 'Waiting for internet' | 'Waiting for Wi-Fi' | 'Sending' | 'Ready for Sarah' | 'Delivered' | 'Expired' | 'Canceled';
export type RecipientLabel = 'Arriving' | 'Only in this app' | 'Saving to Photos' | 'Saved to Photos' | 'Photos save needs checking' | 'Expired, never arrived' | 'Canceled before arrival';
export function hostLabel(p: HostPhoto, net: { network: Network; connection: Connection; wifiOnly: boolean }, recipientName: string): HostLabel;
export function recipientLabel(p: RecipientPhoto): RecipientLabel;
export function withRetry(label: string, retry: boolean): string;       // appends " · Will retry"
export const samples: Record<string, SampleImage>;                      // 12 deterministic crops of /images/coast.jpg
export const people: { alex: Party; sarah: Party; maya: Party };       // alex: iPhone 16 Pro; sarah: Galaxy A15; maya: iPhone 13
```

`hostLabel` maps per spec Appendix C. When `recipientName` is not "Sarah", the label is "Ready for <name>". The return type therefore widens to `` `Ready for ${string}` ``; adjust the union to `Exclude<HostLabel,'Ready for Sarah'> | `Ready for ${string}``.

- [ ] **Step 1: Write failing tests, one per Appendix C row.**
  - `prepared` + offline → "Waiting for internet".
  - `prepared` + cellular + `wifiOnly` → "Waiting for Wi-Fi" (R9/D10).
  - `uploaded` → "Ready for Sarah".
  - `delivered` → "Delivered".
  - `exportUncertain` → "Photos save needs checking".
  - `withRetry('Sending', true)` → "Sending · Will retry".
  - `samples` has 12 entries, all with `src: '/images/coast.jpg'`.
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS). **Step 5:** Commit: `feat(prototype): photo lifecycle labels and fixtures`.

### Task 21: Model — world, sessions, borrowing, lock, recovery, relay, clock

**Files:**
- Create: `src/prototype/model/{world.ts,session.ts}`
- Modify: `selectors.ts`
- Test: `tests/unit/rules.test.ts`

**Interfaces:**

```ts
export type Route = 'welcome' | 'username' | 'home' | 'scanner' | 'camera' | 'lock' | 'photo' | 'settings' | `settings/${SettingsPage}`;
export type SettingsPage = 'signin' | 'devices' | 'blocked' | 'storage' | 'privacy' | 'help' | 'report' | 'delete';
export type PanelId = 'invitation' | 'connect' | 'session' | 'recovery';
export type ConfirmId = 'endSession' | 'cancelUnsent' | 'deleteFromApp' | 'signOut' | 'deleteAccount';
export type PromptKind = 'camera' | 'photosAddOnly' | 'notifications';
export interface DeviceUi { route: Route; panel: PanelId | null; confirm: ConfirmId | null; prompt: PromptKind | null; lastShot: PhotoId | null;
  openPhoto: PhotoId | null; toast: string | null; dropKey: number; pulseKey: number; field: { value: string; state: 'idle' | 'checking' | 'valid' | 'invalid' } }
export interface DeviceState { id: DeviceId; model: DeviceModel; theme: Theme; textSize: TextSize; signedIn: boolean; username: string | null;
  network: Network; connection: Connection; permissions: Record<PromptKind, Permission>; settings: { autoSave: boolean; wifiOnly: boolean; notifications: boolean };
  mode: 'normal' | 'borrowing'; storageFull: boolean; busy: boolean; ui: DeviceUi; hostPhotos: HostPhoto[]; gallery: RecipientPhoto[] }
export interface Session { id: SessionId; attempt: number; host: Party; recipient: Party; words: Words; state: SessionState;
  approvals: { host: boolean; recipient: boolean; attempt: number }; startedAt: number | null; endsAt: number | null; endedAt: number | null }
export type SessionState = 'requested' | 'verifying' | 'active' | 'ended' | 'expired' | 'declined' | 'mismatch' | 'deviceChanged';
export interface Recovery { sessionId: SessionId; photoIds: PhotoId[]; approvals: { host: boolean; recipient: boolean }; state: 'needed' | 'approved' | 'declined' | 'expired' }
export interface World { clock: number; devices: Record<DeviceId, DeviceState>; session: Session | null; cloud: CloudObject[]; recovery: Recovery | null }
export type WorldEvent =
  | { type: 'tick'; ms: number } | { type: 'relaunch'; device: DeviceId } | { type: 'setNetwork'; device: DeviceId; network: Network; connection?: Connection }
  | { type: 'navigate'; device: DeviceId; route: Route } | { type: 'openPanel'; device: DeviceId; panel: PanelId } | { type: 'closePanel'; device: DeviceId }
  | { type: 'openConfirm'; device: DeviceId; confirm: ConfirmId } | { type: 'closeConfirm'; device: DeviceId }
  | { type: 'permission'; device: DeviceId; kind: PromptKind; allow: boolean } | { type: 'requestPermission'; device: DeviceId; kind: PromptKind }
  | { type: 'scanInvitation' } | { type: 'requestByUsername'; username: string } | { type: 'approve'; by: DeviceId } | { type: 'decline'; by: DeviceId }
  | { type: 'wordsMismatch' } | { type: 'deviceChanged' } | { type: 'startAgain' } | { type: 'capture' } | { type: 'endSession' } | { type: 'cancelUnsent' }
  | { type: 'unlock'; success: boolean } | { type: 'retryNetwork'; device: DeviceId } | { type: 'approveRecovery'; by: DeviceId } | { type: 'declineRecovery'; by: DeviceId }
  | { type: 'savePhoto'; id: PhotoId } | { type: 'deleteFromApp'; id: PhotoId } | { type: 'setSetting'; device: DeviceId; key: 'autoSave' | 'wifiOnly' | 'notifications'; value: boolean }
  | { type: 'typeField'; device: DeviceId; value: string } | { type: 'submitUsername'; device: DeviceId } | { type: 'signOut'; device: DeviceId } | { type: 'deleteAccount'; device: DeviceId };
export function reduce(world: World, event: WorldEvent): World;          // pure; never mutates its input
export const timing: { prepareMs: 700; uploadMs: 1200; downloadMs: 1000; saveMs: 800; checkUsernameMs: 600 };
export function hostSummary(w: World): CameraCounts;
export function hostItems(w: World): { index: number; label: string }[];   // no images, no recipient export state (R3/D7)
export function recipientTiles(w: World): { sectionId: string; title: string; detail: string; tiles: { id: PhotoId; sample: string; status: TileStatus; progress: number; develop: boolean; label: string }[] }[];
```

The `tick` reducer advances stage timers, applies deadlines (expiry), moves relay objects, and auto-saves on Sarah's phone when `autoSave` is on and Photos access is granted.

**Rules: one named test each.**
- **R1:** the camera screen's destination equals `session.recipient` for every capture. `requestByUsername` while a session is active returns the world unchanged.
- **R2 / D6:**
  - `approve` from both with the same `attempt` activates the session.
  - After `startAgain` the attempt increments and earlier approvals no longer count.
  - `wordsMismatch` and `deviceChanged` leave no event that activates the session except `startAgain`.
- **R3 / D3 / D7:**
  - Alex's `lastShot` is the most recent capture of the *current* session and becomes null on `relaunch`, `endSession` and a new session.
  - `hostItems` returns labels only.
  - Alex's `gallery` stays empty for borrowed sessions.
- **R4 / D2 / D4:**
  - `relaunch` with an active session keeps `mode:'borrowing'` and sets route `camera`, clearing `lastShot`.
  - `relaunch` after `endSession` sets route `lock`.
  - `navigate` to `home`, `photo` or `settings*` while `mode==='borrowing'` is replaced by `lock`.
  - `unlock{success:false}` stays locked.
  - `unlock{success:true}` sets `mode:'normal'` and route `home`.
  - `capture` when the session is not `active` is rejected with a toast and no photo.
- **R5 / D5 / D9:**
  - `savePhoto(A)` then opening photo B then `tick(saveMs)` → only A is `saved`.
  - Export-uncertain state is stored on the photo and survives navigation.
  - Upload completion alone never sets a recipient photo to `stored`.
- **R6:**
  - `endSession` keeps reserved, uploading and uploaded photos moving.
  - `cancelUnsent` cancels only undelivered ones and never touches Sarah's `stored` or `saved` photos.
- **R7 / D1:**
  - Unreserved `prepared` photos at `endSession` create `recovery.needed`.
  - `retryNetwork` does not move them.
  - Only `approveRecovery` by both moves them to `reserved`.
  - `declineRecovery` from either side sets `declined`.
  - The recovery `expiresAt` is the photo's original deadline.
- **R8 / D11:**
  - `savePhoto` with Photos `denied` leaves `prompt` null and the photo's stage unchanged. It never re-prompts. The Photo screen shows the access-off message from `permissions.photos` (Task 26).
  - With `notDetermined` it sets `prompt:'photosAddOnly'` on iOS. On Android it saves directly, because MediaStore needs no permission.
- **R9 / D10:** with `wifiOnly` and `connection:'cellular'`, prepared photos stay `prepared` and `hostSummary.waitingWifi` counts them.
- **R10:** `capture` while `busy` returns the same photo count, sets `ui.toast` "Camera busy. That tap didn't take a photo." and does not change `dropKey`. It covers Review Focus 1 for the shutter.
- **R11:**
  - `signOut` sets `signedIn:false` and keeps `gallery`, locked.
  - `deleteAccount` clears `gallery` and keeps no session.
  - Neither changes photos marked `saved`; they are counted as remaining in Photos in the confirm copy.

- [ ] **Step 1: Write all rule tests above** in `tests/unit/rules.test.ts`, using `createWorld()` from Task 22's builder or a local minimal builder in the test file.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement `reduce`** as a switch over events. Each case returns new objects (spread); use `structuredClone` only in tests.
- [ ] **Step 4:** Run. Expected: PASS. Also add the test "reduce never mutates its input": deep-freeze the world with `Object.freeze` recursively, then run 200 random events from a seeded list and assert no throw.
- [ ] **Step 5:** Commit: `feat(prototype): world model enforcing R1–R11`.

### Task 22: Scenarios, URL state and coverage

**Files:**
- Create: `src/prototype/scenarios/{types.ts,build.ts,catalog.ts,url.ts}`
- Test: `tests/unit/scenarios.test.ts`

**Interfaces:**

```ts
export type Journey = 'start' | 'connect' | 'capture' | 'photos' | 'account' | 'system';
export interface Scenario { id: string; journey: Journey; title: string; focus: DeviceId | 'both'; main?: boolean; build: () => World }
export const scenarios: readonly Scenario[];
export function getScenario(id: string): Scenario | undefined;
export function createWorld(opts?: Partial<{ alexModel: DeviceModel; sarahModel: DeviceModel; clock: number }>): World;   // build.ts; both signed in, home, idle
export interface UrlState { scenario: string; view: 'single' | 'dual'; focus: DeviceId; alexDevice: DeviceModel; sarahDevice: DeviceModel; theme: Theme; text: TextSize; compare: string | null }
export function parseUrlState(search: string): { state: UrlState; notices: string[] };   // invalid values → defaults + a notice each
export function formatUrlState(s: UrlState): string;
```

- **Catalog.** One scenario per state in spec §9, about 100. Ids are `<where>-<state>` in kebab-case, for example `home-live-receiving`, `connect-words-dont-match` and `camera-wifi-only-waiting`. Each journey's first scenario is `main: true`, as is the main state of every screen.
- **Defaults:** scenario `home-photos`, view `dual`, focus `sarah`, `alexDevice` `iphone16pro`, `sarahDevice` `galaxyA15`, theme light, text default, compare null.

- [ ] **Step 1: Write failing tests.**
  - **Coverage:** a `requiredStates` array transcribed from spec §9, one string per state, maps 1:1 to scenario ids (every state has a scenario, no extras without a matching state).
  - **Purity (D13):**
    - For every scenario, `build()` twice gives deep-equal results.
    - Mutating the first result's nested objects does not change the second.
    - Applying `{type:'capture'}` to one world leaves a fresh `build()` unchanged.
  - **Invariants:** for every scenario world, `devices.alex.gallery` contains no photo of a session where Alex is host; at most one device route shows a live dot; when `mode==='borrowing'`, the route is `camera` or `lock`.
  - **URL:**
    - `parseUrlState('?scenario=nope&alexDevice=foo')` returns defaults plus 2 notices.
    - `formatUrlState(parseUrlState(x).state)` round-trips for valid input.
- [ ] **Step 2:** Run. Expected: FAIL. **Step 3:** Implement `build.ts` helpers and the catalog. **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit: `feat(prototype): pure scenarios covering every state`.

### Task 23: Review shell

**Files:**
- Create: `src/prototype/shell/{PrototypePage.tsx,Navigator.tsx,DeviceControls.tsx,ClockControls.tsx,Stage.tsx,DeviceHost.tsx,useWorld.ts}`
- Test: `tests/e2e/shell.spec.ts`

**Interfaces:**

```ts
export function useWorld(initial: World): { world: World; dispatch: (e: WorldEvent) => void; reset: () => void; playing: boolean; setPlaying: (p: boolean) => void };
// ticker: dispatches {type:'tick', ms:100} every 100 ms while playing; paused by default in tests via ?play=0
export function DeviceHost(p: { id: DeviceId; world: World; dispatch: (e: WorldEvent) => void; scale: number }): JSX.Element;  // DeviceFrame + screen router + panels + prompts + keyboard
export function useDeviceView(id: DeviceId): { device: DeviceState; world: World; dispatch: (e: WorldEvent) => void; screen: HTMLElement | null }; // context provided by DeviceHost
export function Stage(p: { children: React.ReactNode; count: 1 | 2 }): JSX.Element;  // computes scale = min(availW / totalW, availH / maxH, 1)
```

- **Shell parts:**
  - A navigator grouped by `Journey`, listing scenario titles. Selecting one loads `build()`.
  - Per-phone controls: device model, theme, text size, network, connection and Relaunch.
  - Clock controls: play/pause, +1 min, +1 h, +12 h.
  - View toggle (single/dual) with a focus selector.
  - Reset, and Present mode, which hides everything but the stage.
- The URL updates with `formatUrlState` on every change and is read once on load.

- [ ] **Step 1: Write failing e2e tests.**
  - The default URL shows two device frames.
  - Choosing scenario `camera-ready` updates the URL and shows the shutter.
  - **Review Focus 2:**
    - At viewport 800 × 600: no horizontal page scroll (`document.documentElement.scrollWidth <= innerWidth`), both frames fully inside the viewport, and the navigator scrollable.
    - At 1440 × 900 the scale is at most 1.
  - **Review Focus 3:**
    - With the Connect panel open on Sarah's phone, switching Sarah to dark keeps the panel open, keeps focus inside it, and leaves the world unchanged (compare the serialized `world` before and after, minus theme).
    - With the keyboard visible, switching device hides the keyboard.
  - Relaunch on Alex during `camera-ready` keeps the camera visible. Relaunch during `lock-locked` keeps the lock.
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS). **Step 5:** Commit: `feat(prototype): review shell with dual phones and clock`.

### Task 24: Screens — Welcome, Username, Home, Invitation, Scanner, Connect

**Files:**
- Create: `src/prototype/screens/{Welcome,Username,Home,Scanner}.tsx`, `src/prototype/panels/{Invitation,Connect}.tsx`
- Create: `src/prototype/copy/{welcome,username,home,invitation,scanner,connect,permissions}.ts`, `src/prototype/copy/index.ts`
- Test: `tests/unit/copy.test.ts`, `tests/e2e/screens-connect.spec.ts`

**Interfaces:**

Each copy module exports two things:
- `strings`: an object of strings or functions of counts and names.
- `trust`: an array of keys that are trust-sensitive (spec §11).

`copy/index.ts` exports `allCopy: { module: string; strings: Record<string, unknown>; trust: readonly string[] }[]`. Each screen exports `const screenId: string` (matching its file path) and a component `(p: { id: DeviceId }) => JSX.Element` that reads its phone through `useDeviceView(id)` from `shell/DeviceHost.tsx`.

**Fixed copy (spec §9 and 05):**
- **Home empty:** "Photos you receive will appear here."
- **Rings:** "Borrow a camera", "Lend my camera".
- **Live Home:** numeral caption "photos", detail `${n} on the way`.
- **Invitation:** title "Show this to Alex", expired "Invitation expired", offline "Connect to the internet to show your invitation" (no code).
- **Scanner:**
  - Invalid code: "That's not an invitation from this app".
  - Access off: "Camera access is off", with action "Open Settings".
  - Camera in use: "Your camera is in use by another app".
  - Username field label "Exact username". No match: "No account with that exact username". Too many requests: "Too many requests. Try again in a few minutes". Not available: "That account isn't available".
- **Connect:**
  - Alex's title "Lend your camera to Sarah?" with button "Lend camera".
  - Sarah's title "Use Alex's camera?" with button "Receive on this phone".
  - Words prompt "Sarah should see the same six words".
  - Mismatch: "These phones don't match. Start again." (spec 05), with the button "Start again" and no Allow.
  - Device changed: "Sarah's receiving phone changed. Start again."
  - Waiting: "Waiting for Sarah · expires in 2:00".
  - Fine print, trust-sensitive: "Photos go only to Sarah's phone. Nothing is saved to your Photos. Whoever holds this phone can see the preview."
- **Permission purposes:**
  - Camera: "Take photos for the person you're lending to, and scan invitations."
  - Photos: "Save photos you receive to your library. The app can't see your other photos."
  - Notifications: "Know when photos arrive."

- [ ] **Step 1: Write failing tests.**
  - Copy lint: no device-UI string matches `/prototype|simulated|sample|demo/i` (D18); no `!`; every `trust` key exists in its `strings`.
  - **e2e journey on default devices:**
    1. `home-photos` → tap "Lend my camera" on Alex → iOS camera prompt → Allow → Scanner.
    2. "Scan" (review-shell event button "Simulate scan") → Connect on both.
    3. Alex: "Lend camera", then Sarah: "Receive on this phone" → Alex Camera with "Sending to Sarah".
  - e2e: Username "not allowed" shows its message visible above the keyboard (D15): its bounding box bottom is at most the keyboard's top.
  - e2e: the mismatch scenario has no button labelled "Lend camera" or "Allow".
  - e2e: Invitation offline has no QR and no countdown (D19).
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS). **Step 5:** Commit: `feat(prototype): start and connect screens`.

### Task 25: Screens — Camera, Session panel, confirmations, Lock

**Files:**
- Create: `src/prototype/screens/{Camera,Lock}.tsx`, `src/prototype/panels/Session.tsx`, `src/prototype/copy/{camera,session,lock}.ts`
- Test: `tests/e2e/screens-capture.spec.ts`

**Fixed copy:**
- **Camera:**
  - Busy: toast "Camera busy. That tap didn't take a photo."
  - Queue full: "Too many photos waiting. Wait for some to send."
  - Storage full: "This phone is out of space. Free up space to keep taking photos" (capture blocked).
  - Interrupted: "The camera was interrupted".
  - Ending soon: "Session ends in 2 minutes".
  - Ended: "This session has ended".
- **End session confirm:**
  - Title "End session?"
  - Message: `New photos stop. ${photos(n)} keep sending to Sarah.`, or "New photos stop. Everything has been delivered." when n = 0.
  - Buttons "End session" (destructive) / "Keep shooting".
- **Cancel unsent confirm:** "Cancel unsent photos?" — `${photos(n)} won't be sent. Photos Sarah already received stay with her.` — "Cancel photos" / "Keep sending".
- **Lock:**
  - Title "Phone returned to Alex".
  - Body `${photos(n)} still sending to Sarah`, or "Everything was delivered".
  - Button by biometric: "Use Face ID", "Use Touch ID" or "Unlock".
  - Canceled: "Still locked. Alex's photos and account stay private."

- [ ] **Step 1: Write failing e2e tests.**
  - `camera-ready`: one shutter tap → status "1 sending" within 2 s of play time, and the pill pulse key changes. A double-click within 100 ms yields one photo and the busy toast (Review Focus 1, R10).
  - The toast's box does not intersect the shutter's box (D20; Toast `placement="top"` on Camera).
  - `camera-wifi-only-waiting` shows "waiting for Wi-Fi" (D10).
  - End session confirm focuses "Keep shooting" (D8). Confirming shows Lock with the still-sending count.
  - Relaunch on Lock stays on Lock (D2).
  - `lock-auth-canceled` shows the canceled copy.
  - The Session panel lists "Photo 1 · Delivered"-style rows and no `<img>` (D7).
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS). **Step 5:** Commit: `feat(prototype): camera, session and lock`.

### Task 26: Screens — Recovery, Photo, Settings and pages, account confirmations

**Files:**
- Create: `src/prototype/panels/Recovery.tsx`, `src/prototype/screens/{Photo,Settings}.tsx`, `src/prototype/screens/settings/{SignIn,Devices,Blocked,Storage,Privacy,Help,Report,DeleteAccount}.tsx`
- Create: `src/prototype/copy/{recovery,photo,settings,account}.ts`
- Test: `tests/e2e/screens-photos-account.spec.ts`

**Fixed copy:**
- **Recovery:**
  - Title "Finish sending offline photos?"
  - Body `${photos(n)} were taken without internet. Both phones need to approve sending them to Sarah before ${deadline}.`
  - Buttons "Approve on this phone" / "Don't send".
  - Waiting: "Approved here. Waiting for the other phone."
  - Declined: "Not sent. Other photos are unchanged."
  - Expired: "These photos expired before both phones approved."
- **Photo:**
  - Status by `recipientLabel`; button "Save to Photos"; "Delete from this app…".
  - Access off: "Photos access is off", with action "Open Settings".
  - Needs checking: "Check Photos before saving again. An interrupted save may have finished, so saving again could create a duplicate." with actions "Open Photos" / "Save another copy".
  - Delete confirm: "Delete from this app?" — "The copy in Photos isn't affected." — "Delete" / "Cancel".
- **Report:** chips "Delivery problem" / "Unwanted contact", a field "What happened?", a toggle "Block this account" (D17), and button "Send report". Sent: "Report sent".
- **Blocked empty:** "No blocked accounts. You can block someone when you report a session."
- **Sign out confirm:** `${photos(n)} are only in this app. They stay locked on this phone until you sign in again. Photos you saved to Photos aren't affected.` — "Sign out" / "Cancel".
- **Delete account:** a two-step confirm. Message: "This deletes your account and the photos kept in this app on this phone. Copies saved to Photos aren't affected. Phones that are offline are cleaned up when they next connect." Final button: "Delete account".

- [ ] **Step 1: Write failing e2e tests.**
  - `recovery-needed`: "Try again" is absent. Approving on one phone shows the waiting copy; approving on the second moves the photos to sending (D1, R7).
  - `photo-access-off`: "Save to Photos" shows the Open Settings message and no system prompt (D11).
  - `photo-needs-checking`: both actions are present, and the state persists after navigating away and back (D9).
  - Report has a Block toggle (D17).
  - Sign out from borrowing mode is impossible: Settings is unreachable while `mode==='borrowing'`.
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS). **Step 5:** Commit: `feat(prototype): recovery, photos and account screens`.

### Task 27: Live Activity and notification surfaces in the prototype

**Files:**
- Create: `src/prototype/screens/SystemSurfaces.tsx` (an extra route rendered when the review shell's "Show Lock Screen" toggle is on for a phone)
- Test: `tests/e2e/system-surfaces.spec.ts`

- [ ] **Step 1: Write the failing e2e test.** In `home-live-receiving` with "Show Lock Screen" on Sarah: on iOS, LiveActivity lock-screen variant shows the received count; switching Sarah to `galaxyA15` shows ProgressNotification instead.
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS). **Step 5:** Commit: `feat(prototype): Live Activity and progress notification`.

### Task 28: Full end-to-end matrix

**Files:**
- Create: `tests/e2e/matrix.spec.ts`, `tests/e2e/helpers.ts`

**Interfaces:** `assertNothingEssentialClipped(page, screen: Locator): Promise<void>`. It fails when:
- an interactive element's box is outside the screen box and its nearest scroll container cannot scroll it into view; or
- a text element has `text-overflow: ellipsis` and `scrollWidth > clientWidth`.

- [ ] **Step 1:** Write the matrix:
  - (a) Every scenario on default devices, light: no console errors or warnings, and axe finds no serious or critical violations inside the device screens.
  - (b) Every `main` scenario × 4 device models × light and dark: same checks.
  - (c) Every `main` scenario on `iphoneSE3` and `androidCompact` at `text=largest`: `assertNothingEssentialClipped`.
  - (d) With reduced motion emulated, every `main` scenario has no running animation longer than 200 ms (Review Focus 5).
- [ ] **Step 2:** Run `npm run test:e2e`. Expected: PASS. Fix the causes (not the tests) until it passes.
- [ ] **Step 3:** Commit: `test(design): full scenario matrix`.

### Task 29: Release comparison

**Files:**
- Create: `scripts/release-fetch.ts`, `src/workspace/releases.ts`, `src/workspace/CompareView.tsx`
- Modify: `vite.config.ts` (serve `/__releases/*` from `.releases/`), `pages/LibraryComponent.tsx`, `shell/PrototypePage.tsx`
- Test: `tests/unit/release-fetch.test.ts`, `tests/e2e/compare.spec.ts`

**Interfaces:**

```ts
export function releasePlan(version: string, repoRoot: string, tmpRoot: string): { tag: string; worktree: string; outDir: string; base: string };
// rejects non-semver; tag = `design-v${version}`; outDir = `${repoRoot}/design/.releases/${version}`; base = `/__releases/${version}/`
export function listReleases(): Promise<string[]>;           // fetches /__releases/index.json, [] on 404
export function CompareView(p: { previous: string; path: string }): JSX.Element;   // two iframes: `/__releases/${previous}${path}?embed=1` and `${path}?embed=1`
```

The script runs these steps:
1. `git rev-parse --verify <tag>`.
2. `git worktree add --detach <worktree> <tag>`.
3. `npm ci` in `<worktree>/design`.
4. `npm run build -- --base <base> --outDir <outDir>`.
5. Rewrite `/.releases/index.json`.
6. `git worktree remove --force <worktree>`.

On any failure it removes the worktree and exits 1.

- [ ] **Step 1: Write failing tests.**
  - `releasePlan('1.0.0', '/r', '/t')` returns `tag: 'design-v1.0.0'` and `base: '/__releases/1.0.0/'`.
  - `releasePlan('v1', …)` throws `'Version must be semver, like 1.0.0'`.
  - e2e: with no releases, the component page shows "No earlier release yet".
- [ ] **Step 2–4:** Run (FAIL), implement, then run (PASS).
- [ ] **Step 5: Manual verification.**
  - Create a local, unpushed tag `design-v0.0.1-test` at `HEAD~1`, then run `npm run release:fetch 0.0.1-test`.
  - Confirm the compare view shows both builds of the RingButton page and of `/prototype?scenario=home-photos`.
  - Delete the tag and `.releases/0.0.1-test`.
- [ ] **Step 6:** Commit: `feat(design): compare with earlier releases`.

### Task 30: Documentation, independent reviews and pull request

**Files:**
- Modify: `design/README.md`, `design/CHANGELOG.md`, `design/package.json` (version `1.0.0`)

- [ ] **Step 1: Write `README.md`.** Cover what this is; how to run (`npm ci`, `npm run dev`, then open http://127.0.0.1:4300); the lifecycle (spec §6); how to add or change a component (the folder recipe and promotion rules); how to release (tag `design-vX.Y.Z` after the owner merges); the tests; and the known limitations:
  - SF Pro only renders on Apple devices.
  - Android chrome is stock, not One UI.
  - Device values marked approximate.
  - One synthetic sample image.
  - Copy is proposed until privacy and legal review.
- [ ] **Step 2: Cut the release in `CHANGELOG.md`.** Move Unreleased to `## [1.0.0] - <date>` and set `package.json` version to `1.0.0`.
- [ ] **Step 3: Independent design and accessibility review.** Dispatch a fresh `general-purpose` agent (model `opus`, effort `high`) with the spec, the running workspace URL and the instruction to review against spec §3, §5, §7 and §13 and report findings with severity, path or line, and failure scenario. Fix or record each finding.
- [ ] **Step 4: Independent overclaim review** of every `trust` string in `allCopy` against spec §5 and the anti-goals, with a fresh agent (`opus`, `high`). Fix or record.
- [ ] **Step 5:** Run `npm run check`. Expected: PASS. Paste the summary into the PR.
- [ ] **Step 6: Open the PR.** `git push -u origin design/system-v1`, then `gh pr create` with the repository's change-review template filled in. It includes the checks and their results, screenshots of `/guideline`, `/library`, `/lab` and `/prototype` (default dual view), the D1–D21 table with test names, and the dependency list. End the body with the attribution line. Bind the PR in the app.
- [ ] **Step 7:** Commit any review fixes before pushing, with messages `fix(design): <finding>`.
