import { useState } from "react";
import { Button } from "@components/Button";
import { ChoiceChips } from "@components/ChoiceChips";
import { InlineMessage } from "@components/InlineMessage";
import { TextField } from "@components/TextField";
import { Toggle } from "@components/Toggle";
import { strings as s } from "@prototype/copy/settings";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import { SettingsPage } from "./Page";

export const screenId = "screens/settings/Report";

type Reason = "delivery" | "unwanted";

export function Report({ id }: { id: DeviceId }) {
  const { device, dispatch } = useDeviceView(id);
  const [reason, setReason] = useState<Reason | null>(null);
  const [details, setDetails] = useState("");
  const [block, setBlock] = useState(false);
  const sent = device.ui.notice === "reportSent";
  return (
    <SettingsPage
      id={id}
      title={s.report}
      {...(!sent && {
        bar: (
          <Button
            variant="filled"
            fullWidth
            disabled={reason === null}
            onPress={() => dispatch({ type: "sendReport", device: id, block })}
          >
            {s.send}
          </Button>
        ),
      })}
    >
      {sent ? (
        <InlineMessage tone="neutral" title={s.sent} body={s.sentBody} />
      ) : (
        <>
          <ChoiceChips
            label={s.reason}
            options={[
              { id: "delivery", label: s.delivery },
              { id: "unwanted", label: s.unwanted },
            ]}
            value={reason}
            onChange={setReason}
          />
          <TextField label={s.details} value={details} onChange={setDetails} />
          {/* Blocking is offered where the problem is reported (D17). */}
          <Toggle checked={block} onChange={setBlock} label={s.block} description={s.blockNote} />
        </>
      )}
    </SettingsPage>
  );
}
