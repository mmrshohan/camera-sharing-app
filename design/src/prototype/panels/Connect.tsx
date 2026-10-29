import { useRef } from "react";
import { Button } from "@components/Button";
import { devices } from "@components/DeviceFrame";
import { InlineMessage } from "@components/InlineMessage";
import { Panel } from "@components/Panel";
import { PersonPair } from "@components/PersonPair";
import { Text } from "@components/Text";
import { VerificationWords } from "@components/VerificationWords";
import { strings as s } from "@prototype/copy/connect";
import type { DeviceId } from "@prototype/model/types";
import { minutesSeconds } from "@prototype/screens/parts";
import { useDeviceView } from "@prototype/shell/deviceView";
import "@prototype/screens/screens.css";

export const screenId = "panels/Connect";

/** Both phones approve the same two people, the exact receiving phone and the same words (R2). */
export function Connect({ id }: { id: DeviceId }) {
  const { device, world, dispatch, screen } = useDeviceView(id);
  const words = useRef<HTMLDivElement>(null);
  const session = world.session;
  if (!session) return null;

  const host = id === "alex";
  const other = host ? session.recipient : session.host;
  const pending = session.state === "requested" || session.state === "verifying";
  const approvals =
    session.approvals.attempt === session.attempt
      ? session.approvals
      : { host: false, recipient: false };
  const approved = host ? approvals.host : approvals.recipient;
  const close = () => dispatch({ type: "closePanel", device: id });
  const startAgain = (
    <Button variant="filled" fullWidth onPress={() => dispatch({ type: "startAgain" })}>
      {s.startAgain}
    </Button>
  );

  let title: string = s.title;
  let body = null;
  if (pending) {
    title = host ? s.hostTitle(other.name) : s.recipientTitle(other.name);
    // Each phone's real model, as the person sees it.
    const from = { ...session.host, device: devices[world.devices.alex.model].name };
    const to = { ...session.recipient, device: devices[world.devices.sarah.model].name };
    body = (
      <>
        <PersonPair from={from} to={to} fromTitle={s.fromTitle} toTitle={s.toTitle} />
        <div ref={words} tabIndex={-1} className="panel-focus">
          <VerificationWords words={session.words} prompt={s.words(other.name)} />
        </div>
        <Text style="footnote" as="p" tone="ink2">
          {host ? s.hostFinePrint(other.name) : s.recipientFinePrint(other.name)}
        </Text>
        {approved ? (
          <InlineMessage
            tone="waiting"
            title={s.waiting(
              other.name,
              minutesSeconds((session.expiresAt ?? world.clock) - world.clock),
            )}
          />
        ) : (
          <div className="panel-actions">
            <Button
              variant="filled"
              fullWidth
              onPress={() => dispatch({ type: "approve", by: id })}
            >
              {host ? s.hostAction : s.recipientAction}
            </Button>
            <Button variant="plain" fullWidth onPress={() => dispatch({ type: "decline", by: id })}>
              {s.notNow}
            </Button>
          </div>
        )}
      </>
    );
  } else if (session.state === "mismatch") {
    body = (
      <>
        <InlineMessage tone="problem" title={s.mismatch} />
        {startAgain}
      </>
    );
  } else if (session.state === "deviceChanged") {
    body = (
      <>
        <InlineMessage tone="problem" title={s.deviceChanged(session.recipient.name)} />
        {startAgain}
      </>
    );
  } else if (session.state === "expired") {
    body = (
      <>
        <InlineMessage tone="waiting" title={s.expiredTitle} body={s.expiredBody} />
        {startAgain}
      </>
    );
  } else if (session.state === "declined") {
    body = (
      <>
        <InlineMessage
          tone="neutral"
          title={s.declinedTitle}
          body={host ? s.declinedHost(other.name) : s.declinedRecipient}
        />
        <Button variant="tinted" fullWidth onPress={close}>
          {s.close}
        </Button>
      </>
    );
  }

  return (
    <Panel
      open={device.ui.panel === "connect" && body !== null}
      title={title}
      onClose={close}
      // A request waits for an answer: Not now is the way out (R2).
      dismissible={!pending}
      initialFocus={words}
      container={screen}
      detent={pending ? "large" : "medium"}
    >
      <div className="panel-stack">{body}</div>
    </Panel>
  );
}
