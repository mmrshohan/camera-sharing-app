import { useEffect, useRef } from "react";
import { Icon } from "@components/Icon";
import { useShouldReduceMotion, useSurface } from "@shared/surface";
import { tokens } from "@tokens";
import "./DestinationPill.css";

export interface DestinationPillProps {
  /** Who the photos go to, e.g. "Sarah". */
  name: string;
  onPress: () => void;
  /** Change it after each capture to pulse the pill. */
  pulseKey: number;
}

const { motion: m } = tokens;

/** "Sending to Sarah", over the camera. It pulses once after each photo. */
export function DestinationPill({ name, onPress, pulseKey }: DestinationPillProps) {
  const { platform } = useSurface();
  const reduceMotion = useShouldReduceMotion();
  const pill = useRef<HTMLSpanElement>(null);
  const lastKey = useRef(pulseKey);

  useEffect(() => {
    // Only a new key pulses: not the first render, and not React's second run in development.
    if (lastKey.current === pulseKey) return;
    lastKey.current = pulseKey;
    // The browser's own animation API: motion's useAnimate logs a development warning whenever
    // the system's Reduce Motion is on, even when we handle it ourselves.
    const keyframes = reduceMotion
      ? [{ opacity: 1 }, { opacity: m.dim }, { opacity: 1 }]
      : [{ scale: "1" }, { scale: String(m.pulse.scale) }, { scale: "1" }];
    pill.current?.animate(keyframes, { duration: m.pulse.ms, easing: "ease-in-out" });
  }, [pulseKey, reduceMotion]);

  return (
    // Camera controls keep the default text size, as the system camera's do.
    <button
      type="button"
      className="destination-pill"
      onClick={onPress}
      data-platform={platform}
      data-text-size="default"
    >
      <span ref={pill} className="destination-pill__pill">
        <Icon name="sending" size={tokens.shape.iconChip} platform={platform} />
        <span>Sending to {name}</span>
      </span>
    </button>
  );
}
