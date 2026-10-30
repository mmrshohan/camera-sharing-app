import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useShouldReduceMotion } from "@shared/surface";
import type { SampleImage } from "@shared/types";
import { springToMotion, tokens } from "@tokens";
import "./LastShotWell.css";

export interface LastShotWellProps {
  image: SampleImage | null;
  onOpen: () => void;
  /** Change it after each capture: the new photo drops into the well. */
  dropKey: number;
}

const { motion: m } = tokens;
const drop = springToMotion(m.spring.drop);
const fade = { duration: m.fadeMs / 1000 };

/** The last photo, beside the shutter. A new one drops in on spring.drop. */
export function LastShotWell({ image, onOpen, dropKey }: LastShotWellProps) {
  const reduceMotion = useShouldReduceMotion();
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
  }, []);

  if (!image) return <span className="last-shot-well last-shot-well--empty" aria-hidden="true" />;

  // Coming back to the camera shows the last photo in place; only a new capture drops in.
  const from = !mounted.current
    ? false
    : reduceMotion
      ? { opacity: 0 }
      : { scale: 1.5, y: -24, opacity: 0 };
  return (
    <button
      type="button"
      className="last-shot-well"
      aria-label="Open the last photo"
      onClick={onOpen}
    >
      <motion.span
        key={dropKey}
        className="last-shot-well__image"
        style={{
          backgroundImage: `url("${image.src}")`,
          backgroundPosition: image.position,
          backgroundSize: `${image.zoom * 100}%`,
        }}
        initial={from}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={reduceMotion ? fade : drop}
      />
    </button>
  );
}
