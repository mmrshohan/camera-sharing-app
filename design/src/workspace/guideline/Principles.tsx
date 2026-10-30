const principles = [
  {
    title: "One job per screen",
    body: "One obvious action. Everything else is one tap away, or gone.",
  },
  {
    title: "The photo is the color",
    body: "Neutral surfaces. Blue only where you can tap. Soft tints only for status.",
  },
  {
    title: "Honest by default",
    body: "Every state shows an icon and words. Nothing implies a photo is safe before it is.",
  },
];

export function Principles() {
  return (
    <section id="principles" className="g-section" data-testid="guideline-principles">
      <h2>Principles</h2>
      <div className="g-cards g-cards--three">
        {principles.map((p) => (
          <article key={p.title} className="g-card">
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
