import { useEffect, useState } from "react";
import type { Example } from "@workspace/types";
import { InvitationCode } from "./InvitationCode";

// A synthetic payload on a reserved domain: it never resolves and carries no real invitation.
const payload = "https://example.invalid/i/7KQ2-9XWD";

function CountingDown() {
  const [seconds, setSeconds] = useState(95);
  useEffect(() => {
    if (seconds <= 0) return undefined;
    const tick = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(tick);
  }, [seconds]);
  return (
    <InvitationCode
      payload={payload}
      handle="@sarah"
      device="Galaxy A15"
      state={seconds > 0 ? "active" : "expired"}
      secondsLeft={seconds > 0 ? seconds : null}
    />
  );
}

export const examples: Example[] = [
  {
    id: "active",
    title: "Active, counting down",
    state: "active",
    layout: "compact",
    render: () => <CountingDown />,
  },
  {
    id: "expired",
    title: "Expired",
    state: "expired",
    layout: "compact",
    render: () => (
      <InvitationCode
        payload={payload}
        handle="@sarah"
        device="Galaxy A15"
        state="expired"
        secondsLeft={null}
      />
    ),
  },
  {
    id: "offline",
    title: "Offline: no code and no countdown",
    state: "offline",
    layout: "compact",
    render: () => (
      <InvitationCode
        payload={payload}
        handle="@sarah"
        device="Galaxy A15"
        state="offline"
        secondsLeft={null}
      />
    ),
  },
];
