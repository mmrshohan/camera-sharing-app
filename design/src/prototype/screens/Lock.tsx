import { Button } from "@components/Button";
import { devices } from "@components/DeviceFrame";
import { Icon } from "@components/Icon";
import { InlineMessage } from "@components/InlineMessage";
import { Text } from "@components/Text";
import { strings as s } from "@prototype/copy/lock";
import { people } from "@prototype/model/fixtures";
import { hostSummary } from "@prototype/model/selectors";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import { tokens } from "@tokens";
import { ScreenBody } from "./parts";

export const screenId = "screens/Lock";

const unlockLabels = { faceId: s.faceId, touchId: s.touchId, fingerprint: s.unlock } as const;

/** After lending: what is still on its way, and the owner's own unlock (R4). */
export function Lock({ id }: { id: DeviceId }) {
  const { device, world, dispatch } = useDeviceView(id);
  const spec = devices[device.model];
  const owner = people[id].name;
  const to = world.session?.recipient.name ?? "";
  const counts = hostSummary(world);
  const sending = counts.preparing + counts.sending + counts.waitingInternet + counts.waitingWifi;

  return (
    <ScreenBody
      bar={
        <Button
          variant="filled"
          fullWidth
          onPress={() => dispatch({ type: "unlock", success: true })}
        >
          {unlockLabels[spec.biometric]}
        </Button>
      }
    >
      <div className="lock">
        <Icon name="lock" size={tokens.shape.iconHero} platform={spec.platform} />
        <Text style="title2" as="h1">
          {s.title(owner)}
        </Text>
        <Text style="body" as="p" tone="ink2">
          {sending > 0 ? s.sending(sending, to) : s.delivered}
        </Text>
        <Text style="footnote" as="p" tone="ink2">
          {s.body(owner)}
        </Text>
        {device.ui.notice === "authCanceled" && (
          <div className="lock__notice">
            <InlineMessage tone="neutral" icon="lock" title={s.canceled(owner)} />
          </div>
        )}
      </div>
    </ScreenBody>
  );
}
