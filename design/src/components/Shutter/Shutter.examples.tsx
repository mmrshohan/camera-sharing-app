import { useState, type ReactNode } from "react";
import type { Example } from "@workspace/types";
import { Shutter, type ShutterState } from "./Shutter";

/** The shutter always sits on the camera preview. */
function OnCamera({ children }: { children: ReactNode }) {
  return <div className="ex-camera">{children}</div>;
}

function Counted({ state, message }: { state: ShutterState; message?: string }) {
  const [count, setCount] = useState(0);
  return (
    <OnCamera>
      <span className="ex-pressable">
        {message === undefined ? (
          <Shutter state={state} onCapture={() => setCount((n) => n + 1)} />
        ) : (
          <Shutter state={state} message={message} onCapture={() => setCount((n) => n + 1)} />
        )}
        <span className="ex-count">
          Photos <span data-testid="capture-count">{count}</span>
        </span>
      </span>
    </OnCamera>
  );
}

export const examples: Example[] = [
  {
    id: "ready",
    title: "Ready",
    state: "ready",
    layout: "compact",
    render: () => <Counted state="ready" />,
  },
  {
    id: "pressed",
    title: "Press and hold",
    state: "pressed",
    layout: "compact",
    render: () => <Counted state="ready" />,
  },
  {
    id: "preparing",
    title: "Preparing",
    state: "preparing",
    layout: "compact",
    render: () => <Counted state="preparing" />,
  },
  {
    id: "blocked",
    title: "Blocked, with its message",
    state: "blocked",
    layout: "compact",
    render: () => <Counted state="blocked" message="Waiting for internet" />,
  },
];
