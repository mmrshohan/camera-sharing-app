import { useState } from "react";
import { Button } from "@components/Button";
import type { Platform } from "@tokens";
import { ExampleScreen } from "@workspace/ExampleScreen";
import type { Example } from "@workspace/types";
import { PermissionPrompt, type PermissionKind } from "./PermissionPrompt";

// Placeholder purpose strings until the prototype's copy is written.
const purposes: Record<PermissionKind, string> = {
  camera: "Takes the photos you send to the phone you’re paired with.",
  photosAddOnly: "Saves the photos you receive to your library.",
  notifications: "",
};

function Demo({ kind, platform }: { kind: PermissionKind; platform: Platform }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("none yet");
  if (platform === "android" && kind === "photosAddOnly") {
    return (
      <ExampleScreen>
        {() => (
          <div className="ex-screen__center">
            <span className="ex-count">
              Android doesn’t ask: saving to MediaStore needs no permission.
            </span>
          </div>
        )}
      </ExampleScreen>
    );
  }
  const answered = (choice: string) => {
    setAnswer(choice);
    setOpen(false);
  };
  return (
    <ExampleScreen>
      {(screen) => (
        <>
          <div className="ex-screen__center ex-pressable">
            <Button variant="tinted" onPress={() => setOpen(true)}>
              Ask
            </Button>
            <span className="ex-count">Answer: {answer}</span>
          </div>
          <PermissionPrompt
            platform={platform}
            kind={kind}
            appName="Camera Sharing"
            purpose={purposes[kind]}
            open={open}
            onAllow={() => answered("allowed")}
            onDeny={() => answered("not allowed")}
            container={screen}
          />
        </>
      )}
    </ExampleScreen>
  );
}

export const examples: Example[] = [
  {
    id: "camera",
    title: "Camera",
    state: "camera",
    render: (surface) => <Demo kind="camera" platform={surface.platform} />,
  },
  {
    id: "photos",
    title: "Saving to Photos",
    state: "photosAddOnly",
    render: (surface) => <Demo kind="photosAddOnly" platform={surface.platform} />,
  },
  {
    id: "notifications",
    title: "Notifications",
    state: "notifications",
    render: (surface) => <Demo kind="notifications" platform={surface.platform} />,
  },
];
