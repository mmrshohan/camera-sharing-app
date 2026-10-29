/** A small set of radio buttons, drawn as the workspace's segmented control. */
export function Segmented<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly (readonly [value: T, label: string])[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="ws-segmented">
      <legend>{legend}</legend>
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
    </fieldset>
  );
}
