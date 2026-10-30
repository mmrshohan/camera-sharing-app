import type { CameraCounts } from "@shared/types";
import type { Example } from "@workspace/types";
import { CameraStatusLine } from "./CameraStatusLine";

const zero: CameraCounts = {
  sent: 0,
  sending: 0,
  waitingInternet: 0,
  waitingWifi: 0,
  preparing: 0,
};

const line = (counts: CameraCounts) => (
  <div className="ex-camera">
    <CameraStatusLine counts={counts} onPress={() => {}} />
  </div>
);

export const examples: Example[] = [
  {
    id: "sending",
    title: "Sending",
    state: "sending",
    layout: "compact",
    render: () => line({ ...zero, sent: 4, sending: 1 }),
  },
  {
    id: "wifi",
    title: "Waiting for Wi-Fi",
    state: "waiting for Wi-Fi",
    layout: "compact",
    render: () => line({ ...zero, sent: 4, sending: 1, waitingWifi: 2 }),
  },
  {
    id: "none",
    title: "Nothing yet",
    state: "nothing yet",
    layout: "compact",
    render: () => line(zero),
  },
];
