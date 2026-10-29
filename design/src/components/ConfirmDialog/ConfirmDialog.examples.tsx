import { useState } from "react";
import { Button } from "@components/Button";
import { ExampleScreen } from "@workspace/ExampleScreen";
import type { Example } from "@workspace/types";
import { ConfirmDialog } from "./ConfirmDialog";

function Demo({ destructive }: { destructive: boolean }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("none yet");
  const close = (choice: string) => {
    setAnswer(choice);
    setOpen(false);
  };
  return (
    <ExampleScreen>
      {(screen) => (
        <>
          <div className="ex-screen__center ex-pressable">
            {destructive ? (
              <Button variant="destructive" onPress={() => setOpen(true)}>
                Delete from this app
              </Button>
            ) : (
              <Button variant="tinted" onPress={() => setOpen(true)}>
                Save another copy
              </Button>
            )}
            <span className="ex-count">Answer: {answer}</span>
          </div>
          {destructive ? (
            <ConfirmDialog
              open={open}
              destructive
              title="Delete this photo?"
              message="It's only in this app, so deleting it can't be undone."
              confirmLabel="Delete"
              cancelLabel="Keep"
              onConfirm={() => close("Delete")}
              onCancel={() => close("Keep")}
              container={screen}
            />
          ) : (
            <ConfirmDialog
              open={open}
              title="Save another copy?"
              message="Photos might then have this photo twice."
              confirmLabel="Save copy"
              cancelLabel="Cancel"
              onConfirm={() => close("Save copy")}
              onCancel={() => close("Cancel")}
              container={screen}
            />
          )}
        </>
      )}
    </ExampleScreen>
  );
}

export const examples: Example[] = [
  {
    id: "destructive",
    title: "Destructive: an action sheet on iOS",
    state: "destructive",
    render: () => <Demo destructive />,
  },
  {
    id: "alert",
    title: "Not destructive: an alert",
    state: "not destructive",
    render: () => <Demo destructive={false} />,
  },
];
