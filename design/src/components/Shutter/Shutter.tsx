import { motion } from "motion/react";
import { pressMotion, usePress } from "@shared/press";
import { useShouldReduceMotion } from "@shared/surface";
import { tokens } from "@tokens";
import "./Shutter.css";

export type ShutterState = "ready" | "preparing" | "blocked";

export interface ShutterProps {
  state: ShutterState;
  /** Called once per press. The camera model ignores presses while preparing. */
  onCapture: () => void;
  /** Covers the disc when blocked, e.g. "Waiting for internet". A blocked shutter always says why. */
  message?: string;
}

const { motion: m } = tokens;
const names: Record<ShutterState, string> = {
  ready: "Take photo",
  preparing: "Preparing photo",
  blocked: "Take photo",
};

/** Takes the photo. White, because color belongs to the photo. */
export function Shutter({ state, onCapture, message }: ShutterProps) {
  const reduceMotion = useShouldReduceMotion();
  const blocked = state === "blocked";
  const { down, handlers } = usePress(!blocked);
  const resting = blocked ? 0 : state === "preparing" ? m.dim : 1;
  const { animate, transition } = pressMotion(down, reduceMotion, m.pressScale.ring, resting);

  return (
    <button
      type="button"
      className={`shutter shutter--${state}`}
      // A blocked shutter shows its message inside the button, so the name carries it (WCAG 2.5.3).
      aria-label={blocked && message ? `${names.blocked}. ${message}` : names[state]}
      aria-busy={state === "preparing" || undefined}
      aria-disabled={blocked || undefined}
      onClick={() => {
        if (!blocked) onCapture();
      }}
      {...handlers}
    >
      <motion.span
        className="shutter__disc"
        aria-hidden="true"
        initial={false}
        animate={animate}
        transition={transition}
      />
      {blocked && message && <span className="shutter__message">{message}</span>}
    </button>
  );
}
