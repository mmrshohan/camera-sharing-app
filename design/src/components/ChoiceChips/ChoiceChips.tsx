import { useRef, type KeyboardEvent } from "react";
import { MaterialGlyph } from "@components/Icon";
import { tokens } from "@tokens";
import "./ChoiceChips.css";

export interface ChoiceOption<T extends string> {
  id: T;
  label: string;
}

export interface ChoiceChipsProps<T extends string> {
  /** Names the group, e.g. "What went wrong?". */
  label: string;
  options: ChoiceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
}

const steps: Partial<Record<string, number>> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

/** Pick one. A radio group with one tab stop; arrow keys move the choice and the focus. */
export function ChoiceChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: ChoiceChipsProps<T>) {
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const chosen = options.findIndex((option) => option.id === value);
  const tabStop = chosen === -1 ? 0 : chosen;

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.id);
    chips.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const step = steps[event.key];
    const next =
      step !== undefined
        ? (index + step + options.length) % options.length
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? options.length - 1
            : undefined;
    if (next === undefined) return;
    event.preventDefault();
    choose(next);
  };

  return (
    <div className="choice-chips" role="radiogroup" aria-label={label}>
      {options.map((option, index) => {
        const checked = option.id === value;
        return (
          <button
            key={option.id}
            ref={(element) => {
              chips.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={index === tabStop ? 0 : -1}
            className="choice-chip"
            onClick={() => onChange(option.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span className="choice-chip__pill">
              {checked && <MaterialGlyph glyph="check" size={tokens.shape.iconChip} />}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
