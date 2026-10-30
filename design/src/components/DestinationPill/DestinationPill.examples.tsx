import { useState } from "react";
import { Shutter } from "@components/Shutter";
import type { Example } from "@workspace/types";
import { DestinationPill } from "./DestinationPill";

function Pulsing() {
  const [photos, setPhotos] = useState(0);
  return (
    <div className="ex-camera ex-camera--stack">
      <DestinationPill name="Sarah" pulseKey={photos} onPress={() => {}} />
      <Shutter state="ready" onCapture={() => setPhotos((n) => n + 1)} />
    </div>
  );
}

export const examples: Example[] = [
  {
    id: "rest",
    title: "At rest",
    state: "at rest",
    layout: "compact",
    render: () => (
      <div className="ex-camera">
        <DestinationPill name="Sarah" pulseKey={0} onPress={() => {}} />
      </div>
    ),
  },
  {
    id: "pulse",
    title: "Press the shutter: it pulses",
    state: "pulse",
    layout: "compact",
    render: () => <Pulsing />,
  },
];
