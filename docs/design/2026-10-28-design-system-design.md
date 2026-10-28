# Design system and app prototype — design

Status: **proposed for owner approval**. Date: 28 October 2026. Prepared with the owner (co-founder) in a facilitated design session. Nothing in this document is built yet.

## 1. Summary

We will build the product's design system and a complete, clickable app prototype as one local web workspace in a new top-level `design/` folder. It has four parts — **Guideline, Lab, Library and Prototype** — plus a changelog. Every value comes from one token source. Every prototype screen is built only from Library components. Every component has a version, a changelog and its previous version kept for side-by-side comparison. Engineers will build the native iOS (SwiftUI) and Android (Compose) apps from this workspace.

This workspace is a design tool. It contains no native code, backend, real camera, real keys, encryption or networking, and it is never deployed beyond the developer's own machine.

## 2. Why it exists

**The product.** Sarah borrows Alex's better camera. Every photo lands on Sarah's phone, and none stay on Alex's. It is a small utility that quietly closes a gap: people without a good phone get access to one, beautifully, and with dignity. The app never points at the gap.

**Two phones, two jobs.**

- Alex's phone is the **studio**: capture, prepare, encrypt, send. It is usually the better phone (for example an iPhone 16 Pro).
- Sarah's phone is the **album**: receive, show, save. It is often old or inexpensive — frequently a budget Android phone — and must feel just as good there: light, fast, small, patient with weak internet and nearly full storage.

**Why a design system now.** The owner's words: the more ready we are, the better the product we can build. Anyone who joins must be able to open the workspace, understand the product's design and contribute. Every element must be improvable later in one place and change everywhere it is used. Engineers need a precise, current source to build from.

**What success looks like.**

- A first-time pair connects and takes a photo in under a minute without help (target from the product requirements; measured later with real users).
- Sarah's phone never feels like the lesser one.
- Changing a component or an animation once changes it everywhere, with the previous version still visible for comparison.
- A new team member can find any screen, state, component or value in under a minute.

## 3. Goals, non-goals and anti-goals

**Goals**

1. A runnable local workspace (`npm run dev` inside `design/`) with Guideline, Lab, Library, Prototype and Changelog.
2. One token source in the W3C Design Tokens (DTCG) JSON format, generating the web's CSS variables and typed constants, structured so Swift and Kotlin outputs can be added later without changing the source.
3. A version 1.0 component Library covering every element the app uses. Each component shows its states, iOS and Android renderings, light and dark themes, measurements, accessibility notes, motion, where it is used and its versions.
4. A complete prototype of every screen, panel, settings page and state in section 9, on iPhone and Android device frames, viewable as one phone or as Alex's and Sarah's phones side by side, linked so an action on one shows on the other.
5. The product rules in section 5 are enforced by the prototype's model and covered by automated tests. This fixes the defects found in the 27 October prototype review.
6. The quality checks in section 13 pass, and the owner reviews everything in the browser.

**Non-goals**

- Native iOS or Android code, backend or relay services.
- Real camera, keys, encryption, networking or storage.
- Deployment or hosting beyond `127.0.0.1`.
- A Figma library, analytics, or A/B testing infrastructure.
- The final product name, logo or app icon (the placeholder name "Camera Sharing" stays until the owner decides).
- Languages other than English. All copy is centralized so translation can be added later.

**Anti-goals** (failure even if it technically works)

- Screens with one-off styles or literal values instead of tokens and Library components.
- A component that looks final but is not in the Library.
- Any UI that claims screenshot prevention, instant background delivery, server backup, guaranteed security or recall of photos already received.
- Apple SF Symbols artwork committed to the repository, which is public.
- Animation that delays a capture or hides a state.
- A scenario switch that leaves stale state behind.
- More than one primary action on a screen; decoration without meaning.

## 4. Decisions already made with the owner

| Topic | Decision | Source |
| --- | --- | --- |
| Purpose and audience | Access with dignity; Alex's studio phone and Sarah's album phone; the app never points at the gap; Apple quality, VSCO restraint, Instagram fluency. | Owner confirmed playback, 28 Oct |
| Structure | 31 screens become 8 screens, 4 panels and 8 settings pages; no tab bar; the phone's own permission prompts at the moment of need; one Lock screen replaces "Session ended" and "Return to owner"; Alex's phone shows counts, never thumbnails of the session's photos. Mapping in Appendix A. | "Looks good to me", Part 1 board |
| Visual language | Guideline v0.2: Apple blue `#0071E3`; the **ring** as signature control; soft status labels; a big numeral with one live dot for live counts; standard icons only (SF Symbols on iOS, Material Symbols Rounded on Android); iOS and Android side by side; light and dark. | "This one looks amazing", guideline v0.2 board |
| Platforms | iOS leads and uses native features; Android gets the same brand with its own native conventions. Both are first-class. | Owner, 28 Oct |
| Workspace and lifecycle | A localhost web workspace kept in the repository: Lab draft → owner review → final → Library (version bump, previous kept) → screens update everywhere → engineers implement natively. The guideline page is permanent and kept up to date. | Owner, 28 Oct |
| Quality bar | Production-ready and precise; "anyone can come here and see, and then they would work on it". | Owner, 28 Oct |
| First-release reviews | Library 1.0 is reviewed in four groups; screens use a group once approved. | Owner, 28 Oct |
| Authorization | Approving this document authorizes the build within the bounds in section 14. | Owner, 28 Oct |

