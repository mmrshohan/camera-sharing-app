import { tokens } from "@tokens";
import "./ProgressRing.css";

export interface ProgressRingProps {
  /** Real progress from 0 to 1. There is no spinning state: without progress, show no ring. */
  value: number;
  /** What is progressing, e.g. "Photo 3 of 12". */
  label: string;
  /** Diameter in pt/dp; the token size (28) by default. */
  size?: number;
}

/** Only a finished task reads 100, so the ring never looks complete early. */
function percentOf(value: number): number {
  const clamped = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
  return clamped >= 1 ? 100 : Math.min(99, Math.round(clamped * 100));
}

export function ProgressRing({
  value,
  label,
  size = tokens.shape.progressRingSize,
}: ProgressRingProps) {
  const percent = percentOf(value);
  const center = size / 2;
  const radius = (size - tokens.shape.progressRingStroke) / 2;
  return (
    <span
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="progress-ring"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="progress-ring__track" cx={center} cy={center} r={radius} />
        {percent > 0 && (
          <circle
            className="progress-ring__arc"
            cx={center}
            cy={center}
            r={radius}
            pathLength={100}
            strokeDasharray={`${percent} 100`}
            transform={`rotate(-90 ${center} ${center})`}
          />
        )}
      </svg>
    </span>
  );
}
