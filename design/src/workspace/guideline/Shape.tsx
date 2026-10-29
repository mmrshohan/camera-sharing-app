import { tokens } from "@tokens";

// Brand radii are the same on both platforms; system radii follow each platform.
const radii: { label: string; ios: number; android: number }[] = [
  { label: "Thumbnails", ios: tokens.shape.radiusThumb, android: tokens.shape.radiusThumb },
  { label: "Cards", ios: tokens.shape.radiusCard, android: tokens.shape.radiusCard },
  { label: "Text fields", ...tokens.system.fieldRadius },
  { label: "Panel top", ...tokens.system.panelRadius },
];

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
            {radii.map(({ label, ios, android }) => (
              <figure key={label}>
                <span
                  className="g-radius"
                  style={{ borderRadius: `${ios}px ${ios}px 0 0` }}
                  aria-hidden="true"
                />
                <figcaption>
                  {label} <code>{ios}</code>
                  {android !== ios && (
                    <>
                      {" "}
                      · Android <code>{android}</code>
                    </>
                  )}
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
