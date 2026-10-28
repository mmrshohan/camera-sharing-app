import { useId } from "react";
import { motion } from "motion/react";
import { Icon } from "@components/Icon";
import type { IconName } from "@icons";
import { pressMotion, usePress } from "@shared/press";
import { useShouldReduceMotion, useSurface } from "@shared/surface";
import { WaitingArc } from "@shared/WaitingArc";
import { tokens } from "@tokens";
import "./RingButton.css";

export type RingState = "rest" | "waiting" | "unavailable";

export interface RingButtonProps {
  variant: "filled" | "tinted";
  icon: IconName;
  /** Shown below the ring; it is also the button's accessible name. */
  label: string;
  state?: RingState;
  /** Shown and announced when unavailable, e.g. "Needs the internet". */
  unavailableReason?: string;
  onPress?: () => void;
}

const { shape, motion: m } = tokens;

/** The signature control, for camera moments. It acts on release, and only at rest. */
export function RingButton({
  variant,
  icon,
  label,
  state = "rest",
  unavailableReason,
  onPress,
}: RingButtonProps) {
  const { platform } = useSurface();
  const reduceMotion = useShouldReduceMotion();
  const reasonId = useId();
  const atRest = state === "rest";
  const { down, handlers } = usePress(atRest);
  const { animate, transition } = pressMotion(down, reduceMotion, m.pressScale.ring);
  const reason = state === "unavailable" ? unavailableReason : undefined;

  return (
    <button
      type="button"
      className={`ring-button ring-button--${variant} ring-button--${state}`}
      aria-busy={state === "waiting" || undefined}
      aria-disabled={state === "unavailable" || undefined}
      aria-describedby={reason ? reasonId : undefined}
      onClick={() => {
        if (atRest) onPress?.();
      }}
      {...handlers}
    >
      <span className="ring-button__ring" aria-hidden="true">
        {state === "waiting" && (
          <WaitingArc
            className="ring-button__arc"
            size={shape.ringSize}
            stroke={shape.ringStroke}
          />
        )}
        <motion.span
          className="ring-button__disc"
          initial={false}
          animate={animate}
          transition={transition}
        >
          <Icon name={icon} filled size={shape.ringIcon} platform={platform} />
        </motion.span>
      </span>
      <span className="ring-button__label">{label}</span>
      {reason && (
        <span id={reasonId} className="ring-button__reason" aria-hidden="true">
          {reason}
        </span>
      )}
    </button>
  );
}
