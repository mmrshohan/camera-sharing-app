import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import type { Surface } from "@shared/surface";
import { groupApprovals } from "./approvals";
import { NotFound } from "./pages/NotFound";
import { PreviewScope } from "./PreviewScope";
import { getComponent } from "./registry";
import { groupNames, statusNames, type ComponentEntry } from "./types";

type Mode = "library" | "lab";

function readSurface(params: URLSearchParams): Surface {
  return {
    platform: params.get("platform") === "android" ? "android" : "ios",
    theme: params.get("theme") === "dark" ? "dark" : "light",
    textSize: params.get("text") === "largest" ? "largest" : "default",
    reduceMotion: params.get("motion") === "reduce",
  };
}

interface Choice {
  param: string;
  legend: string;
  options: readonly (readonly [value: string, label: string])[];
  fallback: string;
}

const choices: Choice[] = [
  {
    param: "platform",
    legend: "Platform",
    options: [
      ["ios", "iOS"],
      ["android", "Android"],
    ],
    fallback: "ios",
  },
  {
    param: "theme",
    legend: "Theme",
    options: [
      ["light", "Light"],
      ["dark", "Dark"],
    ],
    fallback: "light",
  },
  {
    param: "text",
    legend: "Text size",
    options: [
      ["default", "Default"],
      ["largest", "Largest"],
    ],
    fallback: "default",
  },
];

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StillInLab({ entry }: { entry: ComponentEntry }) {
  return (
    <section>
      <h1 className="ws-title">{entry.meta.name}</h1>
      <p className="ws-lede">
        This component is {statusNames[entry.meta.status].toLowerCase()} and not in the Library yet.
      </p>
      <Link to={`/lab/${entry.meta.id}`}>Open it in the Lab</Link>
    </section>
  );
}

export function ComponentPage({ mode }: { mode: Mode }) {
  const { id = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const surface = readSurface(params);
  const [seen, setSeen] = useState<Set<string>>(() => new Set([surface.platform, surface.theme]));

  const entry = getComponent(id);
  if (!entry) return <NotFound />;
  if (mode === "library" && entry.meta.status !== "final") return <StillInLab entry={entry} />;
  const { meta, examples } = entry;

  const choose = (param: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params);
    if (value === fallback) next.delete(param);
    else next.set(param, value);
    setParams(next, { replace: true });
    setSeen((prev) => new Set(prev).add(value));
  };

  const checklist = [
    {
      label: "Every declared state has an example",
      done: examples.length > 1 && meta.states.every((s) => examples.some((e) => e.state === s)),
    },
    {
      label: "Viewed on iOS and Android, in light and dark",
      done: ["ios", "android", "light", "dark"].every((v) => seen.has(v)),
    },
    { label: "Accessibility notes written", done: meta.accessibility.length > 0 },
    { label: "Motion specified (or none)", done: true },
    {
      label: `Group ${meta.group} approved by the owner`,
      done: groupApprovals.some((a) => a.group === meta.group),
    },
  ];

  return (
    <article className="ws-component">
      <header className="ws-component__header">
        <p className="ws-eyebrow">
          {mode === "library" ? "Library" : "Lab"} · Group {meta.group} · {groupNames[meta.group]}
        </p>
        <h1 className="ws-title">{meta.name}</h1>
        <p className="ws-lede">{meta.summary}</p>
        <p className="ws-component__facts">
          <span className={`ws-badge ws-badge--${meta.status}`}>{statusNames[meta.status]}</span>
          <span>v{meta.version}</span>
          <span>{meta.layer === "brand" ? "Brand component" : "System component"}</span>
        </p>
      </header>

      <div className="ws-controls" role="group" aria-label="Preview settings">
        {choices.map(({ param, legend, options, fallback }) => (
          <fieldset key={param} className="ws-segmented">
            <legend>{legend}</legend>
            {options.map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name={param}
                  value={value}
                  checked={(params.get(param) ?? fallback) === value}
                  onChange={() => choose(param, value, fallback)}
                />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
        ))}
        <label className="ws-toggle">
          <input
            type="checkbox"
            checked={surface.reduceMotion}
            onChange={(e) => choose("motion", e.target.checked ? "reduce" : "full", "full")}
          />
          <span>Reduce motion</span>
        </label>
      </div>

      <section className="ws-section">
        <h2>States</h2>
        <div className="ws-examples">
          {examples.map((example) => (
            <figure key={example.id} className="ws-example">
              <figcaption>
                <span>{example.title}</span>
                <code>{example.state}</code>
              </figcaption>
              <PreviewScope {...surface}>{example.render(surface)}</PreviewScope>
            </figure>
          ))}
        </div>
      </section>

      <section className="ws-section ws-two">
        <h2>Anatomy and tokens</h2>
        <ul className="ws-list">
          {meta.anatomy.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <ul className="ws-tokens">
          {meta.tokens.map((token) => (
            <li key={token}>
              <code>{token}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className="ws-section">
        <h2>Accessibility</h2>
        <ul className="ws-list">
          {meta.accessibility.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="ws-section">
        <h2>Motion</h2>
        {meta.motion.length === 0 ? (
          <p className="ws-muted">This component doesn't move.</p>
        ) : (
          <ul className="ws-list">
            {meta.motion.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="ws-section">
        <h2>Where used</h2>
        <p className="ws-muted">Not used by any prototype screen yet.</p>
      </section>

      <section className="ws-section">
        <h2>Versions</h2>
        <p>
          Current version <strong>{meta.version}</strong>.
        </p>
        <p className="ws-muted">No earlier release yet</p>
      </section>

      <section className="ws-section">
        <h2>Changelog</h2>
        <ul className="ws-list">
          {meta.changelog.map((c) => (
            <li key={c.version}>
              <strong>{c.version}</strong> · {formatDate(c.date)} — {c.summary}
            </li>
          ))}
        </ul>
      </section>

      <section className="ws-section">
        <h2>Native</h2>
        <dl className="ws-native">
          <dt>iOS</dt>
          <dd>
            {meta.native.ios} <span className="ws-muted">({meta.native.status.ios})</span>
          </dd>
          <dt>Android</dt>
          <dd>
            {meta.native.android} <span className="ws-muted">({meta.native.status.android})</span>
          </dd>
        </dl>
      </section>

      {mode === "lab" && (
        <section className="ws-section">
          <h2>Promotion checklist</h2>
          <ul className="ws-checklist">
            {checklist.map((item) => (
              <li key={item.label} data-done={item.done}>
                <span aria-hidden="true">{item.done ? "✓" : "○"}</span>
                {item.label}
                <span className="ws-visually-hidden">{item.done ? " — done" : " — not yet"}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
