import { Avatar } from "@components/Avatar";
import { Icon } from "@components/Icon";
import { useSurface } from "@shared/surface";
import type { Party } from "@shared/types";
import { tokens } from "@tokens";
import "./PersonPair.css";

export interface PersonPairProps {
  from: Party;
  to: Party;
  /** Who is lending, e.g. "Camera". */
  fromTitle: string;
  /** Where photos land, e.g. "Photos go to". */
  toTitle: string;
}

function Person({ party, recipient }: { party: Party; recipient: boolean }) {
  return (
    <div className="person-pair__person">
      <Avatar name={party.name} size={44} decorative />
      <span className="person-pair__text">
        <span className="person-pair__name">{party.name}</span>
        <span className="person-pair__detail">
          {party.handle} ·{" "}
          <span className={recipient ? "person-pair__device" : undefined}>{party.device}</span>
        </span>
      </span>
    </div>
  );
}

/** Who lends the camera and exactly which phone the photos go to. Both phones show the same. */
export function PersonPair({ from, to, fromTitle, toTitle }: PersonPairProps) {
  const { platform } = useSurface();
  return (
    <div className="person-pair">
      <section className="person-pair__party">
        <p className="person-pair__title">{fromTitle}</p>
        <Person party={from} recipient={false} />
      </section>
      <span className="person-pair__arrow" aria-hidden="true">
        <Icon name="sending" size={tokens.shape.iconChip} platform={platform} />
      </span>
      <section className="person-pair__party">
        <p className="person-pair__title">{toTitle}</p>
        <Person party={to} recipient />
      </section>
    </div>
  );
}
