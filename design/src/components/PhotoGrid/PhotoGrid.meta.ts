import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "photo-grid",
  name: "PhotoGrid",
  group: 4,
  layer: "brand",
  status: "final",
  version: "1.0.0",
  summary: "Sarah's photos by session and day: three across, 2 pt apart, edge to edge.",
  anatomy: [
    "A section header per session or day, with its count",
    "Three square tiles per row with 2 pt gaps and no margins",
    "Newest first",
  ],
  tokens: ["shape.gridGap", "type.title3", "type.subheadline"],
  states: ["sections"],
  accessibility: [
    "Each section is a heading followed by a list, so screen readers say how many photos it holds",
    "Tiles keep their own names",
  ],
  motion: ["Only new arrivals develop; scrolling never animates"],
  native: {
    ios: "LazyVGrid with three flexible columns, 2 pt spacing and pinned section headers",
    android: "LazyVerticalGrid(GridCells.Fixed(3)) with 2 dp spacing; section headers span the row",
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [{ version: "1.0.0", date: "2026-10-29", summary: "First version." }],
};
