import { useState } from "react";
import { Shutter } from "@components/Shutter";
import { nthSample, samplePhotos } from "@workspace/samples";
import type { Example } from "@workspace/types";
import { LastShotWell } from "./LastShotWell";

function Dropping() {
  const [photos, setPhotos] = useState(0);
  return (
    <div className="ex-camera ex-camera--row">
      <LastShotWell image={nthSample(photos)} dropKey={photos} onOpen={() => {}} />
      <Shutter state="ready" onCapture={() => setPhotos((n) => n + 1)} />
    </div>
  );
}

export const examples: Example[] = [
  {
    id: "empty",
    title: "Before the first photo",
    state: "empty",
    layout: "compact",
    render: () => (
      <div className="ex-camera">
        <LastShotWell image={null} dropKey={0} onOpen={() => {}} />
      </div>
    ),
  },
  {
    id: "photo",
    title: "The last photo",
    state: "last photo",
    layout: "compact",
    render: () => (
      <div className="ex-camera">
        <LastShotWell image={samplePhotos[0] ?? null} dropKey={0} onOpen={() => {}} />
      </div>
    ),
  },
  {
    id: "drop",
    title: "Press the shutter: a photo drops in",
    state: "drop",
    layout: "compact",
    render: () => <Dropping />,
  },
];
