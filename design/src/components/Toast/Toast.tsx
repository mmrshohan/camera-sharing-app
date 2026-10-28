import "./Toast.css";

export interface ToastProps {
  /** null hides the toast; the live region stays, so the next message is announced. */
  message: string | null;
  /** aboveControls keeps it clear of the shutter and other primary controls. */
  placement: "top" | "aboveControls";
}

/** A brief confirmation that never covers a primary control and never takes a tap. */
export function Toast({ message, placement }: ToastProps) {
  return (
    <div
      className={`toast-region toast-region--${placement === "top" ? "top" : "above-controls"}`}
      role="status"
    >
      <span className="toast" hidden={message === null}>
        {message}
      </span>
    </div>
  );
}
