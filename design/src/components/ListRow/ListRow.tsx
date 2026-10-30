import { useId, type ReactNode } from "react";
import { Icon } from "@components/Icon";
import type { IconName } from "@icons";
import { useSurface } from "@shared/surface";
import { SwitchTrack } from "@shared/SwitchTrack";
import { tokens } from "@tokens";
import "./ListRow.css";

export type RowTrailing =
  | { kind: "chevron" }
  | { kind: "value"; text: string }
  | { kind: "toggle"; checked: boolean; onChange: (checked: boolean) => void }
  | { kind: "label"; label: ReactNode };

export interface ListRowProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  trailing?: RowTrailing;
  onPress?: () => void;
  destructive?: boolean;
}

/** One row of a list. With a toggle, the whole row is the switch; with onPress, a button. */
export function ListRow({
  title,
  subtitle,
  icon,
  trailing,
  onPress,
  destructive = false,
}: ListRowProps) {
  const { platform } = useSurface();
  const titleId = useId();
  const subtitleId = useId();
  const className = destructive ? "list-row list-row--destructive" : "list-row";

  const body = (
    <>
      {icon && (
        <span className="list-row__icon">
          <Icon name={icon} size={tokens.shape.iconRow} platform={platform} />
        </span>
      )}
      <span className="list-row__text">
        <span id={titleId} className="list-row__title">
          {title}
        </span>
        {subtitle && (
          <span id={subtitleId} className="list-row__subtitle">
            {subtitle}
          </span>
        )}
      </span>
      {trailing?.kind === "value" && <span className="list-row__value">{trailing.text}</span>}
      {trailing?.kind === "label" && <span className="list-row__label">{trailing.label}</span>}
      {trailing?.kind === "chevron" && (
        <span className="list-row__chevron">
          <Icon name="open" size={tokens.shape.iconChip} platform={platform} />
        </span>
      )}
      {trailing?.kind === "toggle" && <SwitchTrack checked={trailing.checked} />}
    </>
  );

  if (trailing?.kind === "toggle") {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={trailing.checked}
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subtitleId : undefined}
        className={className}
        onClick={() => trailing.onChange(!trailing.checked)}
      >
        {body}
      </button>
    );
  }
  if (onPress) {
    return (
      <button type="button" className={className} onClick={onPress}>
        {body}
      </button>
    );
  }
  return <div className={className}>{body}</div>;
}
