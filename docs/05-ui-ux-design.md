# 05 — UI/UX Design Specification

Status: written design direction only; no mockups or UI implementation. Date: 27 October 2026.

## Direction and information architecture

A quiet camera with an unmistakable destination. Photography occupies the visual field; consent and transfer status remain legible. Quality comes from clear hierarchy, stable controls, truthful feedback and careful native behavior. “Award-caliber” is an aspiration, not a verifiable requirement or a reason to invent navigation.

Three primary destinations: **Camera**, **Gallery**, **Profile & Settings**. Use familiar native navigation patterns and back behavior on each platform while preserving identical product semantics. Camera is the default after setup. Pairing, approval, active-session detail and transfer recovery appear as sheets or contextual panels; they are not new top-level tabs. Profile and Settings may share one destination; avoid a separate social profile.

## Camera

Top region: safe-area-aligned session status with recipient handle and an explicit end action. Before pairing: “Whose photos are these?” with Receive and Lend actions; explain which phone will take photos. During a session: “Sending to @sarah” plus connectivity/expiry status. Use a distinct persistent state for unpaired camera; borrowed captures require an active recipient session, avoiding accidental personal-photo routing.

Center: unobstructed live preview; tap focus and exposure adjustment; restrained grid only if enabled. Lens selectors show only tested available choices. Never label digital crops as physical lenses. Flash control is present only when usable.

Bottom: large, stable shutter target; camera flip; a temporary last-shot review control. No host gallery browsing or export. Show “Preparing…” until bytes and journal are durable, then “Queued” or a compact transfer count. A network issue does not replace the preview with a blocking modal; storage exhaustion does block further capture with a clear recovery action.

When handed the phone, the photographer can always identify the recipient. No hidden gesture changes destination. Switching recipient requires ending the old session and confirming a new one. Backgrounding hides review and clears decrypted UI state; foregrounding revalidates the lease before review/capture.

## Pairing and consent

Receive opens Sarah's QR and exact username. Lend opens Alex's scanner and a compact username alternative. A sheet confirms “Alex's camera → Sarah's photos,” both handles, the intended recipient device, the verification code and a short privacy statement. Host action: “Allow camera session.” Recipient action: “Receive on this phone.” The shutter is enabled only after both approve.

Permission prompts follow a single explanation and genuine action: camera for capture/scanning; add-to-library for saving received photos; optional notifications for readiness. Avoid asking for microphone, contacts, GPS or broad photo access. Denial leads to a useful state and a Settings link when the OS will not prompt again. Do not trap users in repeated prompts.

Initial session sheet explains: host preview is visible and screenshots are possible; the app does not save to the host's photo library; pending media expires; background receiving can require reopening. These facts should be concise and available later in session detail, not a legal wall covering every camera entry.

## Recipient gallery

Show only photos received by this app, grouped by capture session/date. Thumbnails stay stable as save status changes. Each photo has one accessible state: Receiving, Received, Saving to Photos, Saved to Photos, Action needed, Canceled or Expired. A photo can be Received while its library export is blocked. Aggregate status is supplementary; item-level failures remain discoverable.

Use a single-photo viewer with native zoom and an explicit export/retry action. No automatic sharing, social actions or editing in MVP. Deleting from app gallery explains that the system-library copy remains; deleting from the system library is left to the user. Gallery is an encrypted local collection, not a permanent cloud backup. Explain that app-only photos can be lost on uninstall or key loss.

If the OS-save result is ambiguous after interruption and cannot be reconciled, say “Received; Photos save needs checking.” Offer to open Photos and an explicit “Save another copy” action with duplicate warning. Do not silently retry a possibly completed export.

## Profile & Settings

Show username, sign-in connections, registered devices/revocation, save-to-library preference/status, privacy/retention explanation, blocked accounts, help/report, privacy policy and account deletion. Default auto-save on, contingent on permission; no separate transfer-speed or cryptographic settings. Cellular transfer is allowed after clear onboarding disclosure; optional Wi-Fi-only policy must be visible in queued-photo status. Account deletion includes the external deletion request link and explains saved library copies.

## Visual system

