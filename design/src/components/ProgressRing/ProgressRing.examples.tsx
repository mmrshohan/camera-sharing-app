import type { Example } from "@workspace/types";
import { ProgressRing } from "./ProgressRing";

const steps: [string, number][] = [
  ["0%", 0],
  ["25%", 0.25],
  ["75%", 0.75],
  ["100%", 1],
];

export const examples: Example[] = steps.map(([state, value]) => ({
  id: state.replace("%", ""),
  title: state === "0%" ? "0%, track only" : state,
  state,
  layout: "compact",
  render: () => <ProgressRing value={value} label="Photo arriving" />,
}));
