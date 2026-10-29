import type { Example } from "@workspace/types";
import { LiveActivity, type LiveActivityProps } from "./LiveActivity";

type Counts = Omit<LiveActivityProps, "variant" | "from">;

// Sarah's Lock Screen, with a photo as the wallpaper.
const lock = (counts: Counts) => (
  <div className="ex-lock">
    <LiveActivity variant="lockScreen" from="Alex" {...counts} />
  </div>
);

// The top of Sarah's screen, the island where the hardware puts it.
const island = (counts: Counts) => (
  <div className="ex-island">
    <LiveActivity variant="island" from="Alex" {...counts} />
  </div>
);

export const examples: Example[] = [
  {
    id: "connected",
    title: "Connected, nothing yet",
    state: "connected",
    render: () => lock({ received: 0, arriving: 0, state: "connected" }),
  },
  {
    id: "arriving",
    title: "Photos arriving",
    state: "arriving",
    render: () => lock({ received: 14, arriving: 2, state: "arriving" }),
  },
  {
    id: "done",
    title: "All arrived",
    state: "done",
    render: () => lock({ received: 16, arriving: 0, state: "done" }),
  },
  {
    id: "island",
    title: "Dynamic Island, arriving",
    state: "Dynamic Island",
    render: () => island({ received: 14, arriving: 2, state: "arriving" }),
  },
  {
    id: "island-done",
    title: "Dynamic Island, all arrived",
    state: "Dynamic Island",
    render: () => island({ received: 16, arriving: 0, state: "done" }),
  },
];
