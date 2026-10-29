# Camera Sharing design system

The design system for Camera Sharing, and a prototype of the whole app built only from it.
Alex lends his good phone's camera to Sarah: every photo he takes goes to Sarah's phone, and
nothing stays on his.

It is a self-contained web app for design review. It is not the product: the native apps will
be built in SwiftUI and Compose from the component pages here.

## Run it

You need Node 24.12 or later within 24 (see `.nvmrc`).

```sh
npm ci
npm run dev
```

Then open <http://127.0.0.1:4300>. The server listens on 127.0.0.1 only, and the workspace works
offline: no remote fonts, scripts or images.

| Page         | What it is                                                                     |
| ------------ | ------------------------------------------------------------------------------ |
| `/`          | Overview: the version, components by status, the latest changes.               |
| `/guideline` | The permanent design guideline, drawn from the tokens.                         |
| `/library`   | Finished components, each with every state on iOS and Android, light and dark. |
| `/lab`       | Components being drafted or in review, with the promotion checklist.           |
| `/prototype` | The review shell: Alex's and Sarah's phones side by side, in every state.      |
| `/changelog` | Design-system releases.                                                        |

## The prototype

`/prototype` shows both phones, each in its own document, so a panel or prompt on one phone never
blocks the other. One shared model holds both phones, the relay between them and a clock.

- **Scenarios**: the navigator lists every state in the design spec (§9), about 100, by journey.
  Each one builds its world from nothing, so nothing leaks from one to the next.
- **Clock**: Play, or jump +1 minute, +1 hour or +12 hours, to reach countdowns and expiry.
- **Each phone**: Adjust changes its model, theme, text size, network and connection, relaunches
  it, or shows its Lock Screen. Buttons beside it simulate what the phone can't show, such as a
  scanned code.
- **Present** hides everything but the phones. **Reset** rebuilds the scenario.
- The URL records the scenario, view, phones, theme and text size, so any state can be shared.

## A component's life

1. **Draft** in the Lab.
2. **Review**: the owner looks in the browser and approves.
3. **Final**: the component moves to the Library, and its approval is recorded in
   `src/workspace/approvals.ts`. A test fails if a component is final without one.
4. **Propagate**: screens that use it update with it. Each component page lists where it is used.
5. **Native**: engineers build it in SwiftUI and Compose and record their status on its page.

Versions follow semantic versioning: a major change alters existing screens, a minor change adds a
variant or state, a patch fixes without changing what was approved.

## Add or change a component

Each component lives in `src/components/<Name>/`:

| File                  | Holds                                                                          |
| --------------------- | ------------------------------------------------------------------------------ |
| `<Name>.tsx`          | The component.                                                                 |
| `<Name>.css`          | Its styles: colors, type and durations only through `var(--…)` tokens.         |
| `<Name>.meta.ts`      | Group, layer, status, version, anatomy, tokens, accessibility, motion, native. |
| `<Name>.examples.tsx` | One example per declared state.                                                |
| `index.ts`            | Its exports.                                                                   |

- Values come from tokens in `tokens/*.tokens.json`. `npm run tokens` generates the CSS variables
  and the typed `tokens` import; `npm run literals` fails on a hard-coded color, font size or
  duration.
- New contrast pairs go in `tokens/contrast-pairs.json`, where tests check them in both themes.
- Icons come from Material Symbols Rounded, vendored by `scripts/vendor-icons.ts`; each records
  its SF Symbol name. No SF Symbols artwork is in this repository.
- A changed component gets a new version, a dated entry in its metadata and a line in
  `CHANGELOG.md`.
- Every dependency has a written review in `DEPENDENCIES.md` before it is installed.

## Release

After the owner merges a release into `main`, tag it `design-vX.Y.Z`. To compare with an earlier
release:

```sh
npm run release:fetch 1.0.0
```

This builds the tag in a temporary worktree into `.releases/` (not committed). Library pages and
the prototype then offer "Compare with" that release.

## Tests

```sh
npm run check
```

It builds the tokens, then runs the type check, formatting, the literal check, the unit tests and
the end-to-end tests. The end-to-end tests include a matrix of every scenario: no console errors,
no serious accessibility violations inside the phones, nothing essential clipped at the largest
text on the smallest phones, and nothing moving for long with Reduce Motion. It takes about five
minutes.

## Known limitations

- SF Pro renders only on Apple devices; elsewhere the system's sans-serif stands in.
- The Android phones use stock Android chrome, not Samsung One UI.
- Some device values are approximate, and each frame's metadata says which.
- There is one synthetic sample image (`ASSETS.md`); every photo is a crop of it.
- All copy is proposed until privacy and legal review.
- The prototype simulates the relay, the network and the system apps: Open Settings turns
  access on, and Open Photos does nothing.
