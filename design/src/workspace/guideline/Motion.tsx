import { springToMotion, tokens, type SpringName } from "@tokens";

const springUse: Record<SpringName, string> = {
  navigate: "Screen pushes",
  panel: "Panels rising and following a drag",
  press: "Ring and button release",
  drop: "Captured photo dropping into the last-shot well",
};

const springs = Object.keys(tokens.motion.spring) as SpringName[];

export function Motion() {
  const m = tokens.motion;
  return (
    <section id="motion" className="g-section" data-testid="guideline-motion">
      <h2>Motion</h2>
      <p className="g-lede">
        Motion proves what happened and never delays a photo. Springs everywhere, interruptible.
        With Reduce Motion on, all of it becomes a {m.fadeMs} ms fade.
      </p>
      <div className="g-demos">
        <figure className="g-demo">
          <div className="g-demo__stage">
            <span className="g-demo-develop" aria-hidden="true" />
          </div>
          <figcaption>
            <strong>Develop</strong> — a photo arrives: blur {m.develop.blur} → 0, saturation{" "}
            {m.develop.saturation} → 1, {m.develop.ms} ms
          </figcaption>
        </figure>
        <figure className="g-demo">
          <div className="g-demo__stage">
            <span className="g-demo-live" aria-hidden="true" />
          </div>
          <figcaption>
            <strong>Live dot</strong> — breathes {m.live.min} ↔ 1 every {m.live.periodMs} ms
          </figcaption>
        </figure>
        <figure className="g-demo">
          <div className="g-demo__stage">
            <span className="g-demo-press" aria-hidden="true">
              Press
            </span>
          </div>
          <figcaption>
            <strong>Press</strong> — buttons squeeze to {m.pressScale.button}, rings to{" "}
            {m.pressScale.ring}, in {m.pressDownMs} ms
          </figcaption>
        </figure>
      </div>
      <div className="g-table-wrap">
        <table className="g-table">
          <thead>
            <tr>
              <th scope="col">Spring</th>
              <th scope="col">Response · damping fraction</th>
              <th scope="col">Stiffness · damping (mass 1)</th>
              <th scope="col">Used by</th>
            </tr>
          </thead>
          <tbody>
            {springs.map((name) => {
              const s = m.spring[name];
              const converted = springToMotion(s);
              return (
                <tr key={name}>
                  <th scope="row">
                    <code>spring.{name}</code>
                  </th>
                  <td>
                    {s.response} s · {s.dampingFraction}
                  </td>
                  <td>
                    {converted.stiffness.toFixed(1)} · {converted.damping.toFixed(1)}
                  </td>
                  <td>{springUse[name]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="g-muted">
        SwiftUI uses <code>.spring(response:dampingFraction:)</code>; Compose uses{" "}
        <code>spring(dampingRatio, stiffness)</code> with the values above.
      </p>
    </section>
  );
}
