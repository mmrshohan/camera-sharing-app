import { Button } from "@components/Button";
import { devices } from "@components/DeviceFrame";
import { InvitationCode, type InvitationState } from "@components/InvitationCode";
import { Panel } from "@components/Panel";
import { strings as s } from "@prototype/copy/invitation";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import "@prototype/screens/screens.css";

export const screenId = "panels/Invitation";

/** Sarah's code for Alex to scan: a countdown only while it is active (D19). */
export function Invitation({ id }: { id: DeviceId }) {
  const { device, world, dispatch, screen } = useDeviceView(id);
  const expiresAt = device.ui.inviteExpiresAt;
  const seconds =
    expiresAt === null ? null : Math.max(0, Math.ceil((expiresAt - world.clock) / 1000));
  const state: InvitationState =
    expiresAt === null || device.network === "offline"
      ? "offline"
      : seconds === 0
        ? "expired"
        : "active";
  const username = device.username ?? "";

  return (
    <Panel
      open={device.ui.panel === "invitation"}
      title={s.title}
      onClose={() => dispatch({ type: "closePanel", device: id })}
      container={screen}
      // The code, its countdown and the actions fit without scrolling on the smallest phones.
      detent="large"
    >
      <div className="panel-stack">
        <InvitationCode
          payload={`camera-sharing:invite:${username}:${expiresAt ?? 0}`}
          handle={`@${username}`}
          device={devices[device.model].name}
          state={state}
          secondsLeft={state === "active" ? seconds : null}
        />
        {state === "expired" && (
          <Button
            variant="filled"
            fullWidth
            onPress={() => dispatch({ type: "openPanel", device: id, panel: "invitation" })}
          >
            {s.refresh}
          </Button>
        )}
        {/* Also gives keyboard users a stop in the panel when the code scrolls on small phones. */}
        <Button
          variant="plain"
          fullWidth
          onPress={() => dispatch({ type: "closePanel", device: id })}
        >
          {s.done}
        </Button>
      </div>
    </Panel>
  );
}
