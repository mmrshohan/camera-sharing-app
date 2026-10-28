# Dependency reviews

Every package here was reviewed **before** it was installed, as the engineering standards require. The facts below come from the npm registry and from `npm audit` on 28 October 2026. Footprints and advisories were measured from a lockfile resolved with `npm install --package-lock-only --ignore-scripts` before anything was installed.

- **Audit result:** 0 advisories across 167 locked packages (`npm audit`, 28 Oct 2026) after the Vite security bump below. The first `npm install` added three optional WebAssembly helpers (`@emnapi/*`, used only where no native Rolldown binary exists) that the lockfile-only resolution had missed. `npm ci` from the committed lockfile was then verified clean.
- **Update owner for every package:** the design-system maintainer. Versions are reviewed at each design-system release, and immediately when `npm audit` reports an advisory.
- **Pinning:** exact versions only. No `^` or `~`. `package-lock.json` is committed.

## Summary

| Package | Version | Kind | License | Last publish | Transitive packages |
| --- | --- | --- | --- | --- | --- |
| react | 19.2.7 | runtime | MIT | 2026-10-27 | 0 |
| react-dom | 19.2.7 | runtime | MIT | 2026-10-27 | 1 |
| react-router | 8.5.1 | runtime (new) | MIT | 2026-10-27 | 2 |
| motion | 12.42.2 | runtime | MIT | 2026-10-27 | 4 |
| @radix-ui/react-dialog | 1.1.19 | runtime | MIT | 2026-10-14 | 24 |
| qrcode | 1.5.4 | runtime | MIT | 2025-11-13 | 28 |
| @fontsource/roboto | 5.2.10 | runtime (font files) | OFL-1.1 | 2026-07-19 | 0 |
| typescript | 7.0.2 | dev | Apache-2.0 | 2026-10-28 | 20 (all optional, one per platform) |
| vite | 8.1.6 | dev | MIT | 2026-10-21 | 42 (29 optional, platform-specific) |
| @vitejs/plugin-react | 6.0.3 | dev | MIT | 2026-10-05 | 1 |
| vitest | 5.0.5 | dev (new) | MIT | 2026-10-19 | 22 |
| @playwright/test | 1.61.1 | dev | Apache-2.0 | 2026-10-28 | 3 |
| @axe-core/playwright | 4.14.0 | dev (new) | MPL-2.0 | 2026-10-27 | 1 |
| prettier | 3.9.10 | dev | MIT | 2026-10-10 | 0 |
| @types/react | 19.2.17 | dev | MIT | 2026-10-04 | 1 |
| @types/react-dom | 19.2.3 | dev | MIT | 2026-10-04 | 0 |
| @types/qrcode | 1.5.6 | dev | MIT | 2026-10-04 | 2 |
| @types/node | 24.19.2 | dev | MIT | 2026-10-09 | 1 |
| @material-symbols/svg-400 | 0.48.2 | vendored source only (new) | Apache-2.0 | 2026-10-27 | not installed |

## Reviews

### react, react-dom 19.2.7

