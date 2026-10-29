import { motion } from "motion/react";
import { pressMotion, usePress } from "@shared/press";
import { useShouldReduceMotion } from "@shared/surface";
import { tokens } from "@tokens";
import "./SignInButton.css";

export type SignInProvider = "apple" | "google";
export type SignInAction = "continue" | "signIn" | "signUp";

export interface SignInButtonProps {
  provider: SignInProvider;
  action: SignInAction;
  onPress?: () => void;
  /** Shown but not pressable, such as while offline. It stays focusable, so its words can still be read. */
  disabled?: boolean;
  fullWidth?: boolean;
}

const verbs: Record<SignInAction, string> = {
  continue: "Continue",
  signIn: "Sign in",
  signUp: "Sign up",
};

/** U+F8FF: the Apple logo in Apple's own system fonts, so no artwork is stored here. */
const appleLogo = String.fromCodePoint(0xf8ff);

/** The only titles Apple's and Google's rules allow: "Continue with Apple", "Sign in with Google"… */
export function signInTitle(provider: SignInProvider, action: SignInAction): string {
  return `${verbs[action]} with ${provider === "apple" ? "Apple" : "Google"}`;
}

/** Sign in with Apple or Google, in each brand's colors and words, at the size of our buttons. */
export function SignInButton({
  provider,
  action,
  onPress,
  disabled = false,
  fullWidth = false,
}: SignInButtonProps) {
  const reduceMotion = useShouldReduceMotion();
  const { down, handlers } = usePress(!disabled);
  const { animate, transition } = pressMotion(
    down,
    reduceMotion,
    tokens.motion.pressScale.button,
    disabled ? tokens.motion.dim : 1,
  );
  const classes = [
    "sign-in-button",
    `sign-in-button--${provider}`,
    fullWidth && "sign-in-button--full",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <motion.button
      type="button"
      className={classes}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (!disabled) onPress?.();
      }}
      {...handlers}
      initial={false}
      animate={animate}
      transition={transition}
    >
      {/* No logo artwork lives in this public repository (owner, 30 October 2026). */}
      {provider === "apple" ? (
        // Shows on Apple devices only, where the font has it.
        <span className="sign-in-button__mark sign-in-button__mark--apple" aria-hidden="true">
          {appleLogo}
        </span>
      ) : (
        // A marked place for Google's G, which the native app takes from Google's branding kit.
        <span
          className="sign-in-button__mark sign-in-button__mark--placeholder"
          aria-hidden="true"
        />
      )}
      <span className="sign-in-button__title">{signInTitle(provider, action)}</span>
    </motion.button>
  );
}
