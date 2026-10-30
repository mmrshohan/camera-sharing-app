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
        {/* Both words hold their place, so the button keeps its width as one replaces the other. */}
        <span className="proto-swap">
          {(["Play", "Pause"] as const).map((word) => (
            <span
              key={word}
              className={(word === "Pause") === playing ? undefined : "proto-swap__hidden"}
            >
              {word}
            </span>
          ))}
        </span>
      </button>
      <span className="proto-clock__time">{clockLabel(clock)}</span>
      {/* Named by what they show; the longer words are a hint on hover. */}
      {jumps.map(([label, hint, ms]) => (
        <button
          key={label}
          type="button"
          className="proto-button proto-button--quiet"
          title={hint}
          onClick={() => dispatch({ type: "tick", ms })}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
