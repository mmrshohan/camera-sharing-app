import { LiveDot } from "@components/LiveDot";
import "./Numeral.css";

export interface NumeralProps {
  value: number;
  /** What is counted, already in the right number: "photos", or "photo" for one. */
  caption: string;
  /** A second line, such as "2 on the way". */
  detail?: string;
  /** Shows the screen's one live dot. */
  live?: boolean;
}

const format = new Intl.NumberFormat("en");

/** The one expressive move: a big number, for live counts only. */
export function Numeral({ value, caption, detail, live = false }: NumeralProps) {
  const count = format.format(value);
  const phrase = [`${count} ${caption}`, detail, live ? "live" : undefined]
    .filter(Boolean)
    .join(", ");
  return (
    <div className="numeral" role="img" aria-label={phrase}>
      <span className="numeral__value">
        {count}
        {live && <LiveDot />}
      </span>
      <span className="numeral__text">
        <span className="numeral__caption">{caption}</span>
        {detail && <span className="numeral__detail">{detail}</span>}
      </span>
    </div>
  );
}
