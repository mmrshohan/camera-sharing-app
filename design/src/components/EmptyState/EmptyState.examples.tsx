import type { Example } from "@workspace/types";
import { EmptyState } from "./EmptyState";

export const examples: Example[] = [
  {
    id: "message",
    title: "A message",
    state: "message",
    render: () => (
      <div className="ex-phone">
        <EmptyState
          icon="photos"
          title="No photos yet"
          body="Photos from a camera you borrow arrive here."
        />
      </div>
    ),
  },
  {
    id: "action",
    title: "With one way forward",
    state: "with action",
    render: () => (
      <div className="ex-phone">
        <EmptyState
          icon="blocked"
          title="No one is blocked"
          body="People you block can't send you requests."
          action={{ label: "Back to Settings", onPress: () => {} }}
        />
      </div>
    ),
  },
];
