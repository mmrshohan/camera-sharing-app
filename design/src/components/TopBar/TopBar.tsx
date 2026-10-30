import type { ReactNode } from "react";
import "./TopBar.css";

export interface TopBarProps {
  title: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** The small inline title, once the screen has scrolled. */
  collapsed?: boolean;
}

/** iOS's large-title navigation bar; Material's large top app bar on Android. One heading either way. */
export function TopBar({ title, leading, trailing, collapsed = false }: TopBarProps) {
  return (
    <header className={collapsed ? "top-bar top-bar--collapsed" : "top-bar"}>
      <div className="top-bar__leading">{leading}</div>
      <h1 className="top-bar__title">{title}</h1>
      <div className="top-bar__trailing">{trailing}</div>
    </header>
  );
}
