# Design system build: rulings and deferred minors

Record of the decisions made while carrying out
[the build plan](2026-10-28-design-system-build-plan.md) (Tasks 1–30, 28–30 October 2026),
copied from the execution ledger, which is not kept in the repository.

Each ruling says what was decided, why, and what it costs if it is wrong.
They are the implementer's calls on the owner's behalf: the owner can overturn any of them.

There are 190 rulings and 19 deferred minor findings.

## Rulings

### Pre-flight

- plural/cameraStatusText live in src/shared/plural.ts; src/prototype/copy/plural.ts re-exports — keeps components independent of prototype — cost if wrong: one file move.
- T21 creates src/prototype/scenarios/build.ts with createWorld(); T22 extends it — tests need a builder before scenarios exist — cost if wrong: none (same function, earlier).

### Task 1

- added .superpowers/, .claude/launch.json and .claude/worktrees/ to root .gitignore — brainstorming skill asks for it and it stops tool scratch from ever being committed — cost if wrong: three ignore lines to remove

### Task 2

- Vite 8.1.3 → 8.1.6 — 8.0.0–8.1.5 carry 5 advisories (1 high); 8.1.6 is the first fixed patch in the approved Vite 8 line — cost if wrong: one version line
- dropped @use-gesture/react and @radix-ui/react-dropdown-menu — unmaintained since 2024 / unnecessary; motion drag and native <select> cover them — cost if wrong: re-add two packages
- first install via npm install (not ci) — lockfile-only resolution missed optional @emnapi wasm helpers; npm ci then verified clean — cost if wrong: none

### Task 3

- Playwright webServer runs 'npm run serve:test' (tokens + usage + vite on 4301) instead of bare 'npx vite' — generated tokens must exist before tests from Task 4 on — cost if wrong: one script
- installed Playwright chromium build 1228 (94 MB) — 1.61.1 needs it; cached 1223/1243 belong to other tools; covered by the approved Playwright install — cost if wrong: disk space only

### Task 4

- type tokens stored as individual DTCG dimension/fontWeight/fontFamily tokens (not the composite 'typography' type) — DTCG composite lineHeight is a ratio and the spec pins absolute leading — cost if wrong: restructure JSON
- added fieldHeight {ios 50, android 56} to shape tokens — spec 7.9 Android text field is Material's 56 dp — cost if wrong: one token
- iOS AX5 tracking set to 0.37 for all styles (approximation of system tracking) — native apps use system tracking automatically; web only approximates — cost if wrong: minor letter-spacing difference in largest-text previews

### Task 5

- Devices icon uses Material 'mobile' (spec said 'smartphone') — Material Symbols renamed it; spec Appendix B updated — cost if wrong: one glyph name
- Icon.meta.ts and Icon.examples.tsx move to Task 6 — their types (ComponentMeta, Example) are defined there — cost if wrong: none
- vendored 5 extra system glyphs (signal_cellular_alt, battery_full, shift, backspace, keyboard_return) now — Task 18 status bar and keyboard need them; avoids re-vendoring — cost if wrong: 5 unused paths

### Task 6

- added src/shared/surface.tsx (Surface context + SurfaceScope + useShouldReduceMotion); PreviewScope wraps it — components read platform/theme without importing the workspace; DeviceFrame will provide the same context — cost if wrong: one indirection
- preview settings live in the URL (platform, theme, text, motion) — shareable links for reviewers — cost if wrong: none
- /library/<id> for a non-final component shows 'still in the Lab' with a link instead of Not found — clearer for reviewers — cost if wrong: none

### Task 7

