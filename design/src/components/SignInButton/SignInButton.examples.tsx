import { useState } from "react";
import type { Platform } from "@tokens";
import type { Example } from "@workspace/types";
import { SignInButton, type SignInProvider } from "./SignInButton";

function Counted({ provider, disabled = false }: { provider: SignInProvider; disabled?: boolean }) {
  const [count, setCount] = useState(0);
  return (
    <span className="ex-pressable ex-pressable--stretch">
      <SignInButton
        provider={provider}
        action="continue"
        fullWidth
        disabled={disabled}
        onPress={() => setCount((n) => n + 1)}
      />
      <span className="ex-count">
        Presses <span data-testid="press-count">{count}</span>
      </span>
    </span>
  );
}

/** Each platform's own sign-in first; Android offers Google only, as Welcome does. */
const providersOn = (platform: Platform): SignInProvider[] =>
  platform === "ios" ? ["apple", "google"] : ["google"];

const androidHasNoApple = (
  <span className="ex-count">Android offers Google only, as Welcome does.</span>
);

export const examples: Example[] = [
  {
    id: "apple",
    title: "Continue with Apple: black on light, white on dark",
    state: "apple",
    render: ({ platform }) => (
      <div className="ex-phone">
        {platform === "ios" ? <Counted provider="apple" /> : androidHasNoApple}
      </div>
    ),
  },
  {
    id: "google",
    title: "Continue with Google, with a placeholder where Google's G goes",
    state: "google",
    render: () => (
      <div className="ex-phone">
        <Counted provider="google" />
      </div>
    ),
  },
  {
    id: "unavailable",
    title: "Unavailable while offline: shown, dimmed, still focusable",
    state: "unavailable",
    render: ({ platform }) => (
      <div className="ex-phone ex-stack">
        {providersOn(platform).map((provider) => (
          <Counted key={provider} provider={provider} disabled />
        ))}
      </div>
    ),
  },
  {
    id: "pair",
    title: "On Welcome: the platform's own first, both the same size",
    state: "pair",
    render: ({ platform }) => (
      <div className="ex-phone ex-stack">
        {providersOn(platform).map((provider) => (
          <SignInButton key={provider} provider={provider} action="continue" fullWidth />
        ))}
      </div>
    ),
  },
];
