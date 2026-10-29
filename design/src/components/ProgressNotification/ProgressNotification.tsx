import { MaterialGlyph } from "@components/Icon";
import { photos } from "@shared/plural";
import { useSurface } from "@shared/surface";
import { tokens } from "@tokens";
import "./ProgressNotification.css";

export interface ProgressNotificationProps {
  from: string;
  received: number;
  arriving: number;
  /** Real progress from 0 to 1, or null when there is none to show. */
  progress: number | null;
}

/** Android's ongoing notification while photos arrive with the app closed. Android only. */
export function ProgressNotification({
  from,
  received,
  arriving,
  progress,
}: ProgressNotificationProps) {
  const { textSize } = useSurface();
  const text = arriving > 0 ? `${photos(received)} · ${arriving} on the way` : photos(received);
  const percent = progress === null ? null : Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <div className="progress-notification" data-platform="android" data-text-size={textSize}>
      <div className="progress-notification__head">
        <span className="progress-notification__app" aria-hidden="true">
          <MaterialGlyph glyph="photo_camera" filled size={tokens.shape.iconChip} />
        </span>
        <span>Camera Sharing · now</span>
      </div>
      <p className="progress-notification__title">Photos from {from}</p>
      <p className="progress-notification__text">{text}</p>
      {percent !== null && (
        <span
          className="progress-notification__bar"
          role="progressbar"
          aria-label="Photos arriving"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <span style={{ width: `${percent}%` }} />
        </span>
      )}
    </div>
  );
}