The design boards approved in the session (structure, visual language and guideline v0.2) currently sit in the session's scratch folder. The first commit of this work copies them, self-contained with their one synthetic image, into `docs/design/boards/2026-10-28/` as the visual reference and the "previous" for future Guideline changes.

## 5. Product rules the design must enforce

These come from the planning specifications on `main` and from proposed amendments A1, A6, A7 and A8 in pull request #1 (branch `docs/adversarial-review`, commit `d237fb5`), which are **not yet approved**. The prototype includes those proposals because the owner's 27 October prototype brief asked for the safer proposed behavior (lender lock, explicit recovery approval, gallery storage). If the amendments change before approval, rules R4, R7, R10 and R11 change with them. The work branches from the latest `main` and does not depend on pull request #1 being merged.

Each rule is enforced in the prototype's model, not only drawn on screen, and each has an automated test. Appendix D lists every defect from the 27 October prototype review; each one maps to a rule or check here and gets a regression test.

| # | Rule | Source |
| --- | --- | --- |
| R1 | The camera always shows where photos go. One recipient and device per session; changing either needs a new session and fresh approval. | FR-02 |
| R2 | Both people approve. Both phones show the same two people, the recipient's exact device and the same verification words. A mismatch or changed device offers no path forward except starting again. | FR-01, 05 consent, A7 |
| R3 | No gallery on Alex's phone. It shows only the latest photo, held in memory and cleared on background or session end, plus delivery counts. Nothing goes into Alex's Photos. | FR-03, 05 camera |
| R4 | Borrowing mode survives everything except owner authentication: session end, expiry, background, relaunch, notifications, deep links and errors. Only Face ID, passcode or the Android equivalent returns Alex's gallery and account. | A6 (proposed) |
| R5 | Honest states. Preparing is not Prepared, uploaded is not received, received is not saved to Photos. Recoverable failures keep their state and add a retry marker. An interrupted save shows "Photos save needs checking" and offers "Save another copy" with a duplicate warning. | 06, FR-05 |
| R6 | Ending a session stops new captures and never cancels photos already authorized to send. Cancelling unsent photos is a separate, explicit action. Photos already received cannot be recalled. | 05, 06 |
| R7 | Photos taken offline that are still unsent after a session ends need both phones to approve recovery against the original recipient and expiry. "Try again" never bypasses this. | A7 |
| R8 | Permissions are asked once, at the moment of need. Denial leads to a useful state with a Settings link. The app never nags. Receiving works without Photos permission; Alex needs none. | 05, FR-07 |
| R9 | Wi-Fi-only shows as "Waiting for Wi-Fi" wherever queued photos appear. | 05 settings |
| R10 | A rejected shutter tap gets immediate, distinct feedback and is never counted as a photo. | A1 |
| R11 | Sign-out locks local data for that account; account deletion explains its effects; neither implies that copies saved to Photos are deleted. | A8 |

## 6. The workspace

**Location and running.** `design/` at the repository root, a self-contained web app. `npm install` then `npm run dev` serves it on `127.0.0.1` only. It works offline: no remote fonts, scripts or images at runtime.

**Routes**

| Route | Purpose |
| --- | --- |
| `/` | Overview: what the workspace is, the design system version, component counts by status, latest changes, links. |
| `/guideline` | The permanent product design guideline: principles, tokens, the ring, status labels, type, icons, platform rules, motion, writing and accessibility. Rendered from tokens, so it can never disagree with the components. |
| `/library` and `/library/:component` | Finalized components only. |
| `/lab` and `/lab/:component` | Drafts and components in review, with alternatives side by side. |
| `/prototype` | The whole app, built only from Library components. |
| `/changelog` | Design-system releases: what changed, when and why, with links to before and after. |

**A Library component page shows:**

- a live preview with controls for its options and states;
- toggles for iOS or Android, light or dark, and default or largest text size;
- every state in one gallery;
- anatomy with measurements and the tokens it uses;
- accessibility notes (labels, roles, contrast, target size, focus behavior);
- its motion, with exact spring and timing values;
- where it is used in the prototype (generated, never hand-maintained);
- the current and previous versions side by side, with the dated changelog;
- native notes: the matching SwiftUI and Compose building blocks, and its implementation status per platform (not started, in progress, done).

**A Lab page shows** one or more drafts side by side, the open questions and the promotion checklist (states complete, both platforms, both themes, accessibility checks pass, motion specified, owner approved).

**Lifecycle**

1. **Draft** in the Lab. Alternatives can sit side by side.
2. **Review**: the owner looks in the browser and chooses.
3. **Final**: the component moves to the Library. Its version goes up and the previous implementation is archived next to it.
4. **Propagate**: every screen that uses it updates automatically; the prototype marks screens affected by the latest release.
5. **Native**: engineers implement it in SwiftUI and Compose from the component page and record their status there.

