/**
 * A small set of radio buttons, drawn as the workspace's segmented control: its name beside the
 * track, never inside it, and the options sharing the track equally.
 */
export function Segmented<T extends string>({
  legend,
  hideLegend = false,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  /** For screen readers only, when the options already say what they are. */
  hideLegend?: boolean;
  name: string;
  options: readonly (readonly [value: T, label: string])[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="ws-segmented">
      <legend className={hideLegend ? "ws-visually-hidden" : undefined}>{legend}</legend>
      <div className="ws-segmented__track">
        {options.map(([option, label]) => (
          <label key={option}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
