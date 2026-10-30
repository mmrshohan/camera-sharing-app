import "./Avatar.css";

export interface AvatarProps {
  name: string;
  size?: 36 | 40 | 44;
  /** When a name already sits beside it, the avatar is decorative and hidden from screen readers. */
  decorative?: boolean;
}

/** One or two initials: "Sarah" → S, "Sarah Khan" → SK, "@alex" → A. */
export function initials(name: string): string {
  const words = name.replace(/^@/, "").trim().split(/\s+/).filter(Boolean);
  const first = Array.from(words[0] ?? "")[0] ?? "";
  const last = words.length > 1 ? (Array.from(words.at(-1) ?? "")[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/** A person, by initials. Neutral, because the photos bring the color. */
export function Avatar({ name, size = 40, decorative = false }: AvatarProps) {
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": name };
  return (
    <span className={`avatar avatar--${size}`} {...a11y}>
      {initials(name)}
    </span>
  );
}
