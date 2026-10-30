import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import type { IconName } from "@icons";
import { useSurface } from "@shared/surface";
import { tokens } from "@tokens";
import "./InlineMessage.css";

export type MessageTone = "neutral" | "waiting" | "problem";

export interface InlineMessageProps {
  tone: MessageTone;
  title: string;
  body?: string;
  /** One way forward, such as "Open Settings". */
  action?: { label: string; onPress: () => void };
  /** Replaces the tone's icon. */
  icon?: IconName;
}

const icons: Record<MessageTone, IconName> = {
  neutral: "privacy",
  waiting: "waiting",
  problem: "attention",
};

/** A message in the flow of the screen. Problems interrupt; the rest are announced politely. */
export function InlineMessage({ tone, title, body, action, icon }: InlineMessageProps) {
  const { platform } = useSurface();
  return (
    <div
      className={`inline-message inline-message--${tone}`}
      role={tone === "problem" ? "alert" : "status"}
    >
      <span className="inline-message__icon">
        <Icon name={icon ?? icons[tone]} filled size={tokens.shape.iconRow} platform={platform} />
      </span>
      <div className="inline-message__text">
        <p className="inline-message__title">{title}</p>
        {body && <p className="inline-message__body">{body}</p>}
        {action && (
          <div className="inline-message__action">
            <Button variant="plain" onPress={action.onPress}>
              {action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
