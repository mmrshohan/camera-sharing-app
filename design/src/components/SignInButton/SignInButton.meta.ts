import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "sign-in-button",
  name: "SignInButton",
  group: 5,
  layer: "system",
  status: "final",
  version: "1.0.0",
  summary:
    "Sign in with Apple and Google, in each brand's own colors and words, at the height and in the capsule of our buttons.",
  anatomy: [
    "A capsule as tall as our buttons, with the mark and the title centered; Apple's and Google's are the same size, so neither is less prominent",
    "Apple: black on light screens, white on dark, the Apple logo before the title (Apple HIG)",
    "Google: white with a gray 1 px stroke on light screens, near-black with a lighter stroke on dark, the G before the title (Google's branding guidelines)",
    "Titles are fixed by the brands: Continue, Sign in or Sign up with Apple or Google",
    "No logo artwork is stored in this public repository (owner, 30 October 2026): Apple's logo is a character of Apple's system font, so it shows on Apple devices only, and Google's G is a dashed placeholder",
    "The title uses our headline type here; natively Apple's system button sizes its own title, and Google's is Google Sans Medium",
  ],
  tokens: [
    "color.signInAppleFill",
    "color.signInAppleInk",
    "color.signInGoogleFill",
    "color.signInGoogleStroke",
    "color.signInGoogleInk",
    "color.accent",
    "shape.buttonHeight",
    "shape.iconChip",
    "type.headline",
    "motion.pressScale",
    "motion.dim",
  ],
  states: ["apple", "google", "unavailable", "pair"],
  accessibility: [
    "A button named by its title, such as “Continue with Apple”; the mark is hidden from screen readers",
    "Unavailable buttons stay focusable with aria-disabled, so their words can still be read",
    "Titles pass 4.5:1 on their fills, and each button's edge passes 3:1 on the screen, in both themes (tested pairs)",
    "A visible focus ring, as on every button",
  ],
  motion: [
    "Pressed: scales to motion.pressScale.button, as Button does; with Reduce Motion it dims instead",
    "Unavailable: dimmed to motion.dim",
  ],
  native: {
    ios: "Apple: ASAuthorizationAppleIDButton(authorizationButtonType: .continue, authorizationButtonStyle: .black, or .white in dark), cornerRadius = height / 2. It draws Apple's logo, localizes its title and labels itself for VoiceOver. Google: the GoogleSignIn SDK, behind a button built to Google's branding guidelines with the official G from Google's branding kit",
    android:
      "Google: Credential Manager with GetSignInWithGoogleOption, behind a button built to Google's branding guidelines with the official G from Google's branding kit. Apple isn't offered on Android",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-30",
      summary:
        "First version: Apple's and Google's sign-in buttons in light and dark, on both platforms.",
    },
  ],
};
