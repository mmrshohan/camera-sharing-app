import type { Example } from "@workspace/types";
import { Numeral } from "./Numeral";

export const examples: Example[] = [
  {
    id: "count",
    title: "A count",
    state: "count",
    render: () => (
      <div className="ex-phone">
        <Numeral value={3} caption="photos" detail="from today" />
      </div>
    ),
  },
  {
    id: "live",
    title: "Live, with what is on the way",
    state: "live",
    render: () => (
      <div className="ex-phone">
        <Numeral value={14} caption="photos" detail="2 on the way" live />
      </div>
    ),
  },
];
