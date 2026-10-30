import { cameraStatusText } from "@shared/plural";
import type { CameraCounts } from "@shared/types";
import "./CameraStatusLine.css";

export interface CameraStatusLineProps {
  counts: CameraCounts;
  /** Opens the session's details. */
  onPress: () => void;
}

/** "4 sent · 1 sending · 2 waiting for Wi-Fi", over the camera. Tap it for the details. */
export function CameraStatusLine({ counts, onPress }: CameraStatusLineProps) {
  return (
    <button type="button" className="camera-status-line" onClick={onPress}>
      <span className="camera-status-line__text">{cameraStatusText(counts)}</span>
    </button>
  );
}
