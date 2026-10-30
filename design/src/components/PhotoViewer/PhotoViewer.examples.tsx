import { Button } from "@components/Button";
import { StatusLabel } from "@components/StatusLabel";
import { samplePhotos } from "@workspace/samples";
import type { Example } from "@workspace/types";
import { PhotoViewer } from "./PhotoViewer";

const photo = samplePhotos[1] ?? { src: "/images/coast.jpg", position: "50% 50%", zoom: 2 };

export const examples: Example[] = [
  {
    id: "only-in-app",
    title: "Only in this app",
    state: "only in this app",
    render: () => (
      <div className="ex-phone ex-phone--framed ex-phone--tall">
        <PhotoViewer
          image={photo}
          title="Today, 2:14 PM"
          status={<StatusLabel kind="neutral">Only in this app</StatusLabel>}
          footer={
            <>
              <Button variant="filled" onPress={() => {}}>
                Save to Photos
              </Button>
              <Button variant="destructive" onPress={() => {}}>
                Delete from this app
              </Button>
            </>
          }
          onClose={() => {}}
        />
      </div>
    ),
  },
];
