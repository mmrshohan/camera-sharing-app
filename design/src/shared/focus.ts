import { useRef } from "react";

/**
 * Radix returns focus only to a Dialog.Trigger. Our panels and dialogs open from app state,
 * so they remember whatever had focus when they opened and give it back when they close (D12).
 */
export function useReturnFocus() {
  const opener = useRef<HTMLElement | null>(null);
  return {
    remember: () => {
      const active = document.activeElement;
      opener.current = active instanceof HTMLElement ? active : null;
    },
    restore: (event: Event) => {
      event.preventDefault();
      opener.current?.focus();
    },
  };
}
