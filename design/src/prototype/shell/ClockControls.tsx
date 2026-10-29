import type { WorldEvent } from "@prototype/model/types";
import { clockLabel } from "./layout";

const minute = 60_000;
const hour = 60 * minute;
const jumps = [
  ["+1 min", "Forward 1 minute", minute],
  ["+1 h", "Forward 1 hour", hour],
  ["+12 h", "Forward 12 hours", 12 * hour],
] as const;

/** The shared clock: expiry and countdowns are reached by moving it, not by waiting. */
export function ClockControls({
  clock,
  playing,
  setPlaying,
  dispatch,
}: {
  clock: number;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  dispatch: (event: WorldEvent) => void;
}) {
  return (
    <div className="proto-clock" role="group" aria-label="Clock">
      <button type="button" className="proto-button" onClick={() => setPlaying(!playing)}>
        {playing ? "Pause" : "Play"}
      </button>
      <span className="proto-clock__time">{clockLabel(clock)}</span>
      {jumps.map(([label, name, ms]) => (
        <button
          key={label}
          type="button"
          className="proto-button proto-button--quiet"
          aria-label={name}
          onClick={() => dispatch({ type: "tick", ms })}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
