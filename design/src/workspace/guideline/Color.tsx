import type { CSSProperties } from "react";
import { tokens, type ColorName, type Theme } from "@tokens";
import { formatRatio, measure, pairs, type ContrastPair } from "./contrast";

const names = Object.keys(tokens.color.light) as ColorName[];
const themes: Theme[] = ["light", "dark"];
const tokenName = (ref: string) => ref.replace("color.", "");

/** Pairs that describe this color: as text or icon color, or onAccent text on it (accent). */
function pairsFor(name: ColorName): ContrastPair[] {
  return pairs.filter(
    (p) => p.fg === `color.${name}` || (p.bg === `color.${name}` && p.fg === "color.onAccent"),
  );
}

function Swatch({ value }: { value: string }) {
  const alpha = value.startsWith("rgba");
  return (
    <span className="g-swatch">
      <span
        className={alpha ? "g-swatch__chip g-swatch__chip--alpha" : "g-swatch__chip"}
        style={{ "--swatch": value } as CSSProperties}
        aria-hidden="true"
      />
      <code>{value}</code>
    </span>
  );
}

function Results({ name, pair }: { name: ColorName; pair: ContrastPair }) {
  const on =
    pair.bg === `color.${name}` ? `${tokenName(pair.fg)} text on it` : `on ${tokenName(pair.bg)}`;
  return (
    <li>
      <span className="g-results__on">{on}</span>
      <span className="g-results__values">
        {themes.map((theme) => {
          const { ratio, passes } = measure(pair, theme);
          return (
            <span key={theme} className={passes ? "g-pass" : "g-fail"}>
              {formatRatio(ratio)} {passes ? "✓" : "✗"}
              <span className="ws-visually-hidden"> {theme}</span>{" "}
            </span>
          );
        })}
        <span className="g-muted">needs {pair.min}:1</span>
      </span>
    </li>
  );
}

export function Color() {
  return (
    <section id="color" className="g-section" data-testid="guideline-color">
      <h2>Color</h2>
      <p className="g-lede">
        One accent for everything you can tap. Neutrals do the rest, and photos bring the color.
        Contrast is measured live from the tokens against WCAG 2.2 AA (light · dark).
      </p>
      <div className="g-table-wrap">
        <table className="g-table">
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Light</th>
              <th scope="col">Dark</th>
              <th scope="col">Used for</th>
              <th scope="col">Contrast (light · dark)</th>
            </tr>
          </thead>
          <tbody>
            {names.map((name) => {
              const measured = pairsFor(name);
              return (
                <tr key={name} data-testid={`color-${name}`}>
                  <th scope="row">
                    <code>{name}</code>
                  </th>
                  <td>
                    <Swatch value={tokens.color.light[name]} />
                  </td>
                  <td>
                    <Swatch value={tokens.color.dark[name]} />
                  </td>
                  <td>{tokens.colorUse[name]}</td>
                  <td>
                    {measured.length === 0 ? (
                      <span className="g-muted">—</span>
                    ) : (
                      <ul className="g-results">
                        {measured.map((pair) => (
                          <Results key={`${pair.fg}-${pair.bg}`} name={name} pair={pair} />
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul className="g-rules">
        <li>Blue means tappable. Nothing else is blue.</li>
        <li>Tints never carry meaning alone: icon and words, always.</li>
        <li>One live dot per screen.</li>
        <li>Camera controls are white; color belongs to the photo.</li>
      </ul>
    </section>
  );
}
