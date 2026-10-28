import { tokens } from "@tokens";

const radii = [
  ["radiusThumb", "Thumbnails"],
  ["radiusField", "Text fields"],
  ["radiusCard", "Cards"],
  ["radiusPanel", "Panel top"],
] as const;

const sizes = [
  ["buttonHeight", "Filled and tinted buttons (capsule)"],
  ["textButtonHeight", "Text buttons"],
  ["ringSize", "Ring button"],
  ["ringStroke", "Ring stroke"],
  ["ringGap", "Ring gap"],
  ["ringDisc", "Ring disc"],
  ["shutterSize", "Shutter"],
  ["progressRingSize", "Progress ring"],
  ["liveDotSize", "Live dot"],
  ["labelHeight", "Status label"],
  ["gridGap", "Photo grid gap"],
] as const;

export function Shape() {
  return (
    <section id="shape" className="g-section" data-testid="guideline-shape">
      <h2>Shape</h2>
      <p className="g-lede">
        Continuous corners on iOS. Photos in the grid are square, never rounded or bordered.
      </p>
      <div className="g-cards">
        <article className="g-card">
          <h3>Corner radii</h3>
          <div className="g-radii">
            {radii.map(([key, label]) => (
              <figure key={key}>
                <span
                  className="g-radius"
                  style={{ borderRadius: `${tokens.shape[key]}px ${tokens.shape[key]}px 0 0` }}
                  aria-hidden="true"
                />
                <figcaption>
                  {label} <code>{tokens.shape[key]}</code>
                </figcaption>
              </figure>
            ))}
          </div>
        </article>
        <article className="g-card">
          <h3>Component sizes · pt on iOS, dp on Android</h3>
          <dl className="g-facts g-facts--grid">
            {sizes.map(([key, label]) => (
              <div key={key}>
                <dt>{label}</dt>
                <dd>
                  <code>{tokens.shape[key]}</code>
                </dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </section>
  );
}
