import { useState } from "react";
import type { Example } from "@workspace/types";
import { TextField, type FieldState } from "./TextField";

function Username({
  state,
  initial,
  message,
}: {
  state: FieldState;
  initial: string;
  message?: string;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div className="ex-phone">
      {message === undefined ? (
        <TextField
          label="Username"
          prefix="@"
          placeholder="yourname"
          value={value}
          onChange={setValue}
          state={state}
        />
      ) : (
        <TextField
          label="Username"
          prefix="@"
          placeholder="yourname"
          value={value}
          onChange={setValue}
          state={state}
          message={message}
        />
      )}
    </div>
  );
}

export const examples: Example[] = [
  { id: "idle", title: "Empty", state: "idle", render: () => <Username state="idle" initial="" /> },
  {
    id: "checking",
    title: "Checking",
    state: "checking",
    render: () => <Username state="checking" initial="sarah" message="Checking @sarah…" />,
  },
  {
    id: "valid",
    title: "Available",
    state: "valid",
    render: () => <Username state="valid" initial="sarah.k" message="@sarah.k is available." />,
  },
  {
    id: "invalid",
    title: "Taken",
    state: "invalid",
    render: () => (
      <Username state="invalid" initial="sarah" message="@sarah is taken. Try another." />
    ),
  },
];
