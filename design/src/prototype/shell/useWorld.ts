import { useCallback, useEffect, useState } from "react";
import type { DeviceId, World, WorldEvent } from "@prototype/model/types";
import { reduce } from "@prototype/model/world";

interface State {
  initial: World;
  world: World;
  /** The last event from each phone that the world includes. */
  applied: Record<DeviceId, number>;
}

/**
 * The world both phones share. A new `initial` (another scenario) replaces it; Reset re-applies
 * it. While playing, the clock moves 100 ms every 100 ms.
 */
export function useWorld(initial: World, options: { playing?: boolean } = {}) {
  const [state, setState] = useState<State>(() => ({
    initial,
    world: initial,
    applied: { alex: 0, sarah: 0 },
  }));
  if (state.initial !== initial) setState((s) => ({ ...s, initial, world: initial }));
  const current = state.initial === initial ? state : { ...state, initial, world: initial };

  const dispatch = useCallback((event: WorldEvent) => {
    setState((s) => ({ ...s, world: reduce(s.world, event) }));
  }, []);

  /** An event from a phone, applied together with the record that it has been. */
  const dispatchFrom = useCallback((id: DeviceId, seq: number, event: WorldEvent) => {
    setState((s) => ({
      ...s,
      world: reduce(s.world, event),
      applied: { ...s.applied, [id]: seq },
    }));
  }, []);

  const reset = useCallback(() => setState((s) => ({ ...s, world: s.initial })), []);

  const [playing, setPlaying] = useState(options.playing ?? true);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => dispatch({ type: "tick", ms: 100 }), 100);
    return () => window.clearInterval(timer);
  }, [playing, dispatch]);

  return {
    world: current.world,
    applied: current.applied,
    dispatch,
    dispatchFrom,
    reset,
    playing,
    setPlaying,
  };
}
