import { useState } from "react";
import { Button } from "@components/Button";
import { Text } from "@components/Text";
import { ExampleScreen } from "@workspace/ExampleScreen";
import type { Example } from "@workspace/types";
import { Panel, type PanelProps } from "./Panel";

function Demo({ detent, dismissible = true }: Pick<PanelProps, "detent" | "dismissible">) {
  const [open, setOpen] = useState(false);
  return (
    <ExampleScreen>
      {(screen) => (
        <>
          <div className="ex-screen__center">
            <Button variant="tinted" onPress={() => setOpen(true)}>
              Show my code
            </Button>
          </div>
          <Panel
            open={open}
            onClose={() => setOpen(false)}
            title="Your code"
            container={screen}
            detent={detent ?? "medium"}
            dismissible={dismissible}
          >
            <div className="ex-stack">
              <Text style="body" as="p" tone="ink2">
                Alex scans this to lend you their camera.
              </Text>
              {!dismissible && (
                <Button variant="filled" fullWidth onPress={() => setOpen(false)}>
                  Done
                </Button>
              )}
            </div>
          </Panel>
        </>
      )}
    </ExampleScreen>
  );
}

export const examples: Example[] = [
  { id: "medium", title: "Medium", state: "medium", render: () => <Demo detent="medium" /> },
  { id: "large", title: "Large", state: "large", render: () => <Demo detent="large" /> },
  {
    id: "drag",
    title: "Drag down to dismiss",
    state: "dismissible",
    render: () => <Demo detent="medium" />,
  },
  {
    id: "answer",
    title: "Not dismissible: it needs an answer",
    state: "not dismissible",
    render: () => <Demo detent="medium" dismissible={false} />,
  },
];
