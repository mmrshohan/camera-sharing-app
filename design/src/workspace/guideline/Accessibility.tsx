import { tokens } from "@tokens";

export function Accessibility() {
  const rules = [
    ["Contrast", "4.5:1 for text; 3:1 for large text, icons and control boundaries (WCAG 2.2 AA)."],
    [
      "Touch targets",
      `At least ${tokens.target.ios} × ${tokens.target.ios} pt on iOS and ${tokens.target.android} × ${tokens.target.android} dp on Android.`,
    ],
    [
      "Text size",
      "Everything scales to the largest accessibility sizes; layouts stack instead of truncating.",
    ],
    [
      "Focus",
      "Visible keyboard focus on every control, including inside panels. Focus moves into a panel and returns to its opener.",
    ],
    ["Announcements", "Status changes are announced politely and coalesced."],
    ["Meaning", "Never conveyed by color, motion or sound alone."],
    ["Motion", "Reduce Motion is honored everywhere."],
  ] as const;
  return (
    <section id="accessibility" className="g-section" data-testid="guideline-accessibility">
      <h2>Accessibility</h2>
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
