import { useId } from "react";
import { Icon } from "@components/Icon";
import { useSurface } from "@shared/surface";
import { WaitingArc } from "@shared/WaitingArc";
import { tokens } from "@tokens";
import "./TextField.css";

export type FieldState = "idle" | "checking" | "valid" | "invalid";

export interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Fixed text before the input, such as "@" for usernames. */
  prefix?: string;
  state?: FieldState;
  /** What the state means, in words. Announced politely when it changes. */
  message?: string;
  onSubmit?: () => void;
  autoFocus?: boolean;
}

const { shape } = tokens;

function StatusMark({ state }: { state: FieldState }) {
  const { platform } = useSurface();
  if (state === "checking") return <WaitingArc size={shape.iconChip} stroke={shape.ringStroke} />;
  if (state === "valid")
    return <Icon name="saved" filled size={shape.iconChip} platform={platform} />;
  if (state === "invalid") {
    return <Icon name="attention" filled size={shape.iconChip} platform={platform} />;
  }
  return null;
}

/** The brand field on iOS; Material's outlined field, with a floating label, on Android. */
export function TextField({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  state = "idle",
  message,
  onSubmit,
  autoFocus = false,
}: TextFieldProps) {
  const inputId = useId();
  const messageId = useId();
  return (
    <div className={`text-field text-field--${state}`} data-filled={value !== "" || undefined}>
      <label className="text-field__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="text-field__box">
        {prefix && (
          <span className="text-field__prefix" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          className="text-field__input"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && onSubmit) {
              event.preventDefault();
              onSubmit();
            }
          }}
          aria-invalid={state === "invalid" || undefined}
          aria-describedby={message ? messageId : undefined}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint={onSubmit ? "go" : undefined}
        />
      </div>
      <div className="text-field__live" aria-live="polite">
        {message && (
          <p id={messageId} className="text-field__message">
            <StatusMark state={state} />
            <span>{message}</span>
          </p>
        )}
      </div>
    </div>
  );
}
