import { useState } from "react";
import { Button } from "@components/Button";
import type { TileStatus } from "@shared/types";
import { samplePhotos } from "@workspace/samples";
import type { Example } from "@workspace/types";
import { PhotoTile } from "./PhotoTile";

const photo = samplePhotos[0] ?? { src: "/images/coast.jpg", position: "50% 50%", zoom: 2 };

function Arriving() {
  const [arrived, setArrived] = useState(false);
  return (
    <span className="ex-pressable">
      <span className="ex-tile">
        <PhotoTile
          image={photo}
          status={arrived ? "onlyInApp" : "arriving"}
          progress={0.8}
          develop={arrived}
          label="Photo 4"
          onOpen={() => {}}
        />
      </span>
      <Button variant="plain" onPress={() => setArrived((done) => !done)}>
        {arrived ? "Reset" : "Arrive"}
      </Button>
    </span>
  );
}

const states: [TileStatus, string, number?][] = [
  ["arriving", "Arriving", 0.4],
  ["onlyInApp", "Only in this app"],
  ["saving", "Saving to Photos", 0.6],
  ["saved", "Saved to Photos"],
  ["needsChecking", "Photos save needs checking"],
  ["expired", "Expired, never arrived"],
];

export const examples: Example[] = [
  ...states.map(([status, title, progress]): Example => ({
    id: status,
    title,
    state: status,
    layout: "compact",
    render: () => (
      <span className="ex-tile">
        {progress === undefined ? (
          <PhotoTile image={photo} status={status} label="Photo 3" onOpen={() => {}} />
        ) : (
          <PhotoTile
            image={photo}
            status={status}
            progress={progress}
            label="Photo 3"
            onOpen={() => {}}
          />
        )}
      </span>
    ),
  })),
  {
    id: "develop",
    title: "Develops on arrival",
    state: "develop",
    layout: "compact",
    render: () => <Arriving />,
  },
];
