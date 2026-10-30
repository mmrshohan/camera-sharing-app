import "./LiveDot.css";

export interface LiveDotProps {
  size?: "default" | "inLabel";
  /** Accessible name; "Live" unless the context needs more. */
  label?: string;
}

/** Something is happening now. One per screen, beside words or a live count. */
export function LiveDot({ size = "default", label = "Live" }: LiveDotProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={size === "inLabel" ? "live-dot live-dot--in-label" : "live-dot"}
    />
  );
}
