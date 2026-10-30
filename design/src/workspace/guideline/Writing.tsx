const rules = [
  ["Short, warm and plain", "Say what happened and what to do next."],
  ["Names, not roles", "“Sarah's phone”, never “recipient device”."],
  ["Never blame", "Not the phone, not the person. No “your phone isn't good enough”."],
  ["Numbers as numerals", "“3 photos”, and correctly “1 photo”."],
  ["Honest clocks", "“2 photos expire in 12 hours.”"],
  ["Sentence case", "No exclamation marks, no all caps."],
  [
    "Trust-sensitive copy",
    "Anything about privacy, delivery, saving, deletion, locking or recovery is reviewed for overclaims.",
  ],
] as const;

export function Writing() {
  return (
    <section id="writing" className="g-section" data-testid="guideline-writing">
      <h2>Writing</h2>
      <dl className="g-facts g-facts--wide">
        {rules.map(([title, body]) => (
          <div key={title}>
            <dt>{title}</dt>
            <dd>{body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
