import { tokens } from "@tokens";
import "./waiting-arc.css";

export interface WaitingArcProps {
  size: number;
  stroke: number;
  className?: string;
}

/** Waiting on someone or something: a quarter arc that turns, and holds still with Reduce Motion. */
export function WaitingArc({ size, stroke, className }: WaitingArcProps) {
  const center = size / 2;
  return (
    <svg
      className={className ? `waiting-arc ${className}` : "waiting-arc"}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx={center}
        cy={center}
        r={(size - stroke) / 2}
        strokeWidth={stroke}
        pathLength={100}
        strokeDasharray={`${tokens.motion.waiting.arc * 100} 100`}
      />
    </svg>
  );
}
