import { Numeral } from "@components/Numeral";
import { defaultSurface, SurfaceScope } from "@shared/surface";
import type { Platform, Theme } from "@tokens";

const cards: [Platform, Theme, string][] = [
  ["ios", "light", "iOS · light"],
  ["android", "dark", "Android · dark"],
];

export function NumeralSection() {
  return (
    <section id="numeral" className="g-section" data-testid="guideline-numeral">
      <h2>The numeral</h2>
      <p className="g-lede">
        One expressive move: a big number for live counts, like a scoreboard for the moment. It
        carries the screen's one live dot.
      </p>
      <div className="g-cards g-cards--two">
        {cards.map(([platform, theme, name]) => (
          <figure key={name} className="g-card g-numeral-card">
            <SurfaceScope
              surface={{ ...defaultSurface, platform, theme }}
              className="g-surface g-surface--block"
            >
              <Numeral value={14} caption="photos" detail="2 on the way" live />
            </SurfaceScope>
            <figcaption className="g-muted">{name}</figcaption>
          </figure>
        ))}
      </div>
      <ul className="g-rules">
        <li>Live counts only: photos received, photos sent.</li>
        <li>One live dot per screen.</li>
        <li>Tabular figures, so the number never shifts.</li>
        <li>It does not grow with text size; the words around it do.</li>
      </ul>
    </section>
  );
}
