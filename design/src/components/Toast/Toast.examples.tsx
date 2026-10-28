import { Shutter } from "@components/Shutter";
import type { Example } from "@workspace/types";
import { Toast } from "./Toast";

export const examples: Example[] = [
  {
    id: "above-controls",
    title: "Above the camera controls, clear of the shutter",
    state: "aboveControls",
    render: () => (
      <div className="ex-camera ex-screen">
        <div className="ex-controls">
          <Shutter state="ready" onCapture={() => {}} />
        </div>
        <Toast placement="aboveControls" message="Sent to Sarah" />
      </div>
    ),
  },
  {
    id: "top",
    title: "At the top",
    state: "top",
    render: () => (
      <div className="ex-screen">
        <Toast placement="top" message="Connected to Sarah's phone" />
      </div>
    ),
  },
  {
    id: "hidden",
    title: "Hidden: nothing to say",
    state: "hidden",
    render: () => (
      <div className="ex-screen">
        <Toast placement="top" message={null} />
      </div>
    ),
  },
];
