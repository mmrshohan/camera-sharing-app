import type { CSSProperties } from "react";
import { CameraStatusLine } from "@components/CameraStatusLine";
import { DestinationPill } from "@components/DestinationPill";
import { IconButton } from "@components/IconButton";
import { InlineMessage } from "@components/InlineMessage";
import { LastShotWell } from "@components/LastShotWell";
import { PhotoViewer } from "@components/PhotoViewer";
import { Shutter, type ShutterState } from "@components/Shutter";
import { StatusLabel } from "@components/StatusLabel";
import { Text } from "@components/Text";
import { Toast } from "@components/Toast";
import { ZoomControl } from "@components/ZoomControl";
import { strings as s } from "@prototype/copy/camera";
import { samples } from "@prototype/model/fixtures";
import { hostLabel, withRetry } from "@prototype/model/photos";
import { countKey, hostSummary } from "@prototype/model/selectors";
import type { DeviceId, DeviceModel } from "@prototype/model/types";
import { limits } from "@prototype/model/world";
import { useDeviceView } from "@prototype/shell/deviceView";

export const screenId = "screens/Camera";

/** The lenses each phone has, as zoom levels. */
const lenses: Record<DeviceModel, readonly number[]> = {
  iphone16pro: [0.5, 1, 2, 5],
  iphoneSE3: [1, 2],
  galaxyA15: [0.5, 1, 2],
  androidCompact: [1, 2],
};

/** Each of Alex's counts drawn in its label color: done is green, waiting is orange. */
const labelKinds = {
  sent: "saved",
  sending: "sending",
  preparing: "neutral",
  waitingInternet: "waiting",
  waitingWifi: "waiting",
} as const;

/** What the camera sees: a crop of the sample image, closer as it zooms. */
const scene = { back: "coast-07", front: "coast-11" } as const;

const flashOrder = { off: "on", on: "auto", auto: "off" } as const;

/** Alex's camera while he lends it. It always shows where photos go (R1). */
export function Camera({ id }: { id: DeviceId }) {
  const { device, world, dispatch } = useDeviceView(id);
  const { ui } = device;
  const session = world.session;
  const active = session?.state === "active";
  const to = session?.recipient.name ?? "";
  const counts = hostSummary(world);
  const unsent = counts.preparing + counts.sending + counts.waitingInternet + counts.waitingWifi;
  const minutesLeft =
    active && session.endsAt !== null ? Math.ceil((session.endsAt - world.clock) / 60_000) : null;

  // Blocked shows its reason; it is never silently disabled.
  const reason = !active
    ? s.ended
    : device.storageFull
      ? s.storageFull
      : unsent >= limits.queue
        ? s.queueFull
        : null;
  const shutter: ShutterState = reason ? "blocked" : device.busy ? "preparing" : "ready";

  const last = device.hostPhotos.find((p) => p.id === ui.lastShot) ?? null;
  const lastImage = last ? (samples[last.sample] ?? null) : null;
  const view = samples[scene[ui.camera.facing]];
  const sceneStyle: CSSProperties | undefined = view && {
    backgroundImage: `url("${view.src}")`,
    backgroundPosition: view.position,
    backgroundSize: `${view.zoom * ui.camera.zoom * 100}%`,
  };
  const zooms = lenses[device.model];
  const openSession = () => dispatch({ type: "openPanel", device: id, panel: "session" });
  const net = {
    network: device.network,
    connection: device.connection,
    wifiOnly: device.settings.wifiOnly,
  };

  return (
    <div className="camera" data-status-bar="light">
      <div className="camera__scene" style={sceneStyle} aria-hidden="true" />
      <div className="camera__top">
        <IconButton
          icon={ui.camera.flash === "off" ? "flashOff" : "flashOn"}
          label={s.flash[ui.camera.flash]}
          tone="onCamera"
          onPress={() =>
            dispatch({ type: "setCamera", device: id, flash: flashOrder[ui.camera.flash] })
          }
        />
        {/* The pulse key is recorded for the end-to-end tests. */}
        <div className="camera__pill" data-pulse={ui.pulseKey}>
          {active && <DestinationPill name={to} pulseKey={ui.pulseKey} onPress={openSession} />}
        </div>
      </div>
      <div className="camera__notices">
        {ui.notice === "cameraInterrupted" && (
          <InlineMessage tone="problem" title={s.interrupted} />
        )}
        {minutesLeft !== null && minutesLeft <= 2 && (
          <InlineMessage tone="waiting" title={s.endsSoon(minutesLeft)} />
        )}
        {!active && (
          <InlineMessage
            tone="neutral"
            title={s.ended}
            action={{
              label: s.done,
              onPress: () => dispatch({ type: "navigate", device: id, route: "lock" }),
            }}
          />
        )}
      </div>
      <Toast message={ui.toast} placement="top" />
      <div className="camera__controls">
        {zooms.length > 1 && (
          <ZoomControl
            options={zooms}
            value={zooms.includes(ui.camera.zoom) ? ui.camera.zoom : 1}
            onChange={(zoom) => dispatch({ type: "setCamera", device: id, zoom })}
          />
        )}
        <CameraStatusLine counts={counts} onPress={openSession} />
        <div className="camera__row">
          <LastShotWell
            image={lastImage}
            dropKey={ui.dropKey}
            onOpen={() => last && dispatch({ type: "openPhoto", device: id, id: last.id })}
          />
          <Shutter
            state={shutter}
            {...(reason !== null && { message: reason })}
            onCapture={() => dispatch({ type: "capture" })}
          />
          <IconButton
            icon="flip"
            label={s.flip}
            tone="onCamera"
            onPress={() =>
              dispatch({
                type: "setCamera",
                device: id,
                facing: ui.camera.facing === "back" ? "front" : "back",
              })
            }
          />
        </div>
      </div>
      {ui.openPhoto && last && lastImage && (
        <div className="camera__viewer">
          <PhotoViewer
            image={lastImage}
            title={s.lastPhoto}
            status={(() => {
              const label = hostLabel(last, net, to);
              const key = countKey(label);
              return (
                <StatusLabel kind={key ? labelKinds[key] : "neutral"}>
                  {withRetry(label, last.retry)}
                </StatusLabel>
              );
            })()}
            footer={
              <Text style="footnote" as="p" tone="ink2">
                {s.lastPhotoNote}
              </Text>
            }
            onClose={() => dispatch({ type: "closePhoto", device: id })}
          />
        </div>
      )}
    </div>
  );
}
