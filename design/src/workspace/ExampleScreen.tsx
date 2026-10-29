import { useState, type ReactNode } from "react";

/** A slice of a phone screen that panels and dialogs open inside, as they do on a device. */
export function ExampleScreen({
  children,
  className,
}: {
  children: (screen: HTMLElement | null) => ReactNode;
  className?: string;
}) {
  const [screen, setScreen] = useState<HTMLElement | null>(null);
  return (
    <div
      ref={setScreen}
      className={className ? `ex-screen ex-screen--tall ${className}` : "ex-screen ex-screen--tall"}
    >
      {children(screen)}
    </div>
  );
}
