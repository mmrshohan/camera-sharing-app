import type { Example } from "@workspace/types";
import { ProgressNotification, type ProgressNotificationProps } from "./ProgressNotification";

// The notification shade, behind the card.
const shade = (props: ProgressNotificationProps) => (
  <div className="ex-shade">
    <ProgressNotification {...props} />
  </div>
);

export const examples: Example[] = [
  {
    id: "progress",
    title: "With progress",
    state: "with progress",
    render: () => shade({ from: "Alex", received: 1, arriving: 2, progress: 0.5 }),
  },
  {
    id: "no-progress",
    title: "Waiting, no progress to show",
    state: "without progress",
    render: () => shade({ from: "Alex", received: 3, arriving: 1, progress: null }),
  },
  {
    id: "done",
    title: "All arrived",
    state: "all arrived",
    render: () => shade({ from: "Alex", received: 16, arriving: 0, progress: null }),
  },
];
