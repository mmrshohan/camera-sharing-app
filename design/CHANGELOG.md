# Changelog

Releases of the Camera Sharing design system. The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/). The first Library release will be 1.0.0. Add new entries at the top of their section.

## [Unreleased]

### Added

- Button, IconButton, Toggle, TextField and ChoiceChips (group 2), in review. Toggle, TextField and ChoiceChips are drawn in each platform's own style.
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
