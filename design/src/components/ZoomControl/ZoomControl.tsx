import "./ZoomControl.css";

export interface ZoomControlProps {
  options: readonly number[];
  value: number;
  onChange: (value: number) => void;
}

/** ".5", "1", "2": the chosen level gains its "×", the camera's own way of writing zoom. */
export function zoomLabel(level: number, chosen: boolean): string {
  const number = level < 1 ? `.${String(level).split(".")[1] ?? ""}` : String(level);
  return chosen ? `${number}×` : number;
}

/** Zoom levels over the camera; the chosen one is larger and pressed. */
export function ZoomControl({ options, value, onChange }: ZoomControlProps) {
  return (
    <div className="zoom-control" role="group" aria-label="Zoom">
      {options.map((level) => {
        const chosen = level === value;
        return (
          <button
            key={level}
            type="button"
            className={
              chosen ? "zoom-control__option zoom-control__option--chosen" : "zoom-control__option"
            }
            aria-label={`Zoom ${level}×`}
            aria-pressed={chosen}
            onClick={() => onChange(level)}
          >
            <span className="zoom-control__label">{zoomLabel(level, chosen)}</span>
          </button>
        );
      })}
    </div>
  );
}
