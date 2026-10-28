import { tokens, type LabelKind, type Theme } from "@tokens";
import { formatRatio, measure } from "./contrast";

const meaning: Record<LabelKind, string> = {
  live: "A session is on",
  sending: "On its way",
  saved: "Safe in the phone's gallery",
  waiting: "Paused, not lost",
  neutral: "Received, not in Photos yet",
};

const kinds = Object.keys(tokens.label.light) as LabelKind[];
const themes: Theme[] = ["light", "dark"];

export function Labels() {
  return (
    <section id="labels" className="g-section" data-testid="guideline-labels">
      <h2>Status labels</h2>
      <p className="g-lede">
        Soft tints for status, always with an icon and words. Live examples of the StatusLabel
        component appear here once it is built.
      </p>
      <div className="g-table-wrap">
        <table className="g-table">
          <thead>
            <tr>
              <th scope="col">Label</th>
              <th scope="col">Light</th>
              <th scope="col">Dark</th>
              <th scope="col">Meaning</th>
              <th scope="col">Contrast</th>
            </tr>
          </thead>
          <tbody>
            {kinds.map((kind) => (
              <tr key={kind}>
                <th scope="row">
                  <code>{kind}</code>
                </th>
                {themes.map((theme) => {
                  const { fg, bg } = tokens.label[theme][kind];
                  return (
                    <td key={theme}>
                      <span className="g-chip" style={{ color: fg, background: bg }}>
                        {meaning[kind]}
                      </span>
                      <code className="g-chip-values">
                        {fg} on {bg}
                      </code>
                    </td>
                  );
                })}
                <td>{meaning[kind]}</td>
                <td>
                  {themes.map((theme) => {
                    const { ratio, passes } = measure(
                      { fg: `label.${kind}.fg`, bg: `label.${kind}.bg`, min: 4.5, note: "" },
                      theme,
                    );
                    return (
                      <span key={theme} className={passes ? "g-pass" : "g-fail"}>
                        {formatRatio(ratio)} {passes ? "✓" : "✗"}{" "}
                      </span>
                    );
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
