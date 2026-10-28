import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import { motion } from "motion/react";
import { useShouldReduceMotion } from "@shared/surface";
import { springToMotion, tokens } from "@tokens";
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
const quick = { duration: m.pressDownMs / 1000, ease: "easeOut" } as const;
const fade = { duration: m.fadeMs / 1000 } as const;
const spring = springToMotion(m.spring.press);
const names: Record<ShutterState, string> = {
  ready: "Take photo",
  preparing: "Preparing photo",
  blocked: "Take photo",
};

/** Takes the photo. White, because color belongs to the photo. */
export function Shutter({ state, onCapture, message }: ShutterProps) {
  const reduceMotion = useShouldReduceMotion();
  const messageId = useId();
  const [pressed, setPressed] = useState(false);
  const blocked = state === "blocked";
  const down = pressed && !blocked;
  const dimmed = state === "preparing" || (down && reduceMotion);

  const release = () => setPressed(false);
  const onPointerDown = (event: PointerEvent) => {
    if (!blocked && event.button === 0) setPressed(true);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (!blocked && !event.repeat && (event.key === " " || event.key === "Enter")) setPressed(true);
  };

  return (
    <button
      type="button"
      className={`shutter shutter--${state}`}
      aria-label={names[state]}
      aria-busy={state === "preparing" || undefined}
      aria-disabled={blocked || undefined}
      aria-describedby={blocked && message ? messageId : undefined}
      onClick={() => {
        if (!blocked) onCapture();
      }}
      onPointerDown={onPointerDown}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onKeyDown={onKeyDown}
      onKeyUp={release}
      onBlur={release}
    >
      <motion.span
        className="shutter__disc"
        aria-hidden="true"
        initial={false}
        animate={{
          scale: down && !reduceMotion ? m.pressScale.ring : 1,
          opacity: blocked ? 0 : dimmed ? m.dim : 1,
        }}
        transition={{ scale: down ? quick : spring, opacity: down ? quick : fade }}
      />
      {blocked && message && (
        <span id={messageId} className="shutter__message">
          {message}
        </span>
      )}
    </button>
  );
}
