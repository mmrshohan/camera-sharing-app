import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import "./workspace.css";

const sections = [
  { to: "/", label: "Overview", end: true },
  { to: "/guideline", label: "Guideline", end: false },
  { to: "/library", label: "Library", end: false },
  { to: "/lab", label: "Lab", end: false },
  { to: "/prototype", label: "Prototype", end: false },
  { to: "/changelog", label: "Changelog", end: false },
] as const;

/** Follows the computer's light or dark setting for the workspace chrome. */
function useWorkspaceTheme(): void {
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme = query.matches ? "dark" : "light";
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
}

/**
 * Opens shared links such as /guideline#motion at their section. The browser looks for the
 * anchor before React has rendered it, so the scroll has to happen after render.
 */
function useHashScroll(hash: string): void {
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [hash]);
}

export function WorkspaceLayout() {
  useWorkspaceTheme();
  const { pathname, hash } = useLocation();
  useHashScroll(hash);
  const fullBleed = pathname.startsWith("/prototype");

  return (
    <>
      <header className="ws-header">
        <a className="ws-brand" href="/">
          Camera Sharing · Design system
        </a>
        <nav className="ws-nav" aria-label="Workspace">
          {sections.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}>
              {label}
            </NavLink>
          ))}
        </nav>
        <span className="ws-version">v{__DESIGN_VERSION__}</span>
      </header>
      <main className={fullBleed ? "ws-main ws-main--full" : "ws-main"}>
        <Outlet />
      </main>
    </>
  );
}
