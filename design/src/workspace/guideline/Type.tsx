import { tokens, type Platform, type TypeStyle } from "@tokens";

const samples: Record<TypeStyle, string> = {
  numeral: "14",
  largeTitle: "Your photos",
  title2: "Lend your camera?",
  title3: "Today",
  headline: "Sarah's phone",
  body: "Photos go only to Sarah.",
  subheadline: "@sarah · Galaxy A15",
  footnote: "Nothing is saved here.",
  label: "Saved to Photos",
  ringLabel: "Lend my camera",
};

const use: Record<TypeStyle, string> = {
  numeral: "Live counts only",
  largeTitle: "One per screen",
  title2: "Panel titles, Lock",
  title3: "Section headers, verification words",
  headline: "Row titles, buttons",
  body: "Main text",
  subheadline: "Second lines, counts",
  footnote: "Fine print; the minimum size",
  label: "Status labels",
  ringLabel: "Ring button labels",
};

const styles = Object.keys(samples) as TypeStyle[];
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/** Android's non-linear scale yields fractions; one decimal is enough to check a layout. */
const fmt = (n: number) => String(Math.round(n * 10) / 10);

function Column({ platform }: { platform: Platform }) {
  const def = tokens.type[platform].default;
  const big = tokens.type[platform].largest;
  return (
    <article className="g-card">
      <h3>
        {platform === "ios" ? "iOS · SF Pro · Dynamic Type" : "Android · Roboto · font scale"}
      </h3>
      <ul className="g-type-list" data-platform={platform}>
        {styles.map((style) => (
          <li key={style}>
            <span className={`g-type g-type--${kebab(style)}`}>{samples[style]}</span>
            <span className="g-type-meta">
              <strong>{style}</strong> {def[style].size}/{def[style].line} · {def[style].weight}
              {" → "}largest {fmt(big[style].size)}/{fmt(big[style].line)}
              <br />
              {use[style]}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Type() {
  return (
    <section id="type" className="g-section" data-testid="guideline-type">
      <h2>Type</h2>
      <p className="g-lede">
        The phone's own typeface. The largest setting uses Apple's AX5 sizes on iOS and Android's
        non-linear 200% scale; the numeral does not grow.
      </p>
      <div className="g-cards g-cards--two">
        <Column platform="ios" />
        <Column platform="android" />
      </div>
      <ul className="g-rules">
        <li>Nothing below 13 pt on iOS or 14 sp on Android.</li>
        <li>Sentence case everywhere.</li>
        <li>Counts use tabular figures, so numbers never jump.</li>
        <li>Rows stack at large sizes; nothing truncates.</li>
      </ul>
    </section>
  );
}
