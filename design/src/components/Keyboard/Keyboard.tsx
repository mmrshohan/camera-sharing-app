import { MaterialGlyph } from "@components/Icon";
import type { Platform } from "@tokens";
import "./Keyboard.css";

export interface KeyboardProps {
  platform: Platform;
  visible: boolean;
}

const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

/** A picture of the platform's keyboard. Typing happens on the computer's keyboard. */
export function Keyboard({ platform, visible }: KeyboardProps) {
  if (!visible) return null;
  return (
    <div className={`keyboard keyboard--${platform}`} aria-hidden="true">
      <div className="keyboard__row">
        {Array.from(rows[0] ?? "").map((letter) => (
          <span key={letter} className="keyboard__key">
            {letter}
          </span>
        ))}
      </div>
      <div className="keyboard__row keyboard__row--inset">
        {Array.from(rows[1] ?? "").map((letter) => (
          <span key={letter} className="keyboard__key">
            {letter}
          </span>
        ))}
      </div>
      <div className="keyboard__row">
        <span className="keyboard__key keyboard__key--alt keyboard__key--wide">
          <MaterialGlyph glyph="shift" size={22} />
        </span>
        {Array.from(rows[2] ?? "").map((letter) => (
          <span key={letter} className="keyboard__key">
            {letter}
          </span>
        ))}
        <span className="keyboard__key keyboard__key--alt keyboard__key--wide">
          <MaterialGlyph glyph="backspace" size={22} />
        </span>
      </div>
      <div className="keyboard__row">
        <span className="keyboard__key keyboard__key--alt keyboard__key--wider">123</span>
        <span className="keyboard__key keyboard__key--space">space</span>
        <span className="keyboard__key keyboard__key--alt keyboard__key--wider">
          <MaterialGlyph glyph="keyboard_return" size={22} />
        </span>
      </div>
    </div>
  );
}
