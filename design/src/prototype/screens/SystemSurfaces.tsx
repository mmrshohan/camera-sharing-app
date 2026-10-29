import { devices } from "@components/DeviceFrame";
import { LiveActivity, type LiveActivityProps } from "@components/LiveActivity";
import { ProgressNotification } from "@components/ProgressNotification";
import { dateLine } from "@prototype/copy/time";
import { samples } from "@prototype/model/fixtures";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";

export const screenId = "screens/SystemSurfaces";

const wallpaper = samples["coast-05"];

/**
 * The phone's own Lock Screen or notification shade while the app is closed: a Live Activity on
 * iPhone, the progress notification on Android, for photos arriving from Alex's camera.
 */
export function SystemSurfaces({ id }: { id: DeviceId }) {
  const { device, world } = useDeviceView(id);
  const platform = devices[device.model].platform;
  const session = world.session;
  const current = session ? device.gallery.filter((p) => p.sessionId === session.id) : [];
  const arriving = current.filter((p) => p.stage === "arriving");
  const received = current.filter(
    (p) => !["arriving", "canceled", "expired"].includes(p.stage),
  ).length;
  const state: LiveActivityProps["state"] | null =
    session?.state === "active"
      ? arriving.length > 0
        ? "arriving"
        : "connected"
      : session?.state === "ended" && arriving.length === 0 && received > 0
        ? "done"
        : null;
  // Real progress only: the average of what is downloading, or none.
  const progress =
    arriving.length > 0 ? arriving.reduce((sum, p) => sum + p.progress, 0) / arriving.length : null;
  const shade = device.ui.system === "notificationShade" && platform === "android";
  const from = session?.host.name ?? "";

  return (
    <div
      className={shade ? "system-surface system-surface--shade" : "system-surface"}
      data-status-bar="light"
      data-theme="dark"
      style={
        wallpaper && {
          backgroundImage: `url("${wallpaper.src}")`,
          backgroundPosition: wallpaper.position,
          backgroundSize: `${wallpaper.zoom * 100}%`,
        }
      }
    >
      <div className="system-surface__clock">
        <span className="system-surface__date">{dateLine(world.clock)}</span>
        <span className="system-surface__time">9:41</span>
      </div>
      <div className="system-surface__activity">
        {state &&
          (platform === "ios" ? (
            <LiveActivity
              variant="lockScreen"
              from={from}
              received={received}
              arriving={arriving.length}
              state={state}
            />
          ) : (
            <ProgressNotification
              from={from}
              received={received}
              arriving={arriving.length}
              progress={state === "arriving" ? progress : null}
            />
          ))}
      </div>
    </div>
  );
}
