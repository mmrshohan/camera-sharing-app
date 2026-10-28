import { useState } from "react";
import type { Example } from "@workspace/types";
import { Button, type ButtonProps } from "./Button";

function Counted(props: Omit<ButtonProps, "onPress">) {
  const [count, setCount] = useState(0);
  return (
    <span className={props.fullWidth ? "ex-pressable ex-pressable--stretch" : "ex-pressable"}>
      <Button {...props} onPress={() => setCount((n) => n + 1)} />
      <span className="ex-count">
        Presses <span data-testid="press-count">{count}</span>
      </span>
    </span>
  );
}

const compact = (
  id: string,
  title: string,
  state: string,
  props: Omit<ButtonProps, "onPress">,
): Example => ({ id, title, state, layout: "compact", render: () => <Counted {...props} /> });

export const examples: Example[] = [
  compact("filled", "Filled", "filled", { variant: "filled", children: "Continue" }),
  compact("tinted", "Tinted", "tinted", { variant: "tinted", children: "Show my code" }),
  compact("plain", "Plain", "plain", { variant: "plain", children: "Not now" }),
  compact("destructive", "Destructive", "destructive", {
    variant: "destructive",
    children: "Delete from this app",
  }),
  compact("pressed", "Press and hold", "pressed", { variant: "filled", children: "Continue" }),
  compact("disabled", "Disabled", "disabled", {
    variant: "filled",
    children: "Continue",
    disabled: true,
  }),
  compact("loading", "Loading", "loading", {
    variant: "filled",
    children: "Continue",
    loading: true,
  }),
  {
    id: "full-width",
    title: "Full width: the one primary action",
    state: "filled",
    render: () => (
      <div className="ex-phone">
        <Counted variant="filled" fullWidth>
          Continue
        </Counted>
      </div>
    ),
  },
];
