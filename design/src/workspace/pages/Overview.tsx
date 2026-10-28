import { Link } from "react-router";
import { ReleaseNotes } from "../ReleaseNotes";
import { componentEntries } from "../registry";
import { releaseLabel, releases } from "../releases";
import { statusNames, type ComponentStatus } from "../types";

const statuses: ComponentStatus[] = ["draft", "review", "final"];

const areas = [
  {
    to: "/guideline",
    name: "Guideline",
    summary: "Principles, color, type, icons, motion and writing, read live from the tokens.",
  },
  {
    to: "/library",
    name: "Library",
    summary: "Final components: the only ones screens and the native apps use.",
  },
  {
    to: "/lab",
    name: "Lab",
    summary: "Components in draft and review, with the checklist they pass before shipping.",
  },
  {
    to: "/prototype",
    name: "Prototype",
    summary: "Every screen and state of the app, clickable, on iOS and Android.",
  },
  { to: "/changelog", name: "Changelog", summary: "What changed in each release, and when." },
] as const;

export function Overview() {
  const [latest] = releases;
  return (
    <>
      <p className="ws-eyebrow">
        Design system · <span data-testid="overview-version">v{__DESIGN_VERSION__}</span>
      </p>
      <h1 className="ws-title">Camera Sharing design system</h1>
      <p className="ws-lede">
        The single source of truth for the app's design: the guideline, the component library, the
        lab for drafts and a clickable prototype of every screen and state.
      </p>

      <section className="ws-section" aria-labelledby="overview-components">
        <h2 id="overview-components">Components</h2>
        <dl className="ws-stats">
          {statuses.map((status) => (
            <div key={status} className="ws-stat" data-testid={`count-${status}`}>
              <dt>{statusNames[status]}</dt>
              <dd>{componentEntries.filter((entry) => entry.meta.status === status).length}</dd>
            </div>
          ))}
        </dl>
      </section>

      {latest && (
        <section
          className="ws-section"
          aria-labelledby="overview-latest"
          data-testid="overview-latest"
        >
          <h2 id="overview-latest">
            Latest changes <span className="ws-muted">· {releaseLabel(latest)}</span>
          </h2>
          <ReleaseNotes release={latest} limit={5} moreHref="/changelog" />
        </section>
      )}

      <section className="ws-section" aria-labelledby="overview-explore">
        <h2 id="overview-explore">Explore</h2>
        <div className="ws-grid" data-testid="overview-links">
          {areas.map((area) => (
            <Link key={area.to} to={area.to} className="ws-card">
              <span className="ws-card__name">{area.name}</span>
              <span className="ws-card__summary">{area.summary}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
