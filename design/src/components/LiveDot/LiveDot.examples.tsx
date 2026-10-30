import type { Example } from "@workspace/types";
import { LiveDot } from "./LiveDot";

export const examples: Example[] = [
  {
    id: "breathing",
    title: "Breathing, 10 pt",
    state: "breathing",
    layout: "compact",
    render: () => <LiveDot />,
  },
  {
    id: "in-label",
    title: "Inside a status label, 8 pt",
    state: "breathing",
    layout: "compact",
    render: () => <LiveDot size="inLabel" />,
  },
  {
    id: "steady",
    title: "Steady with Reduce Motion",
    state: "steady (reduce motion)",
    layout: "compact",
    render: () => (
      <span data-reduce-motion="true">
        <LiveDot />
      </span>
    ),
  },
];