**The first release, 1.0 (owner decision).** Library 1.0 is reviewed in four groups instead of one component at a time:

1. Foundations and rings.
2. Actions and status.
3. Structure, people and pairing, and camera.
4. Photos and system surfaces.

Each group is built in the Lab. The owner reviews it in the browser, and once it is approved it moves to the Library together. Prototype screens use a group only after that approval. Building continues on the next group while one is in review. After 1.0, changes follow the per-component lifecycle above.

**Versioning.** Each component follows semantic versioning: a major change alters appearance or behavior on existing screens, a minor change adds a variant or state, a patch fixes without visible change. The design system as a whole is versioned in `design/CHANGELOG.md`; the first Library release is 1.0.0.

**Previous and now (my call).** Every design-system release is a Git tag (`design-v1.0.0`, …). The workspace builds any earlier tag locally on request (`npm run release:fetch 1.0.0`, output not committed) and shows it beside the current build, for one component or for a whole prototype screen and state. Because the earlier build is exactly what shipped, its tokens and the child components inside composite components (Panel, PhotoTile, PersonPair) are exactly as they were. No component code is duplicated in the repository. Component pages default to comparing with the previous release; the changelog links each change to its before and after.

**Folder shape** (the builder may refine names, not the separation):

```text
design/
  README.md            how to run, how to contribute, lifecycle
  CHANGELOG.md         design-system releases
  DEPENDENCIES.md      purpose, alternatives, license and owner for each dependency
  tokens/              DTCG JSON: color, type, space, shape, motion
  src/
    tokens/            generated web outputs (not committed)
    icons/             icon registry + vendored Material Symbols Rounded subset (Apache-2.0)
    components/<Name>/ implementation, styles, metadata, examples
    workspace/         Guideline, Lab, Library, Changelog pages
    prototype/         device frames, review shell, domain model, screens, scenarios, copy
  tests/               unit (model rules, tokens) and end-to-end (routes, states, accessibility)
```

## 7. Foundations

### 7.1 Color

| Token | Light | Dark | Use | Contrast (light · dark) |
| --- | --- | --- | --- | --- |
| accent | `#0071E3` | `#0071E3` | Filled buttons, rings, focus, progress | White text 4.70:1. iOS default `#007AFF` fails (4.02:1) |
| accentText | `#0066CC` | `#2997FF` | Text buttons, links, tinted labels | 5.57 · 6.96 |
| accentTint | `#E8F1FC` | `#071829` | Tinted fills (Borrow ring disc) | accentText on it 4.88 · 5.94 |
| ink | `#1D1D1F` | `#F5F5F7` | Titles, body | 16.8 · 19.3 |
| ink2 | `#6E6E73` | `#A1A1A6` | Secondary lines | 5.07 (4.66 on surface) · 8.16. Never on accentTint (4.45) |
| ink3 | `#AEAEB2` | `#636366` | Disabled and placeholder only | Never carries information |
| background | `#FFFFFF` | `#000000` | Screens | — |
| surface | `#F5F5F7` | `#1C1C1E` | Grouped rows, cards; panels in dark | — |
| separator | `#D2D2D7` | `#38383A` | Hairlines, decorative | — |
| fieldBorder | `#86868B` | `#8E8E93` | Text field outline | 3.62 · 5.22 (controls need 3:1) |
| success | `#248A3D` | `#30D158` | Saved, delivered — icons only | 4.40 · 10.4 |
| waiting | `#C93400` | `#FF9F0A` | Waiting for internet or Wi-Fi — icons only | 5.28 · 10.2 |
| danger | `#D70015` | `#FF453A` | Destructive text, failed photo | 5.38 · 6.16 |
| live | `#FF3B30` | `#FF453A` | The live dot | 3.55 · 6.16 (graphic, 3:1) |
| cameraScrim | black 60% | black 60% | Behind white labels over the live preview (selected: 70%) | White over a white sky 5.74 |

**Status labels** (13 pt semibold on iOS, 14 sp medium on Android; icon plus words, always):

| Label | Light text on tint | Dark text on tint | Contrast |
| --- | --- | --- | --- |
| Live | `#C4170C` on `#FFEAE8` | `#FF6961` on `#3A1210` | 5.23 · 5.84 |
| Sending | `#0066CC` on `#E8F1FC` | `#2997FF` on `#071829` | 4.88 · 5.94 |
| Saved | `#1C7A34` on `#E5F5E9` | `#30D158` on `#0B2A14` | 4.78 · 7.66 |
| Waiting | `#B23A00` on `#FFF0E3` | `#FF9F0A` on `#331E00` | 5.38 · 7.70 |
| Only in this app | `#48484A` on `#F2F2F7` | `#A1A1A6` on `#1C1C1E` | 8.18 · 6.61 |

Rules: blue means tappable and nothing else is blue; tints never carry meaning alone; one live dot per screen; camera controls are white because color belongs to the photo.

### 7.2 Type

