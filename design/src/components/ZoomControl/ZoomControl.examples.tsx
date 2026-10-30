import { useState } from "react";
import type { Example } from "@workspace/types";
import { ZoomControl } from "./ZoomControl";

function Live() {
  const [level, setLevel] = useState(1);
  return (
    <div className="ex-camera">
      <ZoomControl options={[0.5, 1, 2, 5]} value={level} onChange={setLevel} />
    </div>
  );
}

export const examples: Example[] = [
  {
    id: "chosen",
    title: "Tap a level",
    state: "chosen",
    layout: "compact",
    render: () => <Live />,
  },
];