| Element | Proposed specification |
| --- | --- |
| Typography | System San Francisco on iOS and system Roboto on Android; native text scaling. Body 17 pt iOS /16 sp Android, supporting text ≥13 pt/14 sp, primary headings 24–28. Avoid all-caps instructional text |
| Spacing | 4-unit base; 8 within tight groups, 16 between related controls, 24 between sections, 16–20 horizontal safe content margins. Respect camera cutouts and system bars |
| Palette | Near-black #0B0D10 camera chrome, white #F7F8FA text; light surfaces #FFFFFF with #15171A text. Proposed accent #3B5BDB on light surfaces and #A5B4FC on dark; warning/error colors paired with text/icon |
| Hierarchy | Photograph → shutter → recipient → exceptional transfer action. Use one primary action per sheet; keep destructive actions apart from the shutter |
| Iconography | SF Symbols on iOS and Material Symbols on Android, matched meaning and stroke weight. Label unfamiliar icons; no decorative camera mascots or badges |
| Surfaces | Opaque/translucent scrims only when they preserve contrast across arbitrary preview content. No reliance on glass blur for legibility |
| Targets | At least 44×44 pt iOS and 48×48 dp Android; shutter target approximately 72–80 units, subject to small-screen tests |

These are proposed tokens, not verified contrast results. Before implementation sign-off, measure actual foreground/background combinations against WCAG AA text contrast (4.5:1 ordinary text, 3:1 large text) and 3:1 essential UI boundaries. Test camera scrims against bright, dark and patterned live imagery.

## Motion, sound and haptics

Immediate shutter feedback; no animation blocks capture or masks processing. Sheets and status transitions use native-feeling easing, typically 160–240 ms; status counts update without moving the shutter. Haptic on accepted shutter, verified pairing and blocking error, not every upload progress tick. Respect system settings and Reduce Motion; replace spatial motion with a short crossfade. Do not promise a silent shutter—OS/regional camera behavior may apply. No custom sound required for success.

## Accessibility and localization

VoiceOver/TalkBack announces role, destination, focus/exposure values, current lens and capture result. Coalesce transfer announcements; avoid reading every percent. Preserve logical focus when sheets open/close and when an error appears. Pairing works without visually scanning QR through exact username and accessible verification-code reading. Test switch access, external keyboard where applicable, large text up to the largest accessibility sizes, increased contrast, reduced motion and color-vision simulations. No meaning conveyed only by color, gesture, sound or haptic.

Keep primary controls reachable in one hand without compromising left-handed use. Test compact screens and landscape; large type may move secondary controls into a sheet without hiding the destination. Externalize strings, allow text expansion, localize dates/units and support RTL layout; handles/verification codes require deliberate bidirectional-text handling. Recommend English and Bangla launch copy only after audience confirmation, not as an assumed requirement.

## State and copy inventory

| State | Visible message/action |
| --- | --- |
| No session | “Use another camera, or lend yours.” Receive / Lend |
| Waiting for approval | Other person's handle, expiry, Cancel; no indefinite spinner |
| Wrong verification code | “These phones don't match. Start again.” No bypass disguised as Continue |
| Camera denied/unavailable | Explanation, Settings or Retry; distinguish permission from hardware interruption |
| Processing | “Preparing photo…”; accepted capture cannot disappear silently |
| Offline | “3 photos waiting for internet.” Keep queue accessible |
| Uploaded, recipient unavailable | “Ready for Sarah to receive.” Show expiry in detail |
| Photos permission denied | “Received in the app. Allow Photos access to save automatically.” |
| Storage full | “Free space to keep receiving.” Existing photos remain; Retry after space is available |
| Session ended | “Session ended. 3 photos are still sending.” No implication they were canceled |
| Expiry approaching | “2 photos expire in 12 hours. Open the receiving phone.” Honest clock basis |
| Expired/canceled | Explain loss/cancellation and no retry once the last recoverable copy is gone |
| Empty gallery | “Photos you receive will appear here.” Receive action |
| Slow request | Keep prior content visible, show progress, allow safe cancellation or retry |

## Usability acceptance

Use [01](01-product-requirements.md) pairing/comprehension targets. Also require complete capture/receive/retry/session-end flows using VoiceOver and TalkBack without assistance; no clipped essential text at maximum accessibility sizes; all controls reachable at minimum targets; no repeated notification/permission nagging; no destination ambiguity in handoff tests. Review motion on physical low-end devices and conduct a final accessibility audit. No mockups were created in this planning phase.
