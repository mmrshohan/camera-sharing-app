import { Button } from "@components/Button";
import { devices } from "@components/DeviceFrame";
import { Icon } from "@components/Icon";
import { InlineMessage } from "@components/InlineMessage";
import { Text } from "@components/Text";
import { strings as s } from "@prototype/copy/lock";
import { cameraStatusText } from "@prototype/copy/plural";
import { people } from "@prototype/model/fixtures";
import { delivery } from "@prototype/model/selectors";
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
  const d = delivery(world);
  const { preparing, sending, waitingInternet, waitingWifi } = d.onPhone;
  // The first of these that holds: anything later would claim too much.
  const status =
    preparing + sending + waitingInternet + waitingWifi > 0
      ? s.onPhone(cameraStatusText(d.onPhone))
      : d.needApproval > 0
        ? s.needApproval(d.needApproval)
        : d.waiting > 0
          ? s.waitingFor(d.waiting, to)
          : d.lost > 0
            ? s.lost(d.lost, to)
            : d.reached > 0
              ? s.reached(d.reached, to)
              : s.none;

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
          {status}
        </Text>
        {device.ui.notice === "authCanceled" && (
          <div className="lock__notice">
            <InlineMessage tone="neutral" icon="lock" title={s.canceled} />
          </div>
        )}
      </div>
    </ScreenBody>
  );
}
