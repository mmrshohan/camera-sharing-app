import type { TypeStyle } from "@tokens";
import type { Example } from "@workspace/types";
import { Text } from "./Text";

const samples: [TypeStyle, string, string][] = [
  ["numeral", "14", "Live counts only"],
  ["largeTitle", "Your photos", "One per screen"],
  ["title2", "Lend your camera?", "Panel titles, Lock"],
  ["title3", "Today", "Section headers, verification words"],
  ["headline", "Sarah's phone", "Row titles, buttons"],
  ["body", "Photos go only to Sarah.", "Main text"],
  ["subheadline", "@sarah · Galaxy A15", "Second lines, counts"],
  ["footnote", "Nothing is saved here.", "Fine print; the minimum size"],
  ["label", "Saved to Photos", "Status labels"],
  ["ringLabel", "Lend my camera", "Ring button labels"],
];

export const examples: Example[] = samples.map(([style, sample, use]) => ({
  id: style,
  title: `${style} · ${use}`,
  state: style,
  render: () => (
    <Text style={style} tone={style === "subheadline" || style === "footnote" ? "ink2" : "ink"}>
      {sample}
    </Text>
  ),
}));
