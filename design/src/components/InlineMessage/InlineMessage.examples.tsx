import type { Example } from "@workspace/types";
import { InlineMessage } from "./InlineMessage";

export const examples: Example[] = [
  {
    id: "neutral",
    title: "Neutral",
    state: "neutral",
    render: () => (
      <div className="ex-phone">
        <InlineMessage
          tone="neutral"
          title="Photos go only to Sarah"
          body="Nothing is saved on this phone."
        />
      </div>
    ),
  },
  {
    id: "waiting",
    title: "Waiting",
    state: "waiting",
    render: () => (
      <div className="ex-phone">
        <InlineMessage
          tone="waiting"
          title="Waiting for internet"
          body="Your photos are safe here and send when you're back online."
        />
      </div>
    ),
  },
  {
    id: "problem",
    title: "Problem, with a way forward",
    state: "problem",
    render: () => (
      <div className="ex-phone">
        <InlineMessage
          tone="problem"
          title="Photos access is off"
          body="Turn it on to save photos to this phone."
          action={{ label: "Open Settings", onPress: () => {} }}
        />
      </div>
    ),
  },
];
