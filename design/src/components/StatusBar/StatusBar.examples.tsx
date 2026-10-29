import type { DeviceModel } from "@shared/types";
import type { Example } from "@workspace/types";
import { devices } from "../DeviceFrame/devices";
import { StatusBar } from "./StatusBar";

const bar = (model: DeviceModel) => (
  <div
    className="ex-status"
    style={{ width: devices[model].width, height: devices[model].statusBar }}
  >
    <StatusBar model={model} />
  </div>
);

export const examples: Example[] = [
  {
    id: "island",
    title: "iPhone 16 Pro",
    state: "iPhone with island",
    render: () => bar("iphone16pro"),
  },
  { id: "se", title: "iPhone SE", state: "iPhone SE", render: () => bar("iphoneSE3") },
  { id: "android", title: "Galaxy A15", state: "Android", render: () => bar("galaxyA15") },
];