- **Purpose:** UI library for the whole workspace.
- **Alternatives:** Preact (smaller, but compatibility shims for Radix and motion); Svelte or Solid (would discard the team's existing React prototype knowledge and the libraries below).
- **Maintenance:** published 27 Oct 2026, actively maintained by Meta.
- **Notes:** the same versions as the 27 October prototype.

### react-router 8.5.1 (new)

- **Purpose:** the workspace's routes (`/guideline`, `/library/:id`, `/prototype`, …) with real URLs that can be shared and bookmarked.
- **Alternatives:** TanStack Router (excellent typing, but a larger API surface than this app needs); a hand-written router. The 27 October review flagged its hand-rolled router as a maintenance cost.
- **Peer requirements:** React and React DOM ≥ 19.2.7, satisfied.
- **Footprint:** 2 packages.

### motion 12.42.2

- **Purpose:** spring animations (panels, ring press, photo drop) driven by our motion tokens; drag with velocity for dismissing panels.
- **Alternatives:** CSS transitions only (no true springs or interruptible drags); react-spring (comparable, but would duplicate what motion already does).
- **Note:** motion's own drag handling replaces `@use-gesture/react`, which is not carried over.

### @radix-ui/react-dialog 1.1.19

- **Purpose:** accessible dialogs for panels and confirmations: focus trapping, focus return, `aria-modal`, and Escape handling. These fix defects D8 and D12.
- **Alternatives:** the native `<dialog>` element (focus return and inert background behave inconsistently, and it's harder to portal into a device frame); writing our own focus management (high risk for accessibility).
- **Footprint:** 24 small Radix primitives.

### qrcode 1.5.4

- **Purpose:** produces the invitation QR module matrix, which we draw ourselves as SVG paths.
- **Alternatives:** `qrcode-generator` and `uqr` have no dependencies and are smaller. Switching would add a library not covered by the approved design document, so it is recorded as a future simplification.
- **Footprint and risk:** 28 packages, because of `yargs` (its command-line interface) and `pngjs`. We import only `QRCode.create()`; no CLI or PNG code runs.
- **Maintenance:** last published November 2025, stable.

### @fontsource/roboto 5.2.10

- **Purpose:** self-hosted Roboto font files for Android mockups, with no runtime network. Only weights 400, 500 and 700 (Latin) are imported.
- **Alternatives:** Google Fonts CDN (breaks the no-runtime-network rule); system fonts (wrong typeface for Android).
- **License:** SIL Open Font License 1.1, which permits bundling and redistribution with the license.

### typescript 7.0.2

- **Purpose:** strict type checking.
- **Alternatives:** none reasonable.
- **Notes:** 7.0 is the native compiler release. Its 20 transitive packages are platform-specific optional binaries; one installs per machine.

### vite 8.1.6 (security bump from the 8.1.3 used before)

- **Purpose:** development server and build.
- **Alternatives:** webpack and Rspack (slower development loop, more configuration).
- **Security:** 8.0.0 through 8.1.5 have five published advisories:
  - [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm), high, `launch-editor` file-existence bypass on Windows.
  - [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw), moderate, editor command-line flag injection.
  - [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv), moderate, missing argument escaping on Windows.
  - [GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22), moderate, files outside `server.fs.allow` served.
  - [GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw), low, cross-origin script execution via custom middleware.

  8.1.6 is the first patch release outside the affected range. The 27 October prototype still runs 8.1.3; see the note at the end.
- **Footprint:** 42 packages, 29 of them platform-specific optional binaries for the Rolldown bundler.

### @vitejs/plugin-react 6.0.3

- **Purpose:** React refresh and JSX for Vite.
- **Peer requirement:** Vite ^8, satisfied.

### vitest 5.0.5 (new)

- **Purpose:** unit tests for tokens, the prototype model, scenarios and copy rules, run in Node with no browser.
- **Alternatives:** Node's built-in test runner (no TypeScript path aliases or Vite config reuse); Jest (separate transform pipeline from Vite).
- **Peer requirements:** Vite ^6, ^7 or ^8 and `@types/node` ≥ 24, satisfied.

### @playwright/test 1.61.1

- **Purpose:** end-to-end tests of routes, screens, states, keyboard behavior and accessibility.
- **Alternatives:** Cypress (no WebKit, heavier); Puppeteer (no test runner).
- **Notes:** the browsers are already cached on this Mac (`chromium-1243`); no extra download is needed.

### @axe-core/playwright 4.14.0 (new)

- **Purpose:** automated accessibility checks (WCAG 2.2 AA rules) inside the end-to-end tests.
- **Alternatives:** Lighthouse (page-level only, heavier); hand-written checks (incomplete).
- **License:** MPL-2.0, file-level copyleft. We use it unmodified as a development tool, so no obligation applies to our code.

### prettier 3.9.10

- **Purpose:** consistent formatting, enforced by `npm run check`.

### @types/react 19.2.17, @types/react-dom 19.2.3, @types/qrcode 1.5.6, @types/node 24.19.2

- **Purpose:** type definitions. `@types/node` tracks Node 24, the pinned runtime.

### @material-symbols/svg-400 0.48.2 (new, vendored source only)

- **Purpose:** Google's Material Symbols Rounded, the standard Android icon set that the design document requires.
- **How it is used:** it is **never installed**. `npm pack` downloads it into a scratch folder. `scripts/vendor-icons.ts` extracts only the path data of the 31 icons we use (outlined and filled), validates that each file is a single `<path>`, and writes `src/icons/material-paths.ts` with the package's license alongside.
- **Alternatives:** the full variable font (about 3 MB, ligature-based, harder to keep offline); hand-drawn icons, which the owner rejected in favor of standard icons.
- **License:** Apache-2.0.

## Not carried over from the 27 October prototype

- `@radix-ui/react-icons`: replaced by standard platform icon sets.
- `@radix-ui/react-dropdown-menu`: native `<select>` is enough for the workspace pickers and is more accessible by default.
- `@use-gesture/react`: last published March 2024. `motion` already provides drag with velocity.

## Note on the 27 October prototype

`prototypes/mobile-review/` (untracked, in the main checkout) still uses Vite 8.1.3, which is affected by the advisories above. Its config also binds the dev server to `0.0.0.0`, which exposes it to the local network. Stop that server when it isn't in use, or update it before running it again.
