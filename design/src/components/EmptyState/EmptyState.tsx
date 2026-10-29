import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import type { IconName } from "@icons";
import { useSurface } from "@shared/surface";
import { tokens } from "@tokens";
import "./EmptyState.css";

export interface EmptyStateProps {
  title: string;
  body?: string;
  /** At most one way forward. */
  action?: { label: string; onPress: () => void };
  /** An icon for the whole screen, such as photos. */
  icon?: IconName;
}

/** What a screen says before it has anything to show. Calm, with at most one way forward. */
export function EmptyState({ title, body, action, icon }: EmptyStateProps) {
  const { platform } = useSurface();
  return (
    <div className="empty-state">
      {icon && (
        <span className="empty-state__icon">
          <Icon name={icon} size={tokens.shape.iconHero} platform={platform} />
        </span>
      )}
      <h2 className="empty-state__title">{title}</h2>
      {body && <p className="empty-state__body">{body}</p>}
      {action && (
        <div className="empty-state__action">
          <Button variant="tinted" onPress={action.onPress}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
