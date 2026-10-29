import type { Example } from "@workspace/types";
import { SectionHeader } from "./SectionHeader";

export const examples: Example[] = [
  {
    id: "detail",
    title: "With a count",
    state: "with detail",
    render: () => (
      <div className="ex-phone">
        <SectionHeader title="Today" detail="12 photos" />
      </div>
    ),
  },
  {
    id: "title",
    title: "Title only",
    state: "title only",
    render: () => (
      <div className="ex-phone">
        <SectionHeader title="Yesterday" />
      </div>
    ),
  },
];
