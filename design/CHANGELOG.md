# Changelog

Releases of the Camera Sharing design system. The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/). The first Library release will be 1.0.0. Add new entries at the top of their section.

## [Unreleased]

### Fixed

- HomeIndicator 1.0.1: Android's three buttons sit on a dark scrim over photos and the camera, like the status bar.

### Added

- Group 4 approved by the owner on 29 October 2026; its ten components are in the Library at 1.0.0.
- PhotoTile 1.0.0: square, never rounded, its state in the corner; a new photo develops once on arrival.
- PhotoGrid 1.0.0: three across, 2 pt apart, edge to edge, by session and day.
- PhotoViewer 1.0.0: one photo, large, on a dark surround, with where it is and what to do next.
- DeviceFrame 1.0.0: four phones at true size; the keyboard follows focus and goes down with its screen (D21).
- StatusBar 1.0.0: 9:41, drawn the way each platform draws it.
- HomeIndicator 1.0.0: iOS's home indicator, Android's gesture handle or three buttons.
- Keyboard 1.0.0: a picture of each platform's keyboard, for checking screens with it up.
- PermissionPrompt 1.0.0: the system's permission prompts in each platform's own words; focus starts on the refusal.
- LiveActivity 1.0.0: Sarah's Lock Screen and Dynamic Island count arriving photos on iOS.
- ProgressNotification 1.0.0: Android's ongoing notification, with a bar only while progress is real.
- With Reduce Motion or on a phone under 4 GB of memory, new photos fade in instead of developing.
- New `system.platterRadius` token for notification surfaces.
- Group 3 approved by the owner on 29 October 2026; its sixteen components are in the Library at 1.0.0.
- TopBar 1.0.0: iOS's large-title bar and Material's large top app bar, expanded or collapsed.
- SectionHeader 1.0.0: a section's title with an optional count.
- ListRow 1.0.0: chevron, value, switch and label rows; with a switch, the whole row is the switch.
- GroupedList 1.0.0: iOS's inset grouped list; a plain Material list on Android.
- EmptyState 1.0.0: calm, with at most one way forward.
- Avatar 1.0.0: one or two initials, neutral.
- Panel 1.0.0: the platform sheet; drag down to dismiss unless it needs an answer.
- ConfirmDialog 1.0.0: action sheet or alert on iOS, Material dialog on Android; focus starts on the safe answer.
- PersonPair 1.0.0: who lends and exactly which phone the photos go to.
- VerificationWords 1.0.0: six words, two rows of three.
- InvitationCode 1.0.0: the QR code, with a countdown only while active.
- Viewfinder 1.0.0: scanning, not an invitation, camera access off, camera in use.
- DestinationPill 1.0.0: “Sending to Sarah”, pulsing after each photo.
- ZoomControl 1.0.0: zoom levels written the camera way.
- LastShotWell 1.0.0: the last photo, dropping in after each capture.
- CameraStatusLine 1.0.0: sent, sending and waiting counts in one line.
- Shared plural rules: “1 photo”, and photos waiting for Wi-Fi are never “sending” (D10, D16).
- The Guideline's Motion section has a live panel and a live send demo.
- Group 2 approved by the owner on 29 October 2026; its nine components are in the Library at 1.0.0.
- Button 1.0.0: filled and tinted capsules, plain and destructive text buttons; disabled and loading.
- IconButton 1.0.0: a full platform touch target, on the app's surfaces or over the camera.
- Toggle 1.0.0: UISwitch on iOS, the Material 3 switch on Android.
- TextField 1.0.0: the brand field on iOS, Material's outlined field on Android; checking, valid and invalid.
- ChoiceChips 1.0.0: one choice, with a checkmark, on both platforms.
- StatusLabel 1.0.0: live, sending, saved, waiting and neutral.
- Numeral 1.0.0: the big live count with the screen's one live dot.
- InlineMessage 1.0.0: neutral, waiting and problem, with one optional action.
- Toast 1.0.0: at the top or above the controls; never covers one.
- The Guideline's status labels are the real component, and a new section shows the numeral.
- Tokens: a `system` group of per-platform metrics (fields, chips, switches), `fill` and `shadow` colors, and icon sizes for rows, bars and chips.
- Group 1 approved by the owner on 29 October 2026; its six components are in the Library at 1.0.0.
- Icon 1.0.0: 30 standard icons, with SF Symbol names for iOS and Material Symbols Rounded for Android.
- Text 1.0.0: ten type styles and four tones from the tokens.
- LiveDot 1.0.0: breathing, and steady with Reduce Motion.
- ProgressRing 1.0.0: real progress only; it never looks complete early.
- RingButton 1.0.0: filled and tinted; rest, pressed, waiting and unavailable.
- Shutter 1.0.0: ready, pressed, preparing and blocked.
- Old Lab links to promoted components open in the Library, with their preview settings.
- The Guideline's ring section: anatomy drawn from the tokens, the family and the states.
- Tokens: `onCamera` white for controls over the preview, the ring's 9 pt label gap, the waiting arc and one dim level.
- `track` color for the progress ring: ink at 10%.
- States gallery puts small components side by side, centered on their stage.
- Overview with the design-system version, components by status and the latest changes; this changelog; and "where used" on every component page, read from the prototype's imports.
- Living Guideline: color with live WCAG 2.2 contrast in both themes, status labels, iOS and Android type, space, shape, the 30 standard icons, platform rules, motion, writing and accessibility, all read from the tokens.
- `onAccent` color for text and icons on the accent.
- Library and Lab pages, with preview controls for platform, theme, text size and Reduce Motion.
- Design tokens in the W3C format, generated to CSS variables and typed TypeScript, with contrast tests in both themes.
- Workspace at 127.0.0.1:4300 with Overview, Guideline, Library, Lab, Prototype and Changelog.
