import { samplePhotos } from "@workspace/samples";
import type { Example } from "@workspace/types";
import { PhotoGrid } from "./PhotoGrid";

const [a, b, c] = samplePhotos as [
  (typeof samplePhotos)[number],
  (typeof samplePhotos)[number],
  (typeof samplePhotos)[number],
];

export const examples: Example[] = [
  {
    id: "sections",
    title: "Today and yesterday",
    state: "sections",
    render: () => (
      <div className="ex-phone ex-phone--framed">
        <PhotoGrid
          sections={[
            {
              id: "today",
              title: "Today",
              detail: "6 photos",
              tiles: [
                { image: a, status: "arriving", progress: 0.4, label: "Photo 6" },
                { image: b, status: "onlyInApp", label: "Photo 5", onOpen: () => {} },
                { image: c, status: "saving", progress: 0.7, label: "Photo 4", onOpen: () => {} },
                { image: a, status: "saved", label: "Photo 3", onOpen: () => {} },
                { image: b, status: "needsChecking", label: "Photo 2", onOpen: () => {} },
                { image: c, status: "saved", label: "Photo 1", onOpen: () => {} },
              ],
            },
            {
              id: "yesterday",
              title: "Yesterday",
              detail: "3 photos",
              tiles: [
                { image: c, status: "saved", label: "Photo 3", onOpen: () => {} },
                { image: a, status: "saved", label: "Photo 2", onOpen: () => {} },
                { image: b, status: "expired", label: "Photo 1" },
              ],
            },
          ]}
        />
      </div>
    ),
  },
];
