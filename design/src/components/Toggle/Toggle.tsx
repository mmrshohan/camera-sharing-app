import { useId } from "react";
import { SwitchTrack } from "@shared/SwitchTrack";
import "./Toggle.css";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** A second line, such as what the setting changes. */
  description?: string;
}

/** The platform's own switch, in a row with its label. The whole row toggles it. */
export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  const labelId = useId();
  const descriptionId = useId();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelId}
      aria-describedby={description ? descriptionId : undefined}
      className="toggle"
      onClick={() => onChange(!checked)}
    >
      <span className="toggle__text">
        <span id={labelId} className="toggle__label">
          {label}
        </span>
        {description && (
          <span id={descriptionId} className="toggle__description">
            {description}
          </span>
        )}
      </span>
      <SwitchTrack checked={checked} />
    </button>
  );
}
