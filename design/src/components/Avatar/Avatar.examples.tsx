import type { Example } from "@workspace/types";
import { Avatar } from "./Avatar";

export const examples: Example[] = [
  {
    id: "sizes",
    title: "Initials, at 36, 40 and 44 pt",
    state: "initials",
    layout: "compact",
    render: () => (
      <span className="ex-row">
        <Avatar name="Sarah" size={36} />
        <Avatar name="Alex" size={40} />
        <Avatar name="Sarah Khan" size={44} />
      </span>
    ),
  },
  {
    id: "decorative",
    title: "Decorative, beside the name",
    state: "decorative",
    layout: "compact",
    render: () => (
      <span className="ex-row">
        <Avatar name="Sarah" size={40} decorative />
        <span>Sarah</span>
      </span>
    ),
  },
];
