import { useMemo, useRef, useState } from "react";
import { DeviceFrame, devices } from "@components/DeviceFrame";
import { PermissionPrompt } from "@components/PermissionPrompt";
import { strings as purposes } from "@prototype/copy/permissions";
import type { DeviceId, PanelId, PromptKind, World, WorldEvent } from "@prototype/model/types";
import { panels } from "@prototype/panels";
import { screens } from "@prototype/screens";
import { SystemSurfaces } from "@prototype/screens/SystemSurfaces";
import { DeviceViewContext } from "./deviceView";

export { useDeviceView, type DeviceView } from "./deviceView";

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
  // With the Lock Screen or shade shown, the app is closed: no screen, panel or prompt of its own.
  const system = device.ui.system;
  const Screen = system ? SystemSurfaces : screens[route];
  // The last panel stays mounted after it closes, so it can animate out.
  const lastPanel = useRef<PanelId | null>(null);
  if (panel) lastPanel.current = panel;
  const shownPanel = panel ?? lastPanel.current;
  const PanelView = shownPanel && !system ? panels[shownPanel] : null;

  // The prompt stays mounted after it is answered, so it can fade out.
  const lastPrompt = useRef<PromptKind | null>(null);
  if (prompt) lastPrompt.current = prompt;
  const kind = prompt ?? lastPrompt.current;
  // Android saves to MediaStore without asking, so it never shows a Photos prompt.
  const showPrompt =
    kind !== null && !system && !(platform === "android" && kind === "photosAddOnly");

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
        <div className="proto-screen" data-route={route} data-system={system ?? undefined}>
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
            onAllow={() => dispatch({ type: "answerPrompt", device: id, kind, allow: true })}
            onDeny={() => dispatch({ type: "answerPrompt", device: id, kind, allow: false })}
            container={screen}
          />
        )}
      </DeviceFrame>
    </DeviceViewContext.Provider>
  );
}
