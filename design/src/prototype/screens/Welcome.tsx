import { devices } from "@components/DeviceFrame";
import { InlineMessage } from "@components/InlineMessage";
import { SignInButton } from "@components/SignInButton";
import { Text } from "@components/Text";
import { strings as s } from "@prototype/copy/welcome";
import type { DeviceId, SignInMethod } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import { ScreenBody } from "./parts";

export const screenId = "screens/Welcome";

export function Welcome({ id }: { id: DeviceId }) {
  const { device, dispatch } = useDeviceView(id);
  const offline = device.network === "offline";
  // Each platform's own sign-in comes first.
  const methods: Exclude<SignInMethod, "passkey">[] =
    devices[device.model].platform === "ios" ? ["apple", "google"] : ["google"];
  const notice = offline ? (
    <InlineMessage tone="waiting" icon="offline" title={s.offlineTitle} body={s.offlineBody} />
  ) : device.ui.notice === "signInFailed" ? (
    <InlineMessage tone="problem" title={s.failedTitle} body={s.failedBody} />
  ) : device.ui.notice === "signInCanceled" ? (
    <InlineMessage tone="neutral" title={s.canceledTitle} body={s.canceledBody} />
  ) : null;

  return (
    <ScreenBody
      bar={
        <div className="stack">
          {methods.map((method) => (
            <SignInButton
              key={method}
              provider={method}
              action="continue"
              fullWidth
              disabled={offline}
              onPress={() => dispatch({ type: "signIn", device: id, method })}
            />
          ))}
        </div>
      }
    >
      <div className="welcome">
        <Text style="largeTitle" as="h1">
          {s.title}
        </Text>
        <Text style="body" as="p" tone="ink2">
          {s.body}
        </Text>
        {notice && <div className="welcome__notice">{notice}</div>}
      </div>
    </ScreenBody>
  );
}
