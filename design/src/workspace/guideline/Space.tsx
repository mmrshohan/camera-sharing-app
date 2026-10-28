import { tokens } from "@tokens";

export function Space() {
  const scale = Object.entries(tokens.space);
  return (
    <section id="space" className="g-section" data-testid="guideline-space">
      <h2>Space and touch</h2>
      <p className="g-lede">A 4-point grid, platform margins and one rule for every tap target.</p>
      <div className="g-cards g-cards--two">
        <article className="g-card">
          <h3>Spacing scale</h3>
          <div className="g-scale">
            {scale.map(([step, value]) => (
              <div key={step}>
                <span className="g-scale__bar" style={{ height: value }} aria-hidden="true" />
                <code>{value}</code>
              </div>
            ))}
          </div>
        </article>
        <article className="g-card">
          <h3>Margins and targets</h3>
          <dl className="g-facts">
            <div>
              <dt>Screen margin</dt>
              <dd>
                iOS {tokens.margin.ios} pt · Android {tokens.margin.android} dp
              </dd>
            </div>
            <div>
              <dt>Minimum target</dt>
              <dd>
                iOS {tokens.target.ios} × {tokens.target.ios} pt · Android {tokens.target.android} ×{" "}
                {tokens.target.android} dp
              </dd>
            </div>
            <div>
              <dt>Text field height</dt>
              <dd>
                iOS {tokens.fieldHeight.ios} pt · Android {tokens.fieldHeight.android} dp
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}
