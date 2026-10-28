import type { ReactNode } from "react";
import { Icon } from "@components/Icon";
import { LiveDot } from "@components/LiveDot";
import type { IconName } from "@icons";
import { useSurface } from "@shared/surface";
import { tokens, type LabelKind } from "@tokens";
import "./StatusLabel.css";

export interface StatusLabelProps {
  kind: LabelKind;
  children: ReactNode;
  /** Replaces the kind's icon. Live shows the live dot unless an icon is given. */
  icon?: IconName;
}

const icons: Record<Exclude<LabelKind, "live">, IconName> = {
  sending: "sending",
  saved: "saved",
  waiting: "waiting",
  neutral: "devices",
};

/** A soft tint for status, always with an icon and words. */
export function StatusLabel({ kind, children, icon }: StatusLabelProps) {
  const { platform } = useSurface();
  const glyph = icon ?? (kind === "live" ? undefined : icons[kind]);
  return (
    <span className={`status-label status-label--${kind}`}>
      {glyph ? (
        <Icon name={glyph} filled size={tokens.shape.iconChip} platform={platform} />
      ) : (
        <LiveDot size="inLabel" />
      )}
      <span>{children}</span>
    </span>
  );
}
