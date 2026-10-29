import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "verification-words",
  name: "VerificationWords",
  group: 3,
  layer: "brand",
  status: "review",
  version: "1.0.0",
  summary:
    "Six words, two rows of three. Both phones must show the same words, or nothing goes forward (R2).",
  anatomy: [
    "A prompt in subheadline, ink2",
    "Six words in title3 on surface tiles, two rows of three",
    "At the largest text sizes, one word per row, in the same order",
  ],
  tokens: [
    "type.title3",
    "type.subheadline",
    "color.surface",
    "color.ink",
    "color.ink2",
    "shape.radiusThumb",
  ],
  states: ["words"],
  accessibility: [
    "An ordered list, so screen readers say “1 of 6” and keep the order",
    "The words are plain text, never an image",
  ],
  motion: [],
  native: {
    ios: "A three-column Grid of Text(word).font(.title3.weight(.semibold)) on rounded surface tiles, one column at accessibility sizes; each tile labelled “word, 1 of 6”",
    android:
      "LazyVerticalGrid(GridCells.Fixed(3)) of Text tiles, one column at large font scales, with collectionInfo semantics",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version." }],
};
