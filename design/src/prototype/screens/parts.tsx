import { useState, type ReactNode } from "react";
import { Avatar } from "@components/Avatar";
import "./screens.css";

/**
 * A screen: its top bar under the status bar, content that scrolls, and an optional bar of
 * actions kept above the home indicator and the keyboard. A floating bar lies over the content.
 */
export function ScreenBody({
  top,
  children,
  bar,
  floating = false,
  grouped = false,
}: {
  /** Given whether the content has scrolled, for a top bar that collapses. */
  top?: (scrolled: boolean) => ReactNode;
  children: ReactNode;
  bar?: ReactNode;
  floating?: boolean;
  grouped?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const classes = ["screen", grouped && "screen--grouped", floating && "screen--floating-bar"];
  return (
    <div className={classes.filter(Boolean).join(" ")}>
      <div className="screen__top">{top?.(scrolled)}</div>
      <div className="screen__content" onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}>
        {children}
      </div>
      {bar && <div className="screen__bar">{bar}</div>}
    </div>
  );
}

/** Home's two rings, side by side. */
export function RingBar({ children }: { children: ReactNode }) {
  return <div className="ring-bar">{children}</div>;
}

/** The account at the end of the top bar: the person's initial, opening Settings. */
export function AccountButton({
  name,
  label,
  onPress,
}: {
  name: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <button type="button" className="account-button" aria-label={label} onClick={onPress}>
      <Avatar name={name} size={36} decorative />
    </button>
  );
}

/** "4:59" for a deadline `ms` away. */
export function minutesSeconds(ms: number): string {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
