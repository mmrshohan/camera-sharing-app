import { useMemo, useRef, useState } from "react";
import { Button } from "@components/Button";
import { DeviceFrame, devices } from "@components/DeviceFrame";
import { Panel } from "@components/Panel";
import { PermissionPrompt } from "@components/PermissionPrompt";
import { strings as purposes } from "@prototype/copy/permissions";
import type { DeviceId, PanelId, PromptKind, World, WorldEvent } from "@prototype/model/types";
import { panelNames, panels } from "@prototype/panels";
import { routeNames, screens } from "@prototype/screens";
import { DeviceViewContext, useDeviceView } from "./deviceView";

export { useDeviceView, type DeviceView } from "./deviceView";

/** Until a route's screen is built, the phone shows the route's name. */
function PendingScreen({ id }: { id: DeviceId }) {
  const { device } = useDeviceView(id);
  return (
    <div className="proto-pending">
      <p>{routeNames[device.ui.route]}</p>
    </div>
  );
}

function PendingPanel({ id }: { id: DeviceId }) {
  const { device, dispatch, screen } = useDeviceView(id);
  const close = () => dispatch({ type: "closePanel", device: id });
  const panel = device.ui.panel;
  return (
    <Panel
      open={panel !== null}
      title={panel ? panelNames[panel] : ""}
      onClose={close}
      container={screen}
    >
      <Button variant="tinted" onPress={close}>
        Close
      </Button>
    </Panel>
  );
}

/** One phone: its frame, the screen for its route, and its panel and system prompt. */
export function DeviceHost({
  id,
  world,
  dispatch,
  scale,
}: {
  id: DeviceId;
  world: World;
  dispatch: (event: WorldEvent) => void;
  scale: number;
}) {
  const device = world.devices[id];
  const [screen, setScreen] = useState<HTMLDivElement | null>(null);
  const { route, panel, prompt } = device.ui;
  const platform = devices[device.model].platform;
  const Screen = screens[route] ?? PendingScreen;
  // The last panel stays mounted after it closes, so it can animate out.
  const lastPanel = useRef<PanelId | null>(null);
  if (panel) lastPanel.current = panel;
  const shownPanel = panel ?? lastPanel.current;
  const PanelView = shownPanel ? (panels[shownPanel] ?? PendingPanel) : null;

  // The prompt stays mounted after it is answered, so it can fade out.
  const lastPrompt = useRef<PromptKind | null>(null);
  if (prompt) lastPrompt.current = prompt;
  const kind = prompt ?? lastPrompt.current;
  // Android saves to MediaStore without asking, so it never shows a Photos prompt.
  const showPrompt = kind !== null && !(platform === "android" && kind === "photosAddOnly");

  const view = useMemo(
    () => ({ device, world, dispatch, screen }),
    [device, world, dispatch, screen],
  );
  return (
    <DeviceViewContext.Provider value={view}>
      <DeviceFrame
        model={device.model}
        theme={device.theme}
        textSize={device.textSize}
        reduceMotion={false}
        screenRef={setScreen}
        scale={scale}
        // A new screen, phone, theme or text size takes the keyboard down (D21).
        routeKey={`${route}:${device.model}:${device.theme}:${device.textSize}`}
      >
        <div className="proto-screen" data-route={route}>
          <Screen id={id} />
        </div>
        {PanelView && <PanelView id={id} />}
        {showPrompt && kind && (
          <PermissionPrompt
            platform={platform}
            kind={kind}
            appName="Camera Sharing"
            purpose={purposes[kind]}
            open={prompt !== null}
            onAllow={() => dispatch({ type: "permission", device: id, kind, allow: true })}
            onDeny={() => dispatch({ type: "permission", device: id, kind, allow: false })}
            container={screen}
          />
        )}
      </DeviceFrame>
    </DeviceViewContext.Provider>
  );
}