- added colorUse to the TokenModel, read from each color's $description — the Guideline's "Used for" column must come from tokens, not repeat text — cost if wrong: one generator field.
- added the onAccent color token (#FFFFFF, both themes) and pointed the accent contrast pair at it — product components must never use a literal white — cost if wrong: one token to rename.
- overrides pin playwright-core to 1.61.1 — @axe-core/playwright's peer range pulled an unreviewed 1.64.1 whose Page type broke the typecheck; one reviewed copy now (DEPENDENCIES.md updated, audit 0) — cost if wrong: revisit at the next Playwright bump.
- platforms.ts renamed platform-rows.ts — macOS's case-insensitive resolver sent ./Platforms to the data file — cost if wrong: none.
- useHashScroll in WorkspaceLayout — shared links like /guideline#motion opened at the top because the browser looks for the anchor before React renders; test "a link to a section opens at that section…" RED→GREEN — cost if wrong: one effect.

### Task 8

- "usage" runs `node scripts/build-usage.ts` without --experimental-strip-types — Node 24.12 strips types by default, as the tokens script already relies on — cost if wrong: none.
- where-used is rendered in ComponentPage (shared by Library and Lab), not LibraryComponent.tsx — Task 6 put every section there — cost if wrong: none.
- type-only imports do not count as use; screens show as file ids until Task 23 defines prototype URLs, when they become links — cost if wrong: one render change.
- a dev-server plugin (hotUpdate) rewrites usage.json when prototype files change, so where-used never goes stale while editing — cost if wrong: remove one small plugin.
- parseChangelog throws on unknown sections, malformed release headings and stray prose instead of ignoring them — silent drops would hide changes — cost if wrong: a stricter CHANGELOG format.
- routes.spec's version check is scoped to the header — the Overview now shows the version too — cost if wrong: none.
- global `code` font stack in base.css — new pages rendered the browser's Courier — cost if wrong: none.

### Task 9

- added the `track` color token (ink at 10%, both themes) — the spec's "10% neutral track" needs an exact value for native — cost if wrong: one token.
- added the contrast pair live on label.live.bg (3:1) now that the 8 pt in-label dot exists — cost if wrong: none.
- ProgressRing reads 100 only when value ≥ 1 (else at most 99), draws no arc at 0 and uses butt caps — "honest by default" — cost if wrong: values in [0.995, 1) read 99.
- the arc eases to new values over the 200 ms fade token and jumps under Reduce Motion — the spec gives no progress motion — cost if wrong: drop one transition.
- Text is a system-layer component (it follows each platform's typeface and scale); the spec does not list Text — cost if wrong: one label.
- tests/unit/group1.test.tsx instead of .ts — JSX, like icons.test.tsx — cost if wrong: none.
- the Guideline's Type and Motion sections render the real Text and LiveDot; their look-alike CSS is gone — one source of truth — cost if wrong: none.
- Example gets an optional layout "compact" (grid cells, centered stage, subgrid-aligned captions); the default stays full width — cost if wrong: one optional field.
- Vitest fsModuleCache off — its default cache froze import.meta.glob, so the registry missed new components under test (Task 8's folder-id test caught it) — cost if wrong: a few seconds of cold start.
- preview controls call setParams with flushSync and App uses RouterProvider from react-router/dom — URL-controlled radios snapped back while the router's transition was pending (library.spec Android switch failed) — cost if wrong: a synchronous render per click.
- shared SymbolName helper wraps SF names only after dots (Guideline and Icon examples) — cost if wrong: none.
- LiveDot's native notes cite motion.live tokens instead of numbers — the literal checker flagged "duration: 0.8" — cost if wrong: none.

### Task 10

- new tokens onCamera (#FFFFFF, both themes), shape.ringLabelGap (9), motion.waiting (quarter arc, 1200 ms per turn) and motion.dim (0.6) — the spec states the 9 pt gap, white camera controls, "a moving arc" and "disc dims" but numbers only the first — cost if wrong: retune three values.
- Shutter takes an optional `message` for blocked — the spec hides the disc "behind a message" and forbids silent disabling — cost if wrong: one prop.
- a preparing Shutter is aria-busy and still calls onCapture, as the brief says; the camera model rejects it (Task 21) — cost if wrong: move the guard into the component.
- RingButton's reason renders inside the button, aria-hidden and referenced by aria-describedby — one root button, and the reason is not read twice — cost if wrong: markup only.
- "pressed" is shown as an interactive "Press and hold" example, not a frozen prop — no demo-only props in components — cost if wrong: the pressed state is not visible in a still screenshot.
- with Reduce Motion a press dims the disc to motion.dim instead of scaling — the spec replaces spatial motion with fades — cost if wrong: one animate branch.
- useShouldReduceMotion uses useSyncExternalStore on matchMedia — motion's useReducedMotion logs a development warning whenever the OS setting is on (the console guard failed), and the old code called useSurface conditionally — cost if wrong: none.
- tests/unit/rings.test.tsx instead of .ts (JSX) — cost if wrong: none.
- Home ring labels "Lend my camera" and "Borrow a camera" in examples — the spec gives no exact strings; screen copy (Tasks 24–25) may refine them — cost if wrong: copy edits.
- the Guideline's ring section sits right after Principles, and demo grids use auto-fit so rows fill — cost if wrong: none.

### Checkpoint G1

- /lab/<id> redirects to /library/<id> (same query) once a component is final — old Lab links keep working — cost if wrong: one Navigate.
- the lab-mode "sections in order" test moved to /library/icon (no checklist) until group 2 gives the Lab a component again; Task 11 restores a lab-mode check — cost if wrong: none.

### Task 11

- per-platform metrics generalized into a `system` token group (fieldHeight moved in; fieldRadius 12/4, chipHeight 36/32, chipRadius 18/8, switch 51×31 / 52×32, thumb 27/27 and 16→24) — rule 9 asks for each platform's own metrics, and one special case would have become eight — cost if wrong: retune values.
- new colors `fill` (iOS systemFill, 0.2 light / 0.36 dark) and `shadow` (black 15%) for system controls — no existing token matched — cost if wrong: two tokens.
- shape tokens iconRow 22, iconBar 24, iconChip 18 — from the Icon anatomy and Material's chip icon — cost if wrong: retune.
- vendored the `check` glyph as a system glyph from the same audited 0.48.2 package (38 glyphs now; DEPENDENCIES.md updated) — chips need a non-color selection cue — cost if wrong: one glyph.
- shared usePress/pressMotion (src/shared/press.ts) and WaitingArc; RingButton and Shutter refactored onto them, ring tests green before and after — cost if wrong: none.
- disabled Buttons use aria-disabled and stay focusable instead of native disabled — screen readers can still find them — cost if wrong: one attribute.
- text buttons are max(44 pt, platform target) tall, so 48 dp on Android — the spec's 44 pt plus "minimum targets switch per platform" — cost if wrong: none.
- the whole Toggle row is the switch; TextField status (icon and words) lives in the line under the field; Android's floating label uses footnote (14 sp) rather than Material's 12 sp, honoring the 14 sp minimum — cost if wrong: small visual differences from stock Material.
- iOS ChoiceChips are capsules on the system fill (iOS has no native chip); both platforms show a checkmark on the choice — cost if wrong: a redesign of one system component.
- example copy comes from the docs: "Send over Wi-Fi only" and "Save to Photos" (05-ui-ux-design settings), username checking/available/taken (spec §9) — cost if wrong: copy edits.
- tests/unit/actions.test.tsx instead of .ts (JSX); library.spec matches the Icon card with /^Icon\s/ now that IconButton exists — cost if wrong: none.

### Task 12

- the Guideline's existing Labels section now renders StatusLabel instead of adding a separate LabelsLive.tsx — one labels section, not two — cost if wrong: none.
- Numeral is role=img with the whole phrase as its label ("14 photos, 2 on the way, live"); the live dot inside becomes presentational — one phrase for screen readers — cost if wrong: a semantics change.
- the numeral's live dot is 10 pt, as the spec says, not the 14 px the v0.2 board drew — the spec is the authority — cost if wrong: one size.
- at the largest text size the numeral's words move under the number — "rows stack rather than truncate" — cost if wrong: layout only.
- InlineMessage takes an optional `icon`; neutral defaults to "privacy" (most neutral messages say where photos go); messages sit on the surface color with a colored icon, keeping tints for labels — cost if wrong: one default icon.
- Toast keeps its role=status region mounted and hides only the capsule — live regions must exist before content changes to be announced; screens set --toast-above-controls (default shutter + 48 pt) — cost if wrong: none.
- added the contrast pair background on ink for toast text; label words come from Appendix C — cost if wrong: none.

### Checkpoint G2

- the Lab checklist e2e opens the first Lab card and skips when the Lab is empty — it stays valid across every group's promotion — cost if wrong: the check is skipped between groups.

### Task 13

- the switch drawing moved to src/shared/SwitchTrack so ListRow can draw the platform switch without changing the approved Toggle's API; Toggle renders the same (before/after screenshots, toggle e2e green) — cost if wrong: none.
- tokens system.rowHeight (44 pt / 56 dp, UITableView and Material list item) and system.barHeight (44 / 64), shape.iconHero (48) — the brief's "target" minimum is met, and Material rows are 56 dp — cost if wrong: retune.
- SectionHeader is a system component (the spec lists it in neither layer); TopBar, ListRow and GroupedList are system and EmptyState and Avatar brand, as §7.9 says — cost if wrong: a label.
- Android rows show no chevron and Android lists have no separators or card; iOS keeps the inset grouped card with hairlines inset to the text — each platform's own list — cost if wrong: visual only.
- EmptyState takes an optional `icon` (48 pt, ink2) and its one action is a tinted capsule — "every state shows an icon and words", and filled is kept for each screen's primary action — cost if wrong: one prop.
- Avatar initials take the first and last words, skip a leading @, and use the system fill with ink — neutral because "the photo is the color" — cost if wrong: color choice.
- workspace and Guideline rules now style only their direct child headings (.ws-section > h2, .g-section > h2, .g-card > h3/p); a regression test checks a previewed heading keeps its token size (RED 22px → GREEN 13px) — cost if wrong: none.

### Task 14

- shape.radiusField and shape.radiusPanel removed; system.fieldRadius (12/4) and system.panelRadius (38/28) are the single sources, with a test that they stay out of shape; the Guideline's Shape section shows both platforms where they differ — cost if wrong: none.
- new tokens color.scrim (40% black), color.elevated (white / #1C1C1E, the iOS raised surface) with tested contrast pairs, system handle (36×5 / 32×4), dialogRadius (14/28), dialogWidth (270/312), motion.dismiss (76 pt, 0.45 pt/ms) — the brief's values made explicit — cost if wrong: retune.
- a shared useReturnFocus remembers the opener and restores it on close — Radix modal Dialog focuses only a Dialog.Trigger, and ours open from state, so focus fell to the body (D12) — cost if wrong: none.
- the iOS alert and action sheet are drawn with iOS 18 metrics (270 pt, 14 pt corners); native code uses .alert and .confirmationDialog, which draw the current OS look. I could not verify iOS 26's Liquid Glass alert metrics — cost if wrong: mock-only visual difference.
- outside taps cancel action sheets and Material dialogs but not iOS alerts; Escape always answers with the safe choice — each platform's own rule — cost if wrong: behavior detail.
- the panel e2e drags only after the handle is stable (hover) — pressing mid-rise landed below the moving handle; a standalone trace showed dragging works (translate 60 px, closed past the threshold) — cost if wrong: none.

### Task 15

- the D19 tests assert "no QR code and no countdown" rather than "no <svg>" — the offline and expired states show an icon with words, as every state must — cost if wrong: none.
- the QR is drawn from qrcode.create's module grid (synchronous) rather than parsing toString's SVG — same library, no string parsing, no innerHTML — cost if wrong: none.
- the QR card and the Viewfinder pin their theme (data-theme="light" for the code, "dark" for the camera), so the code is dark on white for every scanner and the camera view is always dark — cost if wrong: none.
- shape.qrSize (200) and a shared .visually-hidden (src/shared/a11y.css) for the spoken countdown; Viewfinder copy lives in the component, since its interface takes only a state — cost if wrong: copy edits.
- the tests and test file are tests/unit/pairing.test.tsx (JSX) — cost if wrong: none.

### Task 16

- plural rules live in src/shared/plural.ts with a re-export at src/prototype/copy/plural.ts, as the pre-flight ruled; a test checks the prototype copy uses the same rules — cost if wrong: none.
- DestinationPill pulses with Element.animate (Web Animations API) — motion's useAnimate calls its own reduced-motion hook, which logs a development warning whenever the OS setting is on (the console guard failed) — cost if wrong: none.
- status text order is sent, sending, preparing, waiting for internet, waiting for Wi-Fi; the brief's example fixes the first, second and last — cost if wrong: copy order.
- tokens shape.wellSize (48), zoomSize (30) and zoomSizeSelected (38); an empty well is a placeholder, not a button; the drop plays only for a new capture, not when the camera reappears — cost if wrong: retune.
- sample photos for examples come from src/workspace/samples.ts (crops of the one sample image) until Task 20's fixtures — cost if wrong: none.

### Task 17

- Surface gains lowMemory (default false) so the develop effect fades on budget phones (spec §7.5, rule 8); the plan's DeviceSpec has no memory field, so Task 18 adds memoryGb and DeviceFrame sets lowMemory below 4 GB — cost if wrong: one surface field.
- develop and its fade use Element.animate (Web Animations API), like the pill pulse, avoiding motion's reduced-motion warnings; e2e reads getAnimations() — cost if wrong: none.
- tile badges sit on their own small circles (neutral label colors, background for danger, the camera scrim for expired) so they read on any photo; shape.badgeSize 28 — cost if wrong: visual only.
- the viewer is always dark and shows the sample's crop at 3:4, absolutely placed in its row so it never covers the status or actions — cost if wrong: layout only.

### Task 18

- approximate entries name DeviceSpec keys ("cutout", not "island"/"punchHole") so the brief's test "every entry names a real key" holds — cost if wrong: none.
- DeviceSpec adds memoryGb (16 Pro 8, SE 4, A15 4 base model, compact 3; approximate where derived); DeviceFrame sets surface.lowMemory below 4 GB, completing Task 17's ruling — cost if wrong: one field.
- keyboard visibility follows focusin/focusout of text inputs, a layout effect on routeKey, and a layout check after every render for a focused field that vanished without blur; e2e asserts the keyboard is hidden immediately after Enter moves to a screen without a field — cost if wrong: none.
- new tokens system.statusBarText (17/14, fixed), keyboardHeight (291/280), keyHeight, keyRadius, keyText (fixed), colors keyboard/keyboardKey/keyboardKeyAlt (approximate) and deviceBody, with tested contrast for key labels — cost if wrong: mock-only visuals.
- screens over photos or the camera ask for light status-bar glyphs with data-status-bar="light" (CSS :has on the screen) — cost if wrong: one attribute convention.
- HomeIndicator takes kind (homeIndicator | gestureBar | threeButton); the SE's home button is drawn on the frame's chin — the brief gave no interface — cost if wrong: one prop.

### Task 19

- test file is tests/unit/system.test.tsx, not .ts — it renders JSX — cost if wrong: a rename.
- PermissionPrompt takes an optional open (default true) beyond the brief's interface, so the prompt fades out instead of vanishing — superset, brief callers unaffected — cost if wrong: one optional prop.
- iOS notification prompt shows the system's fixed message, not the app's purpose — iOS gives apps no purpose string for notifications; permissionCopy returns it as message — cost if wrong: one string.
- the Android prompt focuses "Don’t allow" on open (D8); Radix would focus "While using the app" first. Escape and a tap outside answer no — cost if wrong: focus order.
- new token system.platterRadius (iOS 24, approximate; Android 28, Material's notification corners) and three Dynamic Island contrast pairs on deviceBody — no existing token fit notification surfaces — cost if wrong: one value.
- LiveActivity is pinned to iOS, dark and the default text size (iOS truncates a Lock Screen Live Activity above 160 pt; native caps Dynamic Type at xxxLarge); ProgressNotification is pinned to Android but follows theme and text size — cost if wrong: previews ignore the platform switch for these two.
- LiveActivity says "No photos yet" instead of "0 photos", matching cameraStatusText — cost if wrong: one string.
- Android prompt answers sit on accentTint (accentText on accentTint is a tested 4.5:1 pair) instead of the translucent fill, which has no tested pair; the notification card uses surface so it stands apart from a white shade — cost if wrong: two colors.
- example purpose strings are placeholders until Task 24 writes the copy — cost if wrong: none, Task 24 replaces them.

### Checkpoint G4

- renamed DeviceFrame's runtime --keyboard-height to --keyboard-inset — it shared the generated system.keyboardHeight token's name, so an element pinning data-platform inside a frame reset it to 291/280 px — cost if wrong: one rename for Tasks 24–27 (test: devices.test.tsx "the keyboard inset has its own name…" RED→GREEN, check 295/295 unit, 51/51 e2e).
- the Lab-checklist e2e now skips because every component is final; it runs again when a component enters the Lab — cost if wrong: a checklist regression goes unnoticed until then.

### Task 20

- hostLabel treats prepared, reserved and uploading alike: offline → "Waiting for internet", cellular with Wi-Fi only → "Waiting for Wi-Fi", otherwise "Sending" — a photo that loses its connection mid-upload must not still say Sending (R5, R9). Photos needing recovery after a session ends are shown by the Recovery panel; Task 21's selectors must not count them as sending — cost if wrong: one label rule.
- selectors.ts starts with tileStatus (a canceled photo never arrived, so it uses the expired tile with its own label) and countKey (Ready for <name> and Delivered count as sent) for Task 21's hostSummary and recipientTiles — the brief lists the file but no interface — cost if wrong: two small functions.
- src/workspace/samples.ts now derives samplePhotos from fixtures.samples, so the crops have one source (Task 16's ruling); the first three crops are unchanged and examples now cycle through twelve — cost if wrong: example photos look different after the third.
- handles are @alex, @sarah and @maya, matching the PersonPair examples — cost if wrong: three strings.

### Task 21

- fields beyond the brief's interfaces — HostPhoto.stageAt and reservedAt, RecipientPhoto.stageAt (timers), DeviceUi.pendingSave (the photo waiting on the Photos prompt), field.since (the username check's timer), Session.expiresAt (a pending request's deadline), Recovery.expiresAt (R7's test needs it); events openPhoto and closePhoto (the R5 test opens photo B) — supersets; brief callers unaffected — cost if wrong: a few fields.
- tick jumps from one due step to the next (event-driven), so +1 h and +12 h are exact and fast; instant steps (reserve, resume, deliver, start downloads) settle at every tick and on Try again — cost if wrong: timing details.
- limits from the product requirements (01) and specification 06, pending approval: a session lasts at most 2 h and ends 15 min after the last photo; unsent photos and the relay's copy expire 72 h after capture or reservation; 100 pending photos; my call: requests and invitations expire after 5 min, and a slow network makes transfers 3× slower — cost if wrong: constants in model/timing.ts.
- HostPhoto.reserved means authorized to send: set on reservation, when both phones approve recovery, and for photos still preparing at session end when Alex can send; R7 recovery covers unsent photos without it — cost if wrong: who needs recovery.
- a declined recovery cancels its photos, so Alex's phone never says they are waiting — R7 is silent — cost if wrong: one transition.
- unlocking while a session is still running ends it first (R4: only Alex's unlock returns his phone) — cost if wrong: one transition.
- the drop plays at capture and the destination pulses when a photo leaves Alex's phone (uploaded) — cost if wrong: when the pill pulses.
- scanning or requesting while a session is pending, active, mismatched or device-changed changes nothing; a new request needs the old one ended, expired or declined; requesting anyone but @sarah marks Alex's field invalid, and Task 24 words the reason — cost if wrong: the Scanner's states.
- createWorld lives in src/prototype/scenarios/build.ts now (Task 22's file) so the rule tests use the real builder — cost if wrong: none.
- cancel unsent covers the current session's photos that haven't reached Sarah, including uploaded ones: the relay copy is canceled and her arriving tile says "Canceled before arrival" — cost if wrong: scope of one action.
- Sarah's sections are titled by day ("Today") with "N photos from Alex" as detail, newest first; a tile develops for 2 s after arriving; recovery photos are labeled "Needs both approvals" in the session list and left out of the counts — cost if wrong: copy and order.
- usernames are 3–20 characters, starting with a lowercase letter, then letters, digits, dots or underscores; alex, sarah and maya are taken — cost if wrong: one rule.
- Wi-Fi only holds back Alex's uploads only; Sarah's downloads ignore it — cost if wrong: one condition.

### Task 22

- the model gains what §9's states need — ui.notice (sign-in failed or canceled, camera in use, not an invitation, no match, too many requests, not available, camera interrupted, unlock canceled, support unavailable, report sent, account deleted), ui.inviteExpiresAt, ui.camera (flash, zoom, facing), ui.system (Lock Screen or notification shade) and device.account (sign-in methods, phones, blocked accounts) — cost if wrong: fields the screens read.
- model behaviors for those states — an invitation code exists only online and lasts limits.requestMs; scanning an expired one says "not an invitation"; asking anyone but @sarah says no match, or not available for someone the app knows; a failed unlock says so; ending with photos needing recovery opens the Recovery panel on both phones; navigating clears a notice — cost if wrong: small transitions.
- ids follow `<where>-<state>`, with settings pages named by page (signin-, devices-, blocked-, storage-, privacy-, help-, report-, delete-account-) and system surfaces as system-*; home-request-arriving sits in the Connect journey — cost if wrong: renames.
- scenario worlds use the story's phones; platform-only states (Photos access off, the add-only prompt, the Live Activity, the Android notification) store platform-neutral data, and screens draw each platform's version or nothing; the shell's phone choice applies to every scenario — cost if wrong: how platform-only states are reviewed.
- builds are deep-cloned and new sessions copy fixture objects; the purity test compares serialized worlds before and after touching every object of another build (without the clone, 42 scenarios failed) — cost if wrong: none.
- formatUrlState omits defaults in a fixed order; parameters the shell doesn't own (play) are left alone; compare must be semver — cost if wrong: URL shape.

### Task 23

- each phone renders in its own iframe document (/prototype/phone/:id) — Radix's modal dialogs act on the whole document, so with two phones on one page an open panel on one phone would block the other phone and the shell; the alternative was a non-modal mode on three approved 1.0.0 components for a prototype-only need. The shell owns the world; phones post events and re-apply their own unconfirmed ones (bridge.reconcile), so taps and typing never flicker. Files beyond the brief: bridge.ts, PhonePage.tsx, PhoneEmbed.tsx, layout.ts, Segmented.tsx, phone.css, shell.css — cost if wrong: tests drive phones through frame locators.
- Chromium resets an iframe's focused element when the shell takes focus (checked in isolation), so each phone remembers its last focused control and restores it when the phone is focused again; Review Focus 3's check refocuses the phone and expects the same control — cost if wrong: one focus listener.
- shell events setAppearance (model, theme, text size per phone) and showSystem (for Task 27) join WorldEvent; the URL's theme and text record the focused phone, and loading applies them to both phones — cost if wrong: URL loses a per-phone difference.
- routes without a screen show their name and panels without a view show their title with Close, until Tasks 24–26; the shutter check moves to Task 25 and the keyboard-on-device-switch check is test.fixme until the Username screen (Task 24) — cost if wrong: none, both are enabled later in this plan.
- useWorld also takes { playing } and returns applied and dispatchFrom for the bridge; Reset rebuilds the scenario keeping each phone's model, theme and text size — cost if wrong: Reset semantics.
- each phone's controls sit in an "Adjust" popover so the stage stays clear and small windows fit; the prototype route stops page scrolling so only the navigator scrolls, and the navigator scrolls itself to the current scenario — cost if wrong: layout only.
- copy/permissions.ts (Task 24's file) is created now with the brief's purpose strings, because the shell already shows system prompts — cost if wrong: none.

### Task 24

- the approved Viewfinder and InvitationCode keep their own wording for scanning, not an invitation, camera in use, expired and offline; the plan's draft variants ("That's not an invitation from this app", "Your camera is in use by another app", "Invitation expired", "Connect to the internet to show your invitation") aren't shown, so one state never says two things — cost if wrong: copy in two approved components.
- the model gains signIn (a new account goes on to Username, an existing one Home; offline does nothing) and typeField clears any notice — cost if wrong: two small transitions.
- each phone document keeps focus in a text field while a button is pressed (mousedown default prevented), as tapping a button does on a phone — on a computer the click took focus, the keyboard dropped and Send request or Continue moved away before the click landed (found by the scanner test) — cost if wrong: one listener in PhonePage.
- the journey test opens Sarah's invitation before Simulate scan, since a scan needs a code; the shell offers Simulate scan only while Sarah shows a code and nothing else is under way, and Words don't match / Sarah's phone changes while a request waits; the Sending-to-Sarah pill check moves to Task 25 with the Camera screen — cost if wrong: test steps.
- Open Settings stands in for turning access back on in system Settings — it grants the permission, since Settings is outside the app — cost if wrong: one prototype affordance.
- the Connect panel puts focus on the six words first, so they are read before any answer, and is tall only while a request waits; Username checks the name once typing pauses (500 ms) and Continue claims it once available — cost if wrong: focus and timing details.
- shared screen layout (ScreenBody, RingBar, AccountButton wrapping the Library Avatar in a plain button) lives in src/prototype/screens/parts.tsx; Alex's Home is his own empty gallery; Sarah's rings wait or are unavailable while a request or session runs — cost if wrong: layout only.

### Task 25

- a capture keeps the camera busy for timing.captureMs (300 ms) and refusal toasts go after timing.toastMs (3 s) — the brief's double-tap test needs one photo and the busy toast, and the Toast component has no timer of its own; lasting refusals (ended, storage, queue) come before the busy moment; rule tests space captures by captureMs — cost if wrong: burst speed and toast timing.
- the model's refusal toasts come from copy/camera.ts, so the queue-full and storage-full wording is the brief's; those two scenarios no longer fire a refused tap, because the blocked shutter already says why and a toast repeated it — cost if wrong: two scenario worlds.
- setCamera (flash, zoom, facing) joins WorldEvent; lenses by phone: iPhone 16 Pro .5/1/2/5, SE 1/2, Galaxy A15 .5/1/2, compact Android 1/2; the preview is a crop of the sample image, closer as it zooms — cost if wrong: camera details.
- Cancel unsent reads "Photos already received stay on Sarah's phone." instead of "stay with her", so it fits any recipient without a pronoun; End session says "1 photo keeps sending" (correct singular, D16) — cost if wrong: two strings.
- the Session panel starts focus on its summary, not on End session; the camera exposes the pill's pulse key as data-pulse for the test; after the session times out the camera offers Done → Lock; the shell offers Unlock canceled on the lock; the lock adds "Only Alex can unlock this phone." (trust-sensitive); the last-photo viewer colors its label by count (delivered green, sending blue, waiting orange) — cost if wrong: small UI details.

### Task 26

- once both phones approve recovery, both Recovery panels close and the lock shows what is sending; a report is a sendReport event that can add the other person to the blocked list (D17) — cost if wrong: two small transitions.
- deleting from the app says "The copy in Photos isn't affected." only for a saved photo; for one only in the app it says "This photo is only in this app, so deleting it can't be undone." (R5 honesty, beyond the brief's one message); the account deletion's second step counts the copies that stay in Photos (R11) — cost if wrong: copy.
- Open Photos is shown as the phone shows it but does nothing here, since the Photos app is outside the prototype; Save to Photos with access off shows the Open Settings message after the tap (the brief's "Save shows the message"), and Open Settings stands in for turning access on — cost if wrong: one prototype affordance.
- HomeIndicator 1.0.1 (patch to an approved component): over screens that ask for light status-bar glyphs, Android's three buttons sit on the camera scrim with light glyphs — Task 18 switched the iOS indicator and the gesture bar but missed the three buttons, which left a white strip under dark viewers; test added; owner to see in the report — cost if wrong: one CSS rule and a version.
- the settings pages are one file each with their own screenId, as the plan lists; Help's topics and Contact support are plain rows (nothing to open in the prototype); Privacy states three promises from specifications 01 and 06 (trust-sensitive); the Recovery panel focuses its explanation first — cost if wrong: layout and copy.

### Task 27

- "Show Lock Screen" is a checkbox in each phone's controls, setting ui.system through showSystem; while a system surface shows, the app's screen, panels and prompts are hidden (the app is closed); scenario system-progress-notification draws Android's shade (clock small, card under it); the Lock Screen keeps 9:41 like the status bar and dates the story Thursday, October 29 — cost if wrong: layout of a mock surface.
- with every route and panel built, the placeholder screen and panel and their name tables are removed, and the registries are complete Records — cost if wrong: none.

### Task 28

- the matrix sets the device model on the phones a scenario is about (one phone in single view; both for "both" scenarios), lets entrances finish before checking, and runs axe inside each phone's screen through a frame path — cost if wrong: coverage of the other phone in one-phone scenarios (it is covered in (a)).
- fixes the matrix found — the scanner asks for light status-bar glyphs (the clock was 1.24:1 on the camera view; 19 tests); the Invitation panel has Done, which also gives keyboard users a stop when the code scrolls on the two small phones (axe scrollable-region-focusable; 4 tests); Shutter 1.0.1, a patch to an approved component: a blocked shutter's message, drawn inside the button, is part of its name instead of a description (WCAG 2.5.3; 3 tests; its unit test changed accordingly) — cost if wrong: one attribute each.
- npm run check now takes about 5 minutes with the matrix (469 browser tests) — cost if wrong: slower checks.

### Task 29

- the app now routes under any base path (BrowserRouter basename from Vite's BASE_URL; phones load from the same base) and ?embed=1 hides the workspace chrome — a release built for /__releases/<version>/ could not route or load its phones otherwise — cost if wrong: two lines in App and PhoneEmbed.
- the dev server answers /__releases/index.json with [] when nothing is built (Chrome logs a fetch 404 as a console error, which fails the console guard); it serves only files inside .releases and each release's own index.html for its routes — cost if wrong: one middleware.
- the manual check tagged the Task 29 commit itself (design-v0.0.1-test at 924236d, local, never pushed) instead of HEAD~1, which predates base-path support and cannot route under /__releases; release:fetch built it in 5 s from a temporary worktree that it removed; the RingButton page and /prototype?scenario=home-photos showed both builds with no console problems; the tag, .releases/0.0.1-test and the index were deleted afterwards — cost if wrong: none.
- the check found a layout bug: on windows under 720 px the narrow-navigator rule also applied in Present mode and in the compare view, squeezing the phones into 200 px; fixed with a test that failed on the old CSS (200) and passes now (640) — cost if wrong: none.
- the prototype shell offers "Compare with" only once a release is built; a compare link to a release that isn't built gives a notice and shows today's phones — cost if wrong: one control.

### Final

- design review 7, "Continue with Apple" drawn as an accent capsule, is not fixed here — the fix is a new system-layer sign-in component with Apple's and Google's own button styles, which needs the owner's approval in the Lab and a decision on trademark artwork in a public repository — cost if wrong: Welcome shows a non-compliant sign-in button until then; native must use ASAuthorizationAppleIDButton regardless.
- Android panels take the elevated background (white in light) instead of a surface tint, so one card token, color.surfaceElevated, works inside panels on both platforms; the panel body re-maps --color-surface to it, as iOS resolves colors at the elevated level — cost if wrong: one token swap for Android sheets.
- the lock shows one line, the first that holds: still on this phone, needs both phones, waiting for Sarah's phone, didn't reach Sarah, all reached, no photos; the "Only Alex can unlock" line is removed rather than reworded for each biometric — cost if wrong: one more line of copy.
- End session's message comes from the model itself (endingNow runs endSession on a copy of the world), so the copy can't drift from R6/R7 — cost if wrong: none.
- a new request waits while a recovery is needed (canRequest), instead of the model keeping a list of recoveries; the Recovery panel can't be dismissed, so in the UI this only closes the shell's simulated scan — cost if wrong: a list of recoveries later.
- LiveActivity's ended state says "Session ended" and SystemSurfaces' logic is unchanged — Sarah's phone can't see Alex's offline queue, so no state logic could make "all arrived" true — cost if wrong: copy only.
- the invitation opens at the large detent rather than a new fit-to-content detent, so Panel's API is unchanged — cost if wrong: empty space under the code on tall phones.
- Settings and its pages use the screen background, with iPhone's grouped rows on surface (iOS's grouped look inverted), so no grouped-page token is needed — cost if wrong: one page token.
- the code reviewer's "declined to judge" items stand: fades under Reduce Motion (spec §7 allows fades in place of spatial motion); the design-v1.0.0 tag (tagging follows the owner's merge, per the README); small-window fit and focus across a device switch (covered by shell.spec and devices.spec in the full check); the world cloned to both phones every 100 ms (no budget in the spec, fine at prototype scale); npm ci of an older tag running its install scripts (the same reviewed dependencies, from this repository's own tags) — cost if wrong: small, each named in the review.
- Sarah deleting her account during a live session (code review, declined to judge) is left for a product decision: the model drops the session at once (doc 03 disables routing immediately), so Alex's camera shows its pill with no name until he leaves the camera; his own unlock still returns his phone — cost if wrong: an odd camera state on that path.
- the final review's fixes go in one commit, because several files carry more than one fix; the ledger and the PR map each fix to its test — cost if wrong: a coarser history.
- this plan's workspace (ledger) stays until the owner merges PR #2 or answers the sign-in question, instead of being deleted now — a further fix pass on this branch would resume from it; its rulings and minors are already committed in docs/work/2026-10-28-design-system-build-rulings.md — cost if wrong: one git-ignored directory left on disk.
- SignInButton is a new group 5 ("Sign-in") in the Lab for the owner's approval, and Welcome keeps its current buttons until the group is approved and promoted — the lifecycle puts a component in the Library before a screen uses it — cost if wrong: Welcome stays non-compliant until approval.
- no logo artwork, as the owner chose on 30 October 2026: Apple's logo is U+F8FF from Apple's system font, shown only on Apple devices, and Google's G is a dashed placeholder — cost if wrong: the review shows placeholders, not the exact marks.
- both sign-in buttons take our Button's height, capsule and headline type, so neither brand is less prominent (Apple HIG; Google's branding guidelines); natively Apple's system button sizes its own title (43% of its height) and Google's title is Google Sans Medium — cost if wrong: native titles differ slightly from the draft.
- an unavailable sign-in button dims to motion.dim instead of turning gray like Button, because each brand's colors must stay as the brand defines them — cost if wrong: one disabled style.
- the Library and the Lab list every group from groupNames instead of a hard-coded [1, 2, 3, 4], which hid group 5; the overview test expects "Unreleased" for an unreleased section — cost if wrong: none.

## Deferred minor findings

- **Final:** Panel's body can scroll without anything focusable inside if future content is long and has no controls (axe scrollable-region-focusable); today's only case, the Invitation panel, now has Done.
- **Final:** answerPermission ignores whether a prompt is open; Allow then Don't Allow inside the 200 ms fade flips the answer (code review 3).
- **Final:** the username lookup normalises "@" and case for the match but not for "known" ("@alex" says no match) (code review 4).
- **Final:** a remounted phone restarts seq at 0 while the shell's applied count stays high, so one tap can flicker back for one round trip (code review 5).
- **Final:** release-fetch.ts doesn't prune a stale worktree after Ctrl-C, and a throw in its finally hides the first error (code review 6).
- **Final:** the release middleware returns 500, not 400, on a malformed escape (code review 7).
- **Final:** Escape doesn't leave Present mode while a phone has focus; the Exit button does (code review 8).
- **Final:** /prototype/phone/<bad id> renders a blank page, not the not-found view (code review 9).
- **Final:** the camera screen and the model count the queue limit over different photos (code review 10).
- **Final:** R5 labels and cameraStatusText live outside the copy modules and aren't marked trust (copy review).
- **Final:** autoSaveOn, lastPhotoNote, accessBody and session.cancelMessage could say more precisely what happens; connect.words isn't marked trust (copy review).
- **Final:** the destination pill says "Sending to Sarah" even with nothing sending (design review 10).
- **Final:** the storage-full message sits across the shutter ring and has no final period (design review 11).
- **Final:** the Lock icon and Android list headers use accent blue without being tappable (design review 12).
- **Final:** the Session panel's list starts 16 pt further in than its title on iOS (design review 13).
- **Final:** two "Today" sections on home-live-receiving, one per session (design review 14).
- **Final:** copy details: a straight apostrophe in camera.busy; Recovery says "to Sarah" on Sarah's own phone; the mismatch panel's title and message; "This session has ended" said twice (design review 15; its "lender" role word was fixed with privacy point 1).
- **Final:** the Connect panel at the largest text opens scrolled to the words, cutting a line under the title (design review 16).
- **Final:** the Numeral's words sit far from the number (design review 17, opinion).
