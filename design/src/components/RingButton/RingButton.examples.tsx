import { useState } from "react";
import type { Example } from "@workspace/types";
import { RingButton, type RingButtonProps } from "./RingButton";

/** A ring with a press counter, so reviewers (and tests) can see exactly what fired. */
function Counted(props: Omit<RingButtonProps, "onPress">) {
  const [count, setCount] = useState(0);
  return (
    <span className="ex-pressable">
      <RingButton {...props} onPress={() => setCount((n) => n + 1)} />
      <span className="ex-count">
        Presses <span data-testid="press-count">{count}</span>
      </span>
    </span>
  );
}

export const examples: Example[] = [
  {
    id: "filled",
    title: "Filled, at rest",
    state: "rest",
    layout: "compact",
    render: () => <Counted variant="filled" icon="lend" label="Lend my camera" />,
  },
  {
    id: "tinted",
    title: "Tinted, at rest",
    state: "rest",
    layout: "compact",
    render: () => <Counted variant="tinted" icon="borrow" label="Borrow a camera" />,
  },
  {
    id: "pressed",
    title: "Press and hold",
    state: "pressed",
    layout: "compact",
    render: () => <Counted variant="filled" icon="lend" label="Lend my camera" />,
  },
  {
    id: "waiting",
    title: "Waiting",
    state: "waiting",
    layout: "compact",
    render: () => (
      <Counted variant="filled" icon="lend" label="Waiting for Sarah" state="waiting" />
    ),
  },
  {
    id: "unavailable",
    title: "Unavailable, with its reason",
    state: "unavailable",
    layout: "compact",
    render: () => (
      <Counted
        variant="tinted"
        icon="borrow"
        label="Borrow a camera"
        state="unavailable"
        unavailableReason="Needs the internet"
      />
    ),
  },
];
