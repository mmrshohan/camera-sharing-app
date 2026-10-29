import { MaterialGlyph } from "@components/Icon";
import { LiveDot } from "@components/LiveDot";
import { photos } from "@shared/plural";
import { tokens } from "@tokens";
import "@shared/a11y.css";
import "./LiveActivity.css";

export interface LiveActivityProps {
  variant: "lockScreen" | "island";
  /** Whose camera, such as "Alex". */
  from: string;
  received: number;
  arriving: number;
  state: "connected" | "arriving" | "done";
}

/** Photos arriving while the app is closed, on Sarah's Lock Screen and in the Dynamic Island. iOS only. */
export function LiveActivity({ variant, from, received, arriving, state }: LiveActivityProps) {
  const count = received === 0 ? "No photos yet" : photos(received);
  const detail =
    state === "done"
      ? "All photos arrived"
      : state === "connected"
        ? "Connected"
        : `${arriving} on the way`;
  // Always iOS and dark, as the system draws its own. The text keeps its default size: iOS gives a
  // Lock Screen Live Activity at most 160 pt, so the native view caps Dynamic Type.
  const pin = {
    "data-platform": "ios",
    "data-theme": "dark",
    "data-text-size": "default",
  } as const;

  if (variant === "island") {
    return (
      <div className="live-activity live-activity--island" {...pin}>
        <span className="live-activity__glyph" aria-hidden="true">
          <MaterialGlyph glyph="photo_library" filled size={tokens.shape.iconChip} />
        </span>
        <span className="live-activity__count" aria-hidden="true">
          {state === "done" ? (
            <MaterialGlyph glyph="check_circle" filled size={tokens.shape.iconChip} />
          ) : (
            received
          )}
        </span>
        <span className="visually-hidden">
          {from}’s camera: {count}, {detail}
        </span>
      </div>
    );
  }

  return (
    <div className="live-activity live-activity--lock" {...pin}>
      <div className="live-activity__head">
        <span className="live-activity__app" aria-hidden="true">
          <MaterialGlyph glyph="photo_camera" filled size={tokens.shape.iconChip} />
        </span>
        <span className="live-activity__title">{from}’s camera</span>
        {state !== "done" && <LiveDot size="inLabel" />}
      </div>
      <div className="live-activity__body">
        <span className="live-activity__numeral">{count}</span>
        <span className="live-activity__detail">{detail}</span>
      </div>
    </div>
  );
}
