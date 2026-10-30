import { Icon } from "@components/Icon";
import type { IconName } from "@icons";
import { useSurface } from "@shared/surface";
import { tokens } from "@tokens";
import "./Viewfinder.css";

export type ViewfinderState = "scanning" | "invalid" | "denied" | "unavailable";

export interface ViewfinderProps {
  state: ViewfinderState;
}

const messages: Record<ViewfinderState, [string, IconName | null]> = {
  scanning: ["Point the camera at the code", null],
  invalid: ["This isn't an invitation code", "attention"],
  denied: ["Camera access is off", "blocked"],
  unavailable: ["The camera is in use by another app", "waiting"],
};

/** The scanner: the camera's view with a frame for the code, and what is happening in words. */
export function Viewfinder({ state }: ViewfinderProps) {
  const { platform } = useSurface();
  const [text, icon] = messages[state];
  const live = state === "scanning" || state === "invalid";
  return (
    // The camera is always dark, whatever the phone's appearance.
    <div className={`viewfinder viewfinder--${state}`} data-theme="dark">
      {live && <span className="viewfinder__preview" aria-hidden="true" />}
      {live && (
        <span className="viewfinder__frame" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      )}
      <p className="viewfinder__message" role="status">
        {icon && <Icon name={icon} filled size={tokens.shape.iconChip} platform={platform} />}
        <span>{text}</span>
      </p>
    </div>
  );
}