| Style | iOS (SF Pro, Dynamic Type) | Android (Roboto, font scale) | Use |
| --- | --- | --- | --- |
| Numeral | 80/80 Bold, tracking −2, tabular | 80/80 Bold, tracking −2, tabular | Live counts only |
| Large title | 34/41 Bold | 32/40 Bold | One per screen |
| Title 2 | 22/28 Bold | 22/28 Bold | Panel titles, Lock |
| Title 3 | 20/25 Semibold | 20/26 Medium | Section headers, verification words |
| Headline | 17/22 Semibold | 16/24 Medium | Row titles, buttons |
| Body | 17/22 Regular | 16/24 Regular | Main text |
| Subheadline | 15/20 Regular | 14/20 Regular | Second lines, counts |
| Footnote | 13/18 Regular | 14/20 Regular | Fine print; the minimum size |

Nothing smaller than 13 pt on iOS or 14 sp on Android. The numeral does not grow with the text-size setting, because already-large text is exempt (my call). At the largest setting, iOS uses Apple's AX5 sizes and Android its non-linear 200% scale. Sentence case everywhere. Counts use tabular figures so numbers never shift. Text scales to the largest accessibility sizes; rows stack rather than truncate. On non-Apple computers the workspace falls back to the system font for iOS mockups; this is a known limitation of rendering SF Pro on the web.

### 7.3 Space, shape and touch

- 4-point grid: 4, 8, 12, 16, 20, 24, 32, 48.
- Screen margins: 20 pt on iOS, 16 dp on Android.
- Minimum touch target: 44 × 44 pt on iOS, 48 × 48 dp on Android.
- Corner radii (continuous on iOS): 12 thumbnails and fields, 16 cards, 38 panel top, capsule buttons; photos in the grid are square with 2-point gaps and never rounded or bordered.
- Buttons: filled and tinted capsules 50 pt tall; text buttons 44 pt; at most one filled button per screen.
- Fields: 50 pt, radius 12, 1 pt `fieldBorder` outline, accent focus ring.

### 7.4 The ring

The camera shutter turned into the signature control. **Rings are for camera moments** (borrowing, lending, capturing, a photo on its way); decisions inside panels use capsule buttons.

| Member | Spec |
| --- | --- |
| Ring button | 72 pt/dp; 2.5 pt accent ring; 4.5 pt gap; 58 pt disc. Filled (Lend: accent disc, white icon) or tinted (Borrow: accentTint disc, accentText icon). 28 pt filled icon. Label below, 9 pt gap. States: rest, pressed (disc 92%), waiting (ring becomes a moving arc, disc tinted), unavailable (neutral). |
| Shutter | 78 pt; 4 pt white ring; 64 pt white disc. States: ready, pressed, preparing (disc dims, ring keeps shape), blocked (disc hidden behind a message, never silently disabled). |
| Progress ring | 28 pt, 2.5 pt stroke, accent arc on a 10% neutral track. Fills with real progress; never spins without progress. |
| Live dot | 10 pt (8 pt inside a label), `live` color, breathing 1.6 s; steady with Reduce Motion. |

### 7.5 Motion

Motion proves what happened and never delays a photo. Springs are defined once in Apple's terms and converted for each platform: stiffness = (2π ÷ response)², damping = 4π × damping fraction ÷ response (mass 1). Compose uses `spring(dampingRatio = dampingFraction, stiffness)`.

| Token | Value | Used by |
| --- | --- | --- |
| spring.navigate | response 0.35 s, damping fraction 1.0 | Screen pushes |
| spring.panel | response 0.42 s, damping fraction 0.9 | Panels rising and following a drag |
| spring.press | response 0.30 s, damping fraction 0.7 | Ring and button release |
| spring.drop | response 0.42 s, damping fraction 0.86 | Captured photo dropping into the last-shot well |
| press.down | scale 0.92 (rings) or 0.97 (buttons), 100 ms ease-out | Touch down |
| capture.dip | black 0 → 60% → 0 over 140 ms | Shutter |
| develop | blur 16 → 0, saturation 0.2 → 1, 600 ms, cubic-bezier(0.22, 1, 0.36, 1) | A photo arriving on Sarah's phone, once per photo, never on scroll |
| pill.pulse | scale 1 → 1.06 → 1, 240 ms | "Sending to Sarah" after each capture |
| live.pulse | opacity 1 ↔ 0.35, 1.6 s | Live dot |
| fade.reduced | 200 ms cross-fade | Replaces all spatial motion when Reduce Motion is on |

Haptics: light impact on capture and on a verified connection (iOS); `CONFIRM` (Android). Budget Android phones (under 4 GB RAM) replace the develop effect with a fade.

### 7.6 Icons

Standard icons only. iOS uses SF Symbols; Android uses Material Symbols Rounded (weight 400, outlined at rest, filled when selected or inside a ring). The workspace draws Material Symbols for both platforms because SF Symbols artwork cannot be published in our public repository; each icon records its SF Symbol name for native work (Appendix B). The web uses a vendored subset of Material Symbols Rounded SVG files under their Apache-2.0 license, not the full font.

### 7.7 Accessibility thresholds

