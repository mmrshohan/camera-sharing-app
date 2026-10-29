import type { Example } from "@workspace/types";
import { HomeIndicator, type HomeIndicatorProps } from "./HomeIndicator";

const strip = (kind: HomeIndicatorProps["kind"]) => (
  <div className="ex-strip">
    <HomeIndicator kind={kind} />
  </div>
);

export const examples: Example[] = [
  {
    id: "ios",
    title: "iOS home indicator",
    state: "homeIndicator",
    render: () => strip("homeIndicator"),
  },
  {
    id: "gesture",
    title: "Android gestures",
    state: "gestureBar",
    render: () => strip("gestureBar"),
  },
  {
    id: "buttons",
    title: "Android three buttons",
    state: "threeButton",
    render: () => strip("threeButton"),
  },
];
