import { useState } from "react";
import { Button } from "@components/Button";
import { EmptyState } from "@components/EmptyState";
import { TextField } from "@components/TextField";
import { TopBar } from "@components/TopBar";
import type { DeviceModel } from "@shared/types";
import type { Example } from "@workspace/types";
import { DeviceFrame } from "./DeviceFrame";
import { devices } from "./devices";

/** Enter moves to a screen without a field: the keyboard goes down in the same frame (D21). */
function KeyboardDemo() {
  const [screen, setScreen] = useState<"username" | "done">("username");
  const [name, setName] = useState("");
  return (
    <DeviceFrame
      model="iphone16pro"
      theme="light"
      textSize="default"
      reduceMotion={false}
      scale={0.5}
      routeKey={screen}
    >
      <div className="ex-device-screen">
        {screen === "username" ? (
          <>
            <TopBar title="Choose a username" />
            <div className="ex-device-body">
              <TextField
                label="Username"
                prefix="@"
                placeholder="yourname"
                value={name}
                onChange={setName}
                onSubmit={() => setScreen("done")}
              />
            </div>
          </>
        ) : (
          <>
            <TopBar title="All set" />
            <div className="ex-device-body">
              <Button variant="plain" onPress={() => setScreen("username")}>
                Back
              </Button>
            </div>
          </>
        )}
      </div>
    </DeviceFrame>
  );
}

const phone = (model: DeviceModel): Example => ({
  id: model,
  title: devices[model].name,
  state:
    model === "iphone16pro"
      ? "iPhone 16 Pro"
      : model === "iphoneSE3"
        ? "iPhone SE"
        : model === "galaxyA15"
          ? "Galaxy A15"
          : "Compact Android",
  layout: "compact",
  render: (ctx) => (
    <DeviceFrame
      model={model}
      theme={ctx.theme}
      textSize={ctx.textSize}
      reduceMotion={ctx.reduceMotion}
      scale={0.42}
    >
      <div className="ex-device-screen">
        <TopBar title="Your photos" />
        <EmptyState
          icon="photos"
          title="No photos yet"
          body="Photos from a camera you borrow arrive here."
        />
      </div>
    </DeviceFrame>
  ),
});

export const examples: Example[] = [
  {
    id: "keyboard",
    title: "The keyboard follows focus",
    state: "keyboard",
    layout: "compact",
    render: () => <KeyboardDemo />,
  },
  phone("iphone16pro"),
  phone("iphoneSE3"),
  phone("galaxyA15"),
  phone("androidCompact"),
];
