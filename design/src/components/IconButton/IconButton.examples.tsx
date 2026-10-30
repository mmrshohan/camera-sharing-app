import type { Example } from "@workspace/types";
import { IconButton } from "./IconButton";

export const examples: Example[] = [
  {
    id: "on-light",
    title: "On the app's surfaces",
    state: "onLight",
    layout: "compact",
    render: () => (
      <span className="ex-row">
        <IconButton icon="back" label="Back" />
        <IconButton icon="close" label="Close" />
        <IconButton icon="more" label="More" />
        <IconButton icon="help" label="Help" />
      </span>
    ),
  },
  {
    id: "on-camera",
    title: "Over the camera",
    state: "onCamera",
    layout: "compact",
    render: () => (
      <div className="ex-camera">
        <span className="ex-row">
          <IconButton icon="flashOff" label="Flash off" tone="onCamera" />
          <IconButton icon="flip" label="Flip camera" tone="onCamera" />
          <IconButton icon="close" label="Close" tone="onCamera" />
        </span>
      </div>
    ),
  },
  {
    id: "pressed",
    title: "Press and hold",
    state: "pressed",
    layout: "compact",
    render: () => <IconButton icon="more" label="More" />,
  },
];
