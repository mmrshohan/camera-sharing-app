import { create } from "qrcode";
import { useMemo } from "react";
import { Icon } from "@components/Icon";
import type { IconName } from "@icons";
import { useSurface } from "@shared/surface";
import { tokens } from "@tokens";
import "@shared/a11y.css";
import "./InvitationCode.css";

export type InvitationState = "active" | "expired" | "offline";

export interface InvitationCodeProps {
  /** What the QR code carries. Never shown as text. */
  payload: string;
  handle: string;
  device: string;
  state: InvitationState;
  /** Seconds until the code expires; shown only while it is active (D19). */
  secondsLeft: number | null;
}

const quietZone = 4;

/** The QR code as one path: each dark module a 1 × 1 square, drawn from data, never raw SVG. */
function qrPath(payload: string): { size: number; d: string } {
  const { modules } = create(payload, { errorCorrectionLevel: "M" });
  let d = "";
  for (let row = 0; row < modules.size; row += 1) {
    for (let col = 0; col < modules.size; col += 1) {
      if (modules.get(row, col)) d += `M${col + quietZone} ${row + quietZone}h1v1h-1z`;
    }
  }
  return { size: modules.size + quietZone * 2, d };
}

/** "1:35", and "1 minute 35 seconds" for screen readers. */
export function countdown(seconds: number): { shown: string; spoken: string } {
  const whole = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  const unit = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  return {
    shown: `${minutes}:${String(rest).padStart(2, "0")}`,
    spoken: [minutes > 0 ? unit(minutes, "minute") : "", unit(rest, "second")]
      .filter(Boolean)
      .join(" "),
  };
}

const placeholders: Record<Exclude<InvitationState, "active">, [IconName, string, string]> = {
  expired: ["waiting", "This code expired", "Get a new one to keep going."],
  offline: ["offline", "No code while offline", "It appears when you're back online."],
};

/** Sarah's invitation: a QR code Alex scans, with a countdown only while it is active. */
export function InvitationCode({
  payload,
  handle,
  device,
  state,
  secondsLeft,
}: InvitationCodeProps) {
  const { platform } = useSurface();
  const qr = useMemo(() => qrPath(payload), [payload]);
  const time = state === "active" && secondsLeft !== null ? countdown(secondsLeft) : null;

  return (
    <div className={`invitation invitation--${state}`}>
      {state === "active" ? (
        // A QR code stays dark on light in both themes, so every scanner can read it.
        <div className="invitation__card" data-theme="light">
          <svg
            className="invitation__qr"
            viewBox={`0 0 ${qr.size} ${qr.size}`}
            shapeRendering="crispEdges"
            role="img"
            aria-label={`Invitation code for ${handle}`}
          >
            <path d={qr.d} />
          </svg>
        </div>
      ) : (
        <div className="invitation__placeholder">
          <Icon name={placeholders[state][0]} size={tokens.shape.iconBar} platform={platform} />
          <span className="invitation__placeholder-title">{placeholders[state][1]}</span>
          <span className="invitation__placeholder-body">{placeholders[state][2]}</span>
        </div>
      )}
      <div className="invitation__who">
        <span className="invitation__handle">{handle}</span>
        <span className="invitation__device">{device}</span>
      </div>
      {time && (
        <p className="invitation__countdown">
          Expires in <span aria-hidden="true">{time.shown}</span>
          <span className="visually-hidden">{time.spoken}</span>
        </p>
      )}
    </div>
  );
}
