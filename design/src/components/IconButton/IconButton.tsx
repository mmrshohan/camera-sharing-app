import { motion } from "motion/react";
import { Icon } from "@components/Icon";
import type { IconName } from "@icons";
import { pressMotion, usePress } from "@shared/press";
import { useShouldReduceMotion, useSurface } from "@shared/surface";
import { tokens } from "@tokens";
import "./IconButton.css";

export interface IconButtonProps {
  icon: IconName;
  /** The accessible name; the button shows no words. */
  label: string;
  onPress?: () => void;
  /** onLight for the app's own surfaces; onCamera for controls over the live preview. */
  tone?: "onLight" | "onCamera";
}

/** An icon with a full touch target: 44 pt on iOS, 48 dp on Android. */
export function IconButton({ icon, label, onPress, tone = "onLight" }: IconButtonProps) {
  const { platform } = useSurface();
  const reduceMotion = useShouldReduceMotion();
  const { down, handlers } = usePress(true);
  const { animate, transition } = pressMotion(down, reduceMotion, tokens.motion.pressScale.button);
  return (
    <button
      type="button"
      className={`icon-button icon-button--${tone === "onCamera" ? "on-camera" : "on-light"}`}
      aria-label={label}
      onClick={() => onPress?.()}
      {...handlers}
    >
      <motion.span
        className="icon-button__glyph"
        initial={false}
        animate={animate}
        transition={transition}
      >
        <Icon name={icon} size={tokens.shape.iconBar} platform={platform} />
      </motion.span>
    </button>
  );
}
