import type { Example } from "@workspace/types";
import { PersonPair } from "./PersonPair";

export const examples: Example[] = [
  {
    id: "pair",
    title: "Alex lends to Sarah",
    state: "pair",
    render: () => (
      <div className="ex-phone">
        <PersonPair
          from={{ name: "Alex", handle: "@alex", device: "iPhone 16 Pro" }}
          to={{ name: "Sarah", handle: "@sarah", device: "Galaxy A15" }}
          fromTitle="Camera"
          toTitle="Photos go to"
        />
      </div>
    ),
  },
];
