// How every pressable control in the app responds to touch, mouse and keyboard.
import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { springToMotion, tokens } from "@tokens";

const { motion: m } = tokens;
const quick = { duration: m.pressDownMs / 1000, ease: "easeOut" } as const;
const fade = { duration: m.fadeMs / 1000 } as const;
const spring = springToMotion(m.spring.press);

export interface PressHandlers {
  onPointerDown: (event: PointerEvent) => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
  onPointerCancel: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onKeyUp: () => void;
  onBlur: () => void;
}

/** Tracks a press from pointer or keyboard. Controls still act in onClick, on release. */
export function usePress(enabled: boolean): { down: boolean; handlers: PressHandlers } {
  const [pressed, setPressed] = useState(false);
  const release = () => setPressed(false);
  return {
    down: pressed && enabled,
    handlers: {
      onPointerDown: (event) => {
        if (enabled && event.button === 0) setPressed(true);
      },
      onPointerUp: release,
      onPointerLeave: release,
      onPointerCancel: release,
      onKeyDown: (event) => {
        if (enabled && !event.repeat && (event.key === " " || event.key === "Enter")) {
          setPressed(true);
        }
      },
      onKeyUp: release,
      onBlur: release,
    },
  };
}

/**
 * A pressed surface scales down (or dims, with Reduce Motion), then springs back.
 * `opacity` is the resting opacity, for surfaces that are dimmed or hidden by state.
 */
export function pressMotion(down: boolean, reduceMotion: boolean, scale: number, opacity = 1) {
  return {
    animate: {
      scale: down && !reduceMotion ? scale : 1,
      opacity: down && reduceMotion ? m.dim : opacity,
    },
    transition: { scale: down ? quick : spring, opacity: down ? quick : fade },
  };
}
