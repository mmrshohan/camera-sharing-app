import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import { motion } from "motion/react";
import { Icon } from "@components/Icon";
import type { IconName } from "@icons";
import { useShouldReduceMotion, useSurface } from "@shared/surface";
import { springToMotion, tokens } from "@tokens";
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
const quick = { duration: m.pressDownMs / 1000, ease: "easeOut" } as const;
const fade = { duration: m.fadeMs / 1000 } as const;
const spring = springToMotion(m.spring.press);
const arcRadius = (shape.ringSize - shape.ringStroke) / 2;

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
  const [pressed, setPressed] = useState(false);
  const atRest = state === "rest";
  const down = pressed && atRest;
  const reason = state === "unavailable" ? unavailableReason : undefined;

  const release = () => setPressed(false);
  const onPointerDown = (event: PointerEvent) => {
    if (atRest && event.button === 0) setPressed(true);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (atRest && !event.repeat && (event.key === " " || event.key === "Enter")) setPressed(true);
  };

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
      onPointerDown={onPointerDown}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onKeyDown={onKeyDown}
      onKeyUp={release}
      onBlur={release}
    >
      <span className="ring-button__ring" aria-hidden="true">
        {state === "waiting" && (
          <svg
            className="ring-button__arc"
            viewBox={`0 0 ${shape.ringSize} ${shape.ringSize}`}
            focusable="false"
          >
            <circle
              cx={shape.ringSize / 2}
              cy={shape.ringSize / 2}
              r={arcRadius}
              pathLength={100}
              strokeDasharray={`${m.waiting.arc * 100} 100`}
            />
          </svg>
        )}
        <motion.span
          className="ring-button__disc"
          initial={false}
          animate={{
            scale: down && !reduceMotion ? m.pressScale.ring : 1,
            opacity: down && reduceMotion ? m.dim : 1,
          }}
          transition={{ scale: down ? quick : spring, opacity: down ? quick : fade }}
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
