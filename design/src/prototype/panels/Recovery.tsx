import { useRef } from "react";
import { Button } from "@components/Button";
import { InlineMessage } from "@components/InlineMessage";
import { Panel } from "@components/Panel";
import { Text } from "@components/Text";
import { strings as s } from "@prototype/copy/recovery";
import { deadline } from "@prototype/copy/time";
import { people } from "@prototype/model/fixtures";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import "@prototype/screens/screens.css";

export const screenId = "panels/Recovery";

/** Photos taken offline go out only when both phones approve, by the original deadline (R7). */
export function Recovery({ id }: { id: DeviceId }) {
  const { device, world, dispatch, screen } = useDeviceView(id);
  const explanation = useRef<HTMLDivElement>(null);
  const recovery = world.recovery;
  if (!recovery) return null;

  // On the receiving phone, the photos come to this phone, not "to Sarah".
  const to = id === "alex" ? (world.session?.recipient.name ?? people.sarah.name) : s.thisPhone;
  const approvedHere = id === "alex" ? recovery.approvals.host : recovery.approvals.recipient;
  const close = () => dispatch({ type: "closePanel", device: id });
  const closeButton = (
    <Button variant="tinted" fullWidth onPress={close}>
      {s.close}
    </Button>
  );

  let body = null;
  if (recovery.state === "needed") {
    body = (
      <>
        <div ref={explanation} tabIndex={-1} className="panel-focus">
          <Text style="body" as="p">
            {s.body(recovery.photoIds.length, to, deadline(recovery.expiresAt))}
          </Text>
        </div>
        {/* No Try again: only both approvals send these photos (D1). */}
        {approvedHere ? (
          <InlineMessage tone="waiting" title={s.waiting} />
        ) : (
          <div className="panel-actions">
            <Button
              variant="filled"
              fullWidth
              onPress={() => dispatch({ type: "approveRecovery", by: id })}
            >
              {s.approve}
            </Button>
            <Button
              variant="plain"
              fullWidth
              onPress={() => dispatch({ type: "declineRecovery", by: id })}
            >
              {s.dontSend}
            </Button>
          </div>
        )}
      </>
    );
  } else if (recovery.state === "declined") {
    body = (
      <>
        <InlineMessage tone="neutral" title={s.declined} />
        {closeButton}
      </>
    );
  } else if (recovery.state === "expired") {
    body = (
      <>
        <InlineMessage tone="problem" title={s.expired} />
        {closeButton}
      </>
    );
  }

  return (
    <Panel
      open={device.ui.panel === "recovery" && body !== null}
      title={s.title}
      onClose={close}
      // It waits for an answer from this phone.
      dismissible={recovery.state !== "needed"}
      // Focus starts on what is being asked, before either answer.
      initialFocus={explanation}
      container={screen}
    >
      <div className="panel-stack">{body}</div>
    </Panel>
  );
}
