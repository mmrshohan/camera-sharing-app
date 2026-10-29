import { useEffect, useRef } from "react";
import { Icon } from "@components/Icon";
import { ProgressRing } from "@components/ProgressRing";
import type { IconName } from "@icons";
import { useShouldReduceMotion, useSurface } from "@shared/surface";
import type { SampleImage, TileStatus } from "@shared/types";
import { tokens } from "@tokens";
import "./PhotoTile.css";

export interface PhotoTileProps {
  image: SampleImage;
  status: TileStatus;
  /** 0 to 1, while arriving or saving. */
  progress?: number;
  /** Turns true once, when the photo has arrived: it develops, once per photo, never on scroll. */
  develop?: boolean;
  /** What the photo is, such as "Photo 3, 2:14 PM". */
  label: string;
  onOpen?: () => void;
}

/** The words for each state (design spec, Appendix C). */
export const tileStatusWords: Record<TileStatus, string> = {
  arriving: "Arriving",
  onlyInApp: "Only in this app",
  saving: "Saving to Photos",
  saved: "Saved to Photos",
  needsChecking: "Photos save needs checking",
  expired: "Expired, never arrived",
};

const badgeIcons: Partial<Record<TileStatus, IconName>> = {
  onlyInApp: "devices",
  needsChecking: "attention",
  expired: "waiting",
};

const { motion: m, shape } = tokens;

/** One of Sarah's photos in the grid: square, never rounded, with its state in the corner. */
export function PhotoTile({
  image,
  status,
  progress,
  develop = false,
  label,
  onOpen,
}: PhotoTileProps) {
  const { platform, lowMemory } = useSurface();
  const reduceMotion = useShouldReduceMotion();
  const photo = useRef<HTMLSpanElement>(null);
  const developed = useRef(develop);

  useEffect(() => {
    // Plays when develop turns true, and only then.
    if (developed.current === develop) return;
    developed.current = develop;
    if (!develop) return;
    if (reduceMotion || lowMemory) {
      photo.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: m.fadeMs,
        easing: "ease-out",
      });
    } else {
      const { blur, saturation, easing } = m.develop;
      photo.current?.animate(
        [
          { filter: `blur(${blur}px) saturate(${saturation})` },
          { filter: "blur(0px) saturate(1)" },
        ],
        { duration: m.develop.ms, easing: `cubic-bezier(${easing.join(", ")})` },
      );
    }
  }, [develop, reduceMotion, lowMemory]);

  const measured = (status === "arriving" || status === "saving") && progress !== undefined;
  const name = [label, tileStatusWords[status], measured ? `${Math.round(progress * 100)}%` : ""]
    .filter(Boolean)
    .join(", ");
  const icon = badgeIcons[status];

  const content = (
    <>
      <span
        ref={photo}
        className="photo-tile__image"
        style={{
          backgroundImage: `url("${image.src}")`,
          backgroundPosition: image.position,
          backgroundSize: `${image.zoom * 100}%`,
        }}
      />
      {(status === "arriving" || status === "saving") && (
        <span className="photo-tile__badge photo-tile__badge--ring">
          <ProgressRing
            value={progress ?? 0}
            label={tileStatusWords[status]}
            size={shape.badgeSize - 6}
          />
        </span>
      )}
      {icon && (
        <span className="photo-tile__badge">
          <Icon name={icon} filled size={shape.iconChip} platform={platform} />
        </span>
      )}
    </>
  );

  const className = `photo-tile photo-tile--${status}`;
  return onOpen ? (
    <button type="button" className={className} aria-label={name} onClick={onOpen}>
      {content}
    </button>
  ) : (
    <div className={className} role="img" aria-label={name}>
      {content}
    </div>
  );
}