WCAG 2.2 AA: 4.5:1 for text, 3:1 for large text, icons and control boundaries. Visible keyboard focus on every control, including inside panels. Focus moves into a panel when it opens and returns to the control that opened it. Status changes are announced politely and coalesced. Nothing is conveyed by color, motion or sound alone. Reduce Motion is honored everywhere.

### 7.8 Token pipeline

The DTCG JSON in `design/tokens/` is the single source. A small script generates `src/tokens/tokens.css` (custom properties keyed by theme and platform) and `tokens.ts` (typed constants, including springs). Generated files are rebuilt on `dev`, `build` and `check`, and are not committed. A test declares every foreground/background pair the UI uses and fails if any falls below its threshold.

### 7.9 Platform fidelity: brand layer and system layer (my call)

Each component belongs to exactly one layer, recorded in its metadata.

- **Brand layer: our own components, the same on both platforms.** RingButton, Shutter, ProgressRing, LiveDot, StatusLabel, Numeral, Button, InlineMessage, Toast, EmptyState, Avatar, PersonPair, VerificationWords, InvitationCode, Viewfinder, DestinationPill, ZoomControl, LastShotWell, CameraStatusLine, PhotoTile, PhotoGrid and PhotoViewer. One set of numbers serves both platforms: points on iOS equal density-independent pixels on Android (a 50 pt capsule is 50 dp). Only the typeface, icon set, margins and minimum targets switch per platform (sections 7.2, 7.3, 7.6).
- **System layer: the platform's own components, themed with our tokens.** TopBar, Panel, ConfirmDialog, Toggle, TextField, ListRow, GroupedList, ChoiceChips, Keyboard, PermissionPrompt, StatusBar, LiveActivity and ProgressNotification. These follow the platform's own metrics and behavior, so engineers reuse SwiftUI and Compose defaults instead of fighting them. Examples: the switch is iOS's switch or Material's switch, the Android text field is Material's 56 dp outlined field, and panels are the system sheet.
- **Which OS look is drawn.** The current releases at build time: iOS with Liquid Glass (system sheets, bars and alerts; a glass background under Home's ring bar, with a gradient fade on iOS versions before Liquid Glass), and stock Android with Material 3 Expressive. Manufacturer skins such as Samsung One UI are not imitated; the Galaxy A15 frame uses stock Android chrome, which is listed as a known limitation. Minimum supported OS versions remain an engineering decision (the specifications propose iOS 18 and Android 10). Brand-layer components must also look right on those older versions.

## 8. Components for Library 1.0

| Group | Components |
| --- | --- |
| Rings | RingButton, Shutter, ProgressRing, LiveDot |
| Actions | Button (filled, tinted, plain, destructive), IconButton, Toggle, TextField, ChoiceChips |
| Status | StatusLabel, Numeral, InlineMessage (neutral, waiting, problem; optional action), Toast (never covers a primary control) |
| Structure | TopBar (large title, trailing avatar, collapses on scroll), SectionHeader, ListRow (icon, title, second line, trailing chevron/value/toggle/label), GroupedList, Panel (iOS sheet / Android bottom sheet, detents, drag to dismiss), ConfirmDialog (iOS action sheet or alert / Android dialog), EmptyState |
| People and pairing | Avatar, PersonPair (camera → phone identity block), VerificationWords (six words, two rows), InvitationCode (QR card with countdown), Viewfinder |
| Camera | DestinationPill, ZoomControl, LastShotWell, CameraStatusLine |
| Photos | PhotoTile (arriving with progress and develop, only in this app, saving, saved, needs checking, expired), PhotoGrid (sections by session and day), PhotoViewer |
| System surfaces (mock) | DeviceFrame (iPhone, Android), StatusBar, HomeIndicator / GestureBar, Keyboard (iOS, Android), PermissionPrompt (iOS, Android), LiveActivity (iOS Lock Screen and Dynamic Island), ProgressNotification (Android) |

Each component defines its states, both platform renderings, both themes, accessibility behavior and motion before it can be final.

## 9. App structure, screens and states

**Screens (8):** Welcome, Username, Home, Scanner, Camera, Lock, Photo, Settings.
**Panels (4):** Invitation, Connect, Session, Recovery.
**Settings pages (8):** Sign-in methods, Devices, Blocked accounts, Storage, Privacy, Help, Report, Delete account.
**Confirmations:** End session, Cancel unsent photos, Delete from this app, Sign out, Delete account.
**System surfaces:** permission prompts, Live Activity (iOS), progress notification (Android).

| Where | States (each one reachable from the review shell) |
| --- | --- |
| Welcome | Ready · sign-in failed · sign-in canceled · offline |
| Username | Empty · checking · available · taken · not allowed (rule shown inline, never hidden by the keyboard) · offline |
| Home | First use (empty) · photos · live: receiving, with a numeral and developing tiles · live: waiting for Alex's internet · storage full · Photos access off · request arriving (Connect panel) |
| Invitation (Sarah) | Showing code with countdown · expired, refresh · offline: no code shown |
| Scanner (Alex) | Camera access prompt · access off (Open Settings) · camera in use elsewhere · scanning · not a valid invitation · type a username: no match, too many requests, not available |
| Connect (both) | Incoming (Sarah) · check words · waiting for the other phone, with expiry · declined · expired · words don't match: start again · receiving device changed: start again |
| Camera (Alex) | Ready · preparing · photo sent (drop and pulse) · offline: waiting count · Wi-Fi only: waiting for Wi-Fi · busy tap rejected (brief, distinct) · queue full · storage full: capture blocked with recovery · camera interrupted · session ends soon · session ended · flash, zoom, flip · last photo open · last photo cleared after background |
| Session panel (Alex) | Counts: sent, sending, waiting · per-photo list without thumbnails · time left · end session · cancel unsent photos |
| Lock (Alex) | Locked, with what is still sending · authentication canceled: still locked · relaunched: still locked · unlocked → Home |
| Recovery (both) | Needs both approvals · approved here, waiting for the other phone · declined · original expiry passed |
| Photo (Sarah) | Only in this app · saving · saved to Photos · Photos access off (Open Settings) · save needs checking (Open Photos / Save another copy) · delete from this app (confirm) |
| Settings | List · save to Photos unavailable (access off) · Wi-Fi only on · notifications off |
| Settings pages | Sign-in: connected, last method can't be removed · Devices: two, one · Blocked: list, empty (block from Report) · Storage: normal, full, empty · Privacy: summary · Help: topics, support unavailable · Report: form with "Block this account", sent · Delete account: confirm, deleted |
| Sign out | Unsaved app copies warning · no unsaved photos · signed out |
| System | Camera, Photos (add-only) and notification prompts on each platform · Live Activity: connected, arriving, done · Android progress notification |

## 10. Prototype behavior

- **Two simulated phones.** Alex's and Sarah's phones each hold their own state, and a simulated relay carries events between them. Network conditions (online, slow, offline, Wi-Fi only) are set per phone. The review shell shows one phone or both side by side; by default Alex uses an iPhone 16 Pro and Sarah a Galaxy A15, which tells the product's story.
- **Real lifecycle.** Photos move through the states in specification 06 (Capturing → Preparing → HostPrepared → Reserved → Uploading → CloudVerified → Downloading → RecipientStored → ReceiptAccepted, with export, expiry, cancellation and retry markers). Appendix C maps each state to what Alex and Sarah see.
- **Pure scenarios.** A scenario is a function that returns the complete state of both phones and the relay. Choosing one replaces everything; Reset re-applies it. Nothing leaks from one scenario to the next. The URL records the scenario, screen and focused phone, so any state can be shared as a link.
- **Time control.** Expiry and countdown states are reached by advancing a simulated clock, not by waiting.
- **Relaunch.** Each phone can be "relaunched": persistent state (borrowing mode, queue, gallery) survives; memory-only state (last-shot preview, decrypted views) is cleared.
- **Review shell.** Navigator grouped by journey; scenario picker; per-phone device, theme and text-size controls; one or two phones; Present mode for meetings.
- **Devices (my call).** Four frames: iPhone 16 Pro (402 × 874 pt, top inset 62 pt, bottom inset 34 pt, Dynamic Island, Face ID), iPhone SE 3rd generation (375 × 667 pt, Home button, Touch ID — the smallest iPhone the proposed minimum supports), Galaxy A15 (412 × 891 dp, derived from its 1080 × 2340 px panel at Samsung's usual 2.625 scale and to be confirmed on a device; the story's budget phone) and a compact Android at 360 × 800 dp (the most common small Android size). Values that are derived or approximate are marked as such in each frame's metadata. Test matrix: every screen and state on the two default phones in light theme; every screen's main state on all four frames in light and dark; and every screen's main state on the two smallest frames at the largest text size. Nothing essential may be clipped or hidden at any of these.

## 11. Writing

- Short, warm and plain. Names, not roles: "Sarah's phone", not "recipient device".
- Never blame the phone or the person. Say what happened and what to do next.
- Numerals for counts ("3 photos"), correct singular ("1 photo"), sentence case, no exclamation marks.
- Every status is honest about its clock: "2 photos expire in 12 hours".
- Copy lives in one strings module per screen or component, ready for translation.

**Who writes it and how it is checked (my call).** I draft every string. Where specification 05's state and copy inventory already gives a message, it is used as written. Each string is tagged in its strings module as ordinary or **trust-sensitive**. Trust-sensitive strings make a promise about privacy, delivery, saving, deletion, locking, recovery or what the other person can see (for example Lock, Privacy, Delete account, Recovery, Connect, and every R5 state). Before the owner reviews the workspace, an independent reviewer checks every trust-sensitive string against section 5 and the anti-goals for any overclaim. All copy stays "proposed" until a privacy and legal review before release, which is outside this project. Device-specific words come from the device: "Use Face ID", "Use Touch ID" or "Use passcode" on iPhone, and "Unlock" with the system prompt on Android.

## 12. Technology and dependencies

- Node 24.12.0 and npm 11.6.2, as installed on the owner's Mac; pinned with `engines` and committed lockfile.
- Start from the exact versions already installed for the 27 October prototype: React 19.2.7, React DOM 19.2.7, TypeScript 7.0.2 (strict), Vite 8.1.3, `@vitejs/plugin-react` 6.0.3, `motion` 12.42.2, `@radix-ui/react-dialog` 1.1.19, `@radix-ui/react-dropdown-menu` 2.1.20, `@use-gesture/react` 10.3.1, `qrcode` 1.5.4, `@fontsource/roboto` 5.2.10, Prettier 3.9.10, Playwright 1.61.1. Those were installed without the dependency review the engineering standards require, so they are not treated as reviewed. Dropped: `@radix-ui/react-icons` (custom icons are replaced by standard sets).
- New: `react-router` (routes), a vendored Material Symbols Rounded SVG subset (Apache-2.0), `vitest` (unit tests), `@axe-core/playwright` (accessibility checks).
- **Every dependency, old and new**, gets a recorded review in `design/DEPENDENCIES.md` before it is installed: purpose, alternatives considered, license, maintenance, security advisories, transitive footprint and update owner.
- No runtime network access. The dev server binds `127.0.0.1` only.
- Not chosen: Storybook. It is the industry's component workshop, but it would add a large dependency tree and split the Guideline, Library and Prototype into separate apps with different look and feel. One branded workspace serves this team better; this can be revisited if the team grows.

## 13. Quality bar and acceptance

`npm run check` must pass and runs:

1. Token schema validation and generation.
2. Strict type checking and formatting.
3. Unit tests: every rule in section 5, scenario purity (no state carried across scenarios), token contrast pairs, photo-state-to-label mapping, plural forms.
4. End-to-end tests: every route; every Library page in both platforms and themes; every screen and state in section 9 renders without console errors or warnings; no serious or critical accessibility violations; Reduce Motion removes spatial motion.

Also required before the owner is asked to approve the build:

- Every Library component reviewed in the browser against this document.
- Every defect in Appendix D has a passing regression test.
- An independent design and accessibility review of the finished workspace, and an independent overclaim review of every trust-sensitive string, with findings resolved or recorded.
- The pull request uses the repository's change-review template, with evidence and screenshots.

## 14. Process and governance

- **What approving this document authorizes (owner decision).** Creating `design/`, `docs/design/` content and the approval record; installing the dependencies listed in section 12, each only after its review is written in `design/DEPENDENCIES.md`; running the workspace and its tests on `127.0.0.1`; committing on a branch and opening a pull request that the owner merges. It does not authorize native apps, backend services, deployment or hosting, paid services, or changes to `main` without a pull request.
- An owner approval record is written from the owner's chat instructions and this document's approval, using the repository's template, in `docs/decisions/`.
- Work happens on a branch from the latest `main`, uses Conventional Commits and is pushed for a pull request that the owner merges.
- The repository plan gains one line for `design/` (the design-system workspace).
- The 27 October prototype in `prototypes/mobile-review/` stays untouched as a reference until the owner retires it. It is not migrated; the new workspace is built from scratch.

## 15. Calls I made, for the owner to check

1. The accent is `#0071E3`, the blue Apple uses for buttons, not iOS's `#007AFF`, because white text on `#007AFF` fails accessibility contrast.
2. Dark mode ships from day one; the camera is always dark.
3. The ring is reserved for camera moments; ordinary decisions use capsule buttons.
4. One live dot per screen.
5. The workspace draws Material Symbols for both platforms because Apple's symbols can't be published in a public repository.
6. Default devices in the prototype: Alex on an iPhone 16 Pro, Sarah on a Galaxy A15, with iPhone SE and a compact 360 × 800 dp Android also available.
7. A custom workspace instead of Storybook.
8. Budget Android phones replace the develop effect with a fade.
9. Brand components look the same on both platforms; system components (sheets, dialogs, switches, text fields, lists, bars, keyboards, prompts) are each platform's own, themed with our tokens and drawn in the current OS look.
10. "Previous and now" compares real earlier release builds, for components and whole screens, instead of keeping copies of old code.
11. I write all copy; trust-sensitive strings get an independent overclaim review now and a privacy and legal review before release.

## 16. Left to the builder

Exact component APIs and file names within the folder shape; the design of the workspace's own pages, within the Guideline's language; how "where used" is computed; test granularity beyond section 13; sample names and photos (synthetic only — no real people's photos).

## Appendix A — Where each of the 27 October screens goes

| 27 October screen | New home |
| --- | --- |
| Start, Received photos | Home |
| Welcome, Sign in | Welcome (with sign-in) |
| Choose username | Username |
| Camera permission, Save to Photos permission, Notifications | The phone's own prompt at the moment of need; denied states become one line with Open Settings |
| Receive invitation | Invitation panel |
| Scan invitation, Find by username | Scanner (username entry inside it) |
| Session request, Approve both phones | Connect panel |
| Camera, Last photo | Camera (last photo opens over it) |
| Session details, Transfer activity | Session panel (Alex) and Home's live state (Sarah) |
| Session ended, Return to owner | Lock |
| Approve recovery | Recovery panel |
| Photo viewer | Photo |
| Storage & deletion | Settings › Storage |
| Profile & settings and seven account pages | Settings and eight pages; Sign out becomes a confirmation |

## Appendix B — Icon registry

| Meaning | SF Symbol (iOS) | Material Symbol (Android) |
| --- | --- | --- |
| Lend camera | camera | photo_camera |
| Borrow, invitation | qrcode | qr_code_2 |
| Scan | qrcode.viewfinder | qr_code_scanner |
| Type a username | at | alternate_email |
| Your photos | photo.on.rectangle | photo_library |
| Save to gallery | square.and.arrow.down | download |
| Sending | arrow.up | arrow_upward |
| Saved, delivered | checkmark.circle | check_circle |
| Waiting | clock | schedule |
| No internet | wifi.slash | wifi_off |
| Wi-Fi only | wifi | wifi |
| Needs attention | exclamationmark.triangle | warning |
| Locked for owner | lock | lock |
| Unlock | faceid | fingerprint |
| Flash on, off | bolt, bolt.slash | flash_on, flash_off |
| Flip camera | arrow.triangle.2.circlepath.camera | cameraswitch |
| Close | xmark | close |
| Back | chevron.left | arrow_back |
| Open | chevron.right | chevron_right |
| More | ellipsis | more_horiz |
| Delete | trash | delete |
| Account | person.crop.circle | account_circle |
| Devices | iphone | smartphone |
| Blocked | nosign | block |
| Privacy | checkmark.shield | verified_user |
| Help | questionmark.circle | help |
| Report | flag | flag |
| Storage | internaldrive | hard_drive |
| Sign out | rectangle.portrait.and.arrow.right | logout |

## Appendix C — Photo states and what each person sees

| Lifecycle state (06) | Alex's phone | Sarah's phone |
| --- | --- | --- |
| Capturing, Preparing | Preparing (shutter dims briefly) | — |
| HostPrepared, offline | Waiting for internet | — |
| HostPrepared, Wi-Fi only on cellular | Waiting for Wi-Fi | — |
| Reserved, Uploading | Sending | — |
| CloudVerified | Ready for Sarah | Arriving soon (count only) |
| Downloading | Ready for Sarah | Arriving (progress ring) |
| RecipientStored, ReceiptAccepted | Delivered | Only in this app (develops on arrival) |
| ExportPending | — | Saving to Photos |
| LibrarySaved | — | Saved to Photos |
| ExportUncertain, UserActionRequired | — | Photos save needs checking |
| Expired | Expired, with what was lost | Expired, never arrived |
| Canceled | Canceled | Canceled before arrival |
| Any state with a retry marker | Its state plus "Will retry" | Its state plus "Will retry" |

## Appendix D — Defects from the 27 October prototype review

Found by code review (27 October) and confirmed in the browser where noted. Each becomes a regression test in the new prototype.

| # | Defect in the 27 October prototype | Confirmed in browser | New rule or check |
| --- | --- | --- | --- |
| D1 | "Try connection again" after a session ends sends offline photos without both phones approving recovery | Yes | R7 |
| D2 | Reloading on a non-camera screen drops the owner lock; "Back to photos" opens the gallery without unlocking | Yes | R4 |
| D3 | A new session opens with an earlier session's photo as the last shot and its photos counted as sending | Yes | R3, scenario purity |
| D4 | Background/relaunch shows the owner lock while the session's capture state stays live, so capture can resume after unlock without a new session | Code | R4, R6 |
| D5 | A late save timer can mark a different photo as saved | Code | R5 |
| D6 | Consent approvals survive going Back and are reused for a new attempt | Code | R2 |
| D7 | Alex's phone shows thumbnails of every session photo and whether Sarah saved each one | Yes | R3 |
| D8 | Confirmation panels open with focus on the consequential action | Yes | 7.7 accessibility |
| D9 | An uncertain export is not kept on the photo itself | Code | R5 |
| D10 | Photos queued by Wi-Fi only are counted and announced as sending | Yes | R9 |
| D11 | With Photos access denied, "Save to Photos" shows the first-time prompt instead of the Settings route | Yes | R8 |
| D12 | Panel buttons show no keyboard focus, and closing a panel doesn't return focus | Yes | 7.7 accessibility |
| D13 | Choosing a scenario leaves stale state behind; three scenarios change nothing | Yes | Scenario purity, section 13 |
| D14 | Secondary text, header label and tab labels below AA contrast; text below 13 pt | Yes | 7.1, 7.2, contrast test |
| D15 | A username error hides under the docked button while the keyboard is open | Yes | 9 Username, small-screen tests |
| D16 | "1 photos" plural; fixed "2 photos expire" text while 3 are pending | Yes | 11 writing, plural tests |
| D17 | The empty Blocked list promises blocking from Report, which had no block option | Yes | 9 Report |
| D18 | Reviewer notes leaked into app copy ("This differs from permission denial.") | Yes | Copy review |
| D19 | Invitation's offline state still shows a live countdown | Yes | 9 Invitation |
| D20 | A toast overlaps the shutter | Yes | Toast never covers a primary control |
| D21 | The on-screen keyboard stays visible for about 1.5 s over the next screen | Yes | Keyboard dismisses with navigation |
