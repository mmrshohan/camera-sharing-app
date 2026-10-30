import type { ReactNode } from "react";
import { motion } from "motion/react";
import { pressMotion, usePress } from "@shared/press";
import { useShouldReduceMotion } from "@shared/surface";
import { WaitingArc } from "@shared/WaitingArc";
import { tokens } from "@tokens";
import "./Button.css";

export type ButtonVariant = "filled" | "tinted" | "plain" | "destructive";

export interface ButtonProps {
  variant: ButtonVariant;
  children: ReactNode;
  onPress?: () => void;
  /** Shown but not pressable. It stays focusable, so its words can still be read. */
  disabled?: boolean;
  /** Working on it: busy, ignores presses and keeps its width. */
  loading?: boolean;
  fullWidth?: boolean;
}

/** Capsules for decisions (filled, tinted); text buttons for lesser actions (plain, destructive). */
export function Button({
  variant,
  children,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const reduceMotion = useShouldReduceMotion();
  const active = !disabled && !loading;
  const { down, handlers } = usePress(active);
  const { animate, transition } = pressMotion(down, reduceMotion, tokens.motion.pressScale.button);
  const classes = ["button", `button--${variant}`, fullWidth && "button--full"]
    .filter(Boolean)
    .join(" ");
  return (
    <motion.button
      type="button"
      className={classes}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (active) onPress?.();
      }}
      {...handlers}
      initial={false}
      animate={animate}
      transition={transition}
    >
      <span className="button__label">{children}</span>
      {loading && (
        <span className="button__spinner" aria-hidden="true">
          <WaitingArc size={tokens.shape.iconRow} stroke={tokens.shape.progressRingStroke} />
        </span>
      )}
    </motion.button>
  );
}
