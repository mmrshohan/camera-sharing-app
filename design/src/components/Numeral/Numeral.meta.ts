import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "numeral",
  name: "Numeral",
  group: 2,
  layer: "brand",
  status: "final",
  version: "1.0.0",
  summary:
    "The one expressive move: a big number for live counts, such as photos received, with the screen's one live dot.",
  anatomy: [
    "80/80 bold, tracking −2, tabular figures",
    "The live dot at the number's shoulder, 8 pt away",
    "The caption in headline and the detail in body (ink2), right-aligned on the number's baseline",
    "At accessibility text sizes the words move under the number",
  ],
  tokens: [
    "type.numeral",
    "type.headline",
    "type.body",
    "color.ink",
    "color.ink2",
    "color.live",
    "shape.liveDotSize",
  ],
  states: ["count", "live"],
  accessibility: [
    "Read as one phrase, such as “14 photos, 2 on the way, live”",
    "The number does not grow with text size, because it is already large; its words do",
    "Callers pass the caption in the right number: “1 photo”, “3 photos”",
  ],
  motion: [
    "The number changes in place; tabular figures keep its width steady",
    "The live dot breathes and holds still with Reduce Motion",
  ],
  native: {
    ios: "Text(count).font(.system(size: 80, weight: .bold)).monospacedDigit().tracking(-2) at a fixed size, not a text style; caption and detail in a VStack(alignment: .trailing), stacked below when dynamicTypeSize.isAccessibilitySize; .accessibilityElement(children: .ignore) with the phrase as its label",
    android:
      'Text(count) with 80 dp converted to sp through LocalDensity so it ignores font scale, FontWeight.Bold, letterSpacing (-2).sp and fontFeatureSettings "tnum"; Modifier.semantics(mergeDescendants = true) { contentDescription = phrase }',
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    { version: "1.0.0", date: "2026-10-29", summary: "First version: a count, live or not." },
  ],
};
