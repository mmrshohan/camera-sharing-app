import { createContext, useContext, useMemo, useRef, useState } from "react";
import { Button } from "@components/Button";
import { DeviceFrame, devices } from "@components/DeviceFrame";
import { Panel } from "@components/Panel";
import { PermissionPrompt } from "@components/PermissionPrompt";
import { strings as purposes } from "@prototype/copy/permissions";
import type { DeviceId, DeviceState, PromptKind, World, WorldEvent } from "@prototype/model/types";
import { panelNames, panels } from "@prototype/panels";
import { routeNames, screens } from "@prototype/screens";

export interface DeviceView {
  device: DeviceState;
  world: World;
  dispatch: (event: WorldEvent) => void;
  /** The phone's screen, where panels, dialogs and prompts open. */
  screen: HTMLElement | null;
}

const DeviceViewContext = createContext<DeviceView | null>(null);

/** A screen's view of its own phone. */
export function useDeviceView(id: DeviceId): DeviceView {
  const view = useContext(DeviceViewContext);
  if (view?.device.id !== id)
    throw new Error(`useDeviceView("${id}") must be used inside its DeviceHost`);
  return view;
}

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
  if (!device.ui.panel) return null;
  return (
    <Panel open title={panelNames[device.ui.panel]} onClose={close} container={screen}>
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
  const PanelView = panel ? (panels[panel] ?? PendingPanel) : null;

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
