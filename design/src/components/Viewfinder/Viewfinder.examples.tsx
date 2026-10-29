import type { Example } from "@workspace/types";
import { Viewfinder, type ViewfinderState } from "./Viewfinder";

const states: [ViewfinderState, string][] = [
  ["scanning", "Scanning"],
  ["invalid", "Not an invitation"],
  ["denied", "Camera access off"],
  ["unavailable", "Camera in use elsewhere"],
];

export const examples: Example[] = states.map(([state, title]) => ({
  id: state,
  title,
  state,
  layout: "compact",
  render: () => (
    <div className="ex-viewfinder">
      <Viewfinder state={state} />
    </div>
  ),
}));
