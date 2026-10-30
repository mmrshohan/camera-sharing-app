import { Link } from "react-router";
import { statusNames, type ComponentEntry } from "./types";

export function ComponentCard({ entry, base }: { entry: ComponentEntry; base: "library" | "lab" }) {
  const { meta } = entry;
  return (
    <Link to={`/${base}/${meta.id}`} className="ws-card">
      <span className="ws-card__head">
        <span className="ws-card__name">{meta.name}</span>
        <span className={`ws-badge ws-badge--${meta.status}`}>{statusNames[meta.status]}</span>
      </span>
      <span className="ws-card__summary">{meta.summary}</span>
      <span className="ws-card__meta">
        v{meta.version} · {meta.layer === "brand" ? "Brand" : "System"} component
      </span>
    </Link>
  );
}
